
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import LSTM, Dense # type: ignore
import joblib
import os

# === Paths ===
DATA_PATH = "backend/data/clean_groundwater_daily.csv"
MODEL_PATH = "backend/models/groundwater_lstm.keras"
SCALER_PATH = "backend/models/scaler.gz"

os.makedirs("models", exist_ok=True)

# === Load cleaned daily data ===
df = pd.read_csv(DATA_PATH, parse_dates=['Date']).set_index('Date')
df['Water_Level'] = df['Water_Level'].interpolate(method='linear')

# === Scale values ===
scaler = MinMaxScaler(feature_range=(0, 1))
df['Scaled_WL'] = scaler.fit_transform(df[['Water_Level']])

# === Sequence creator ===
def create_sequences(data, lookback=15):
    X, y = [], []
    for i in range(lookback, len(data)):
        X.append(data[i-lookback:i])
        y.append(data[i])
    return np.array(X), np.array(y)

lookback = 15
values = df['Scaled_WL'].values
X, y = create_sequences(values, lookback)

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
