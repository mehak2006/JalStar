import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

def load_and_prepare(csv_path: str, lookback=15, window=7, threshold=3, jump_limit=10):
    # Load and parse
    df = pd.read_csv(csv_path, parse_dates=['Date']).set_index('Date')

    # --- Domain rule: unrealistic sudden jumps ---
    df['Delta'] = df['Water_Level'].diff()
    df.loc[df['Delta'].abs() > jump_limit, 'Water_Level'] = np.nan
    df.drop(columns='Delta', inplace=True)

    # --- Outlier handling with rolling median ---
    rolling_median = df['Water_Level'].rolling(window=window, center=True, min_periods=1).median()
    rolling_dev = (df['Water_Level'] - rolling_median).abs()
    mad = rolling_dev.median()  # Median absolute deviation
    df.loc[rolling_dev > threshold * mad, 'Water_Level'] = np.nan

    # --- Missing values handling ---
    df['Water_Level'] = df['Water_Level'].interpolate(method='linear')

    # --- Scaling ---
    scaler = MinMaxScaler(feature_range=(0,1))
    df['Scaled_WL'] = scaler.fit_transform(df[['Water_Level']])

    # --- Sequence creation ---
    data = df['Scaled_WL'].values
    X, y = [], []
    for i in range(lookback, len(data)):
        X.append(data[i-lookback:i])
        y.append(data[i])

    return df, scaler, np.array(X), np.array(y)
