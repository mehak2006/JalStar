import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import joblib
import os

from backend.services.preprocess import load_and_prepare  # use MongoDB version

# === Paths ===
MODEL_PATH = "backend/models/groundwater_lstm.keras"
SCALER_PATH = "backend/models/scaler.gz"

os.makedirs("backend/models", exist_ok=True)

# === Parameters ===
station_id = "DWLR_01"   # choose which station to train on
lookback = 15

# === Load preprocessed station data from MongoDB ===
df, scaler, X, y = load_and_prepare(station_id, lookback=lookback)

if df is None or len(X) == 0:
    raise RuntimeError(f"❌ Not enough data in MongoDB for station {station_id}")

print(f"✅ Loaded {len(df)} records from MongoDB for training")

# === Train/test split ===
train_size = int(len(X) * 0.8)
X_train, y_train = X[:train_size], y[:train_size]
X_test, y_test = X[train_size:], y[train_size:]

X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
X_test = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))

# === LSTM model ===
model = Sequential()
model.add(LSTM(50, activation='tanh', input_shape=(lookback, 1)))
model.add(Dense(1))

model.compile(optimizer='adam', loss='mse')

history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=16,
    validation_data=(X_test, y_test),
    verbose=1
)

# === Save model and scaler ===
model.save(MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)

print(f"✅ Model saved to {MODEL_PATH}")
print(f"✅ Scaler saved to {SCALER_PATH}")
