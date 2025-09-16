import pandas as pd

def clean_raw_file(raw_file: str, out_dir: str = "data/"):
    # Step 1: Find the header row index
    with open(raw_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    header_line = None
    for i, line in enumerate(lines):
        if "Data Type Code" in line:
            header_line = i
            break

    if header_line is None:
        raise ValueError("Could not find header row with 'Data Type Code'")

    # Step 2: Load data starting from header
    df = pd.read_csv(raw_file, skiprows=header_line)

    # Step 3: Keep only Date and Water_Level
    df = df[['Data Time', 'Data Value']].rename(
        columns={'Data Time': 'Date', 'Data Value': 'Water_Level'}
    )

    # Step 4: Convert Date column to datetime
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

    # Step 5: Drop rows without valid dates
    df = df.dropna(subset=['Date'])

    # Step 6: Save clean 6-hourly data
    hourly_path = out_dir + "clean_groundwater.csv"
    df.to_csv(hourly_path, index=False)

    # Step 7: Save daily averages
    daily_path = out_dir + "clean_groundwater_daily.csv"
    df_daily = df.set_index('Date').resample('D').mean().reset_index()
    df_daily.to_csv(daily_path, index=False)

    return hourly_path, daily_path

if __name__ == "__main__":
    hourly, daily = clean_raw_file("data/hauz_khas_dwlr.csv", out_dir="data/")
    print("Files created:", hourly, daily)
