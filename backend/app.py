from fastapi import FastAPI
from services.preprocess import load_and_prepare
from services.forecast import forecast_future

app = FastAPI()

@app.get("/forecast")
def get_forecast():
    df, scaler = load_and_prepare("data/clean_groundwater_daily.csv")
    values = df['Scaled_WL'].values
    result = forecast_future("models/groundwater_lstm.h5", scaler, values)
    return result
