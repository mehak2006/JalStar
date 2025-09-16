import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

def load_and_prepare(csv_path: str):
    df = pd.read_csv(csv_path, parse_dates=['Date']).set_index('Date')
    df['Water_Level'] = df['Water_Level'].interpolate(method='linear')

    scaler = MinMaxScaler(feature_range=(0,1))
    df['Scaled_WL'] = scaler.fit_transform(df[['Water_Level']])
    return df, scaler

def create_sequences(data, lookback=15):
    X, y = [], []
    for i in range(lookback, len(data)):
        X.append(data[i-lookback:i])
        y.append(data[i])
    return np.array(X), np.array(y)
