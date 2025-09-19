print(">>> LOADING THIS APP.PY <<<")
# python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
from fastapi import FastAPI, HTTPException
from backend.services.forecast import forecast_future
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



# Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, world!"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/forecast")
def get_forecast(n_future: int = 7):
    try:
        return forecast_future(n_future=n_future)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(days: int = 7):
    import pandas as pd
    
    df = pd.read_csv("backend/data/clean_groundwater_daily.csv", parse_dates=["Date"])
    df = df.dropna(subset=["Water_Level"])  # just in case

    # keep only last `days`
    df_recent = df.tail(days)

    records = [
        {"date": row.Date.strftime("%Y-%m-%d"), "water_level": float(row.Water_Level)}
        for row in df_recent.itertuples()
    ]

    return {"days": days, "history": records}
