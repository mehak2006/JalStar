import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from backend.services.db import get_station_data  # <- uses MongoDB

def load_and_prepare(station_id: str, lookback=15, window=7, threshold=3, jump_limit=10, limit=500):
    docs = get_station_data(station_id, limit=limit)
    if not docs:
        return None, None, None, None

    df = pd.DataFrame(docs)

    # Use flat fields
    if "gw_level_smoothed" in df.columns:
        df["Water_Level"] = df["gw_level_smoothed"]
    else:
        df["Water_Level"] = df["gw_level"]

    df["Date"] = pd.to_datetime(df["ts"])
    df = df.set_index("Date").sort_index()

    # --- Same cleaning logic as before ---
    df['Delta'] = df['Water_Level'].diff()
    df.loc[df['Delta'].abs() > jump_limit, 'Water_Level'] = np.nan
    df.drop(columns='Delta', inplace=True)

    rolling_median = df['Water_Level'].rolling(window=window, center=True, min_periods=1).median()
    rolling_dev = (df['Water_Level'] - rolling_median).abs()
    mad = rolling_dev.median()
    df.loc[rolling_dev > threshold * mad, 'Water_Level'] = np.nan

    df['Water_Level'] = df['Water_Level'].interpolate(method='linear')

    scaler = MinMaxScaler(feature_range=(0,1))
    df['Scaled_WL'] = scaler.fit_transform(df[['Water_Level']])

    data = df['Scaled_WL'].values
    X, y = [], []
    for i in range(lookback, len(data)):
        X.append(data[i-lookback:i])
        y.append(data[i])

    return df, scaler, np.array(X), np.array(y)
