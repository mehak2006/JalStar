# backend/services/forecast.py
import numpy as np
from tensorflow.keras.models import load_model  # type: ignore
import joblib
from backend.services.classify import classify_level, trend_alert
from backend.services.preprocess import load_and_prepare
from backend.services.db import insert_forecast   # new helper to save forecasts

# === Paths ===
MODEL_PATH = "backend/models/groundwater_lstm.keras"   # trained LSTM model
SCALER_PATH = "backend/models/scaler.gz"

# === Load model + scaler once at import time ===
try:
    model = load_model(MODEL_PATH, compile=False)   # no optimizer/loss needed for inference
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    print(f"⚠️ Failed to load model or scaler: {e}")
    model, scaler = None, None


def forecast_future(station_id: str, n_future: int = 7, lookback: int = 15):
    """
    Forecast groundwater levels for the next `n_future` timesteps for a given station.
    Fetches recent data from MongoDB (via preprocess), applies model, and saves forecast back to DB.
    """
    if model is None or scaler is None:
        raise RuntimeError("Model or scaler not loaded. Check paths in forecast.py.")

    # Load latest cleaned dataset from MongoDB
    df, _, X, y = load_and_prepare(station_id, lookback=lookback)
    if df is None or len(df) < lookback:
        raise ValueError(f"Not enough data for {station_id}: need at least {lookback} points")

    # Get scaled values (already scaled inside preprocess)
    values = df["Scaled_WL"].values

    # Start with the last `lookback` window
    last_seq = values[-lookback:].reshape((1, lookback, 1))
    future_preds = []

    for _ in range(n_future):
        pred_scaled = model.predict(last_seq, verbose=0)
        pred = scaler.inverse_transform(pred_scaled)[0][0]
        future_preds.append(float(pred))

        # roll window forward with scaled prediction
        last_seq = np.append(last_seq[:, 1:, :], pred_scaled.reshape(1, 1, 1), axis=1)

    # classify & detect trend
    mean_val = sum(future_preds) / len(future_preds)
    mean_category = classify_level(mean_val)
    trend = trend_alert(future_preds)

    result = {
        "station_id": station_id,
        "predictions": future_preds,
        "mean_category": mean_category,
        "trend": trend
    }

    # Save forecast back into MongoDB
    try:
        insert_forecast(station_id, result)
    except Exception as e:
        print(f"⚠️ Failed to insert forecast for {station_id}: {e}")

    return result
