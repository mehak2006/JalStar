# backend/services/forecast.py
import numpy as np
from tensorflow.keras.models import load_model # type: ignore
import joblib
import pandas as pd
from backend.services.classify import classify_level, trend_alert

# === Paths ===
MODEL_PATH = "backend/models/groundwater_lstm.keras"   # use .keras not .h5
SCALER_PATH = "backend/models/scaler.gz"
DATA_PATH = "backend/data/clean_groundwater_daily.csv"

# === Load model + scaler once at import time ===
try:
    model = load_model(MODEL_PATH, compile=False)   # no optimizer/loss needed for inference
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    print(f"⚠️ Failed to load model or scaler: {e}")
    model, scaler = None, None


def forecast_future(n_future: int = 7, lookback: int = 15):
    """
    Forecasts groundwater levels for the next `n_future` days.
    Returns dict with predictions, categories, and trend.
    """
    if model is None or scaler is None:
        raise RuntimeError("Model or scaler not loaded. Check paths in forecast.py.")

    # Load latest cleaned dataset
    df = pd.read_csv(DATA_PATH, parse_dates=['Date']).set_index('Date')
    df['Water_Level'] = df['Water_Level'].interpolate(method='linear')

    # Get scaled values
    values = scaler.transform(df[['Water_Level']]).flatten()

    if len(values) < lookback:
        raise ValueError(f"Not enough data: need at least {lookback} points, got {len(values)}")

    # Start with the last `lookback` window
    last_seq = values[-lookback:].reshape((1, lookback, 1))
    future_preds = []

    for _ in range(n_future):
        pred_scaled = model.predict(last_seq, verbose=0)
        pred = scaler.inverse_transform(pred_scaled)[0][0]
        future_preds.append(float(pred))

        # roll window forward
        pred_scaled = pred_scaled.reshape(1, 1, 1)  # still scaled
        last_seq = np.append(last_seq[:, 1:, :], pred_scaled, axis=1)

    mean_val = sum(future_preds) / len(future_preds)
    mean_category = classify_level(mean_val)
    trend = trend_alert(future_preds)

    return {
        "predictions": future_preds,
        "mean_category": mean_category,
        "trend": trend
    }
