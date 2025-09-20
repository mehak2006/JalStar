print(">>> LOADING THIS APP.PY <<<")
# run with: python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.services.forecast import forecast_future
from backend.services.db import get_station_data  # <-- new import
from backend.services.email_service import send_alert_email
from typing import Optional
app = FastAPI()

WATER_LEVEL_THRESHOLD = -9.0  # 9 meters below ground
ALERT_EMAIL = "jyotikumarisingh881@gmail.com"  # To be replaced with actual email

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

@app.get("/forecast/{station_id}")
def get_forecast(station_id: str, n_future: int = 7):
    try:
        return forecast_future(station_id=station_id, n_future=n_future)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/history/{station_id}")
def get_history(station_id: str, days: int = 7):
    from backend.services.db import get_station_data

    # Instead of filtering by datetime, just fetch N docs
    docs = get_station_data(station_id, limit=days)
    if not docs:
        return {"station_id": station_id, "history": []}

    history = [
        {"date": str(d["ts"].date()), "water_level": float(d.get("gw_level_smoothed", d["gw_level"]))}
        for d in docs
    ]
    return {"station_id": station_id, "count": len(history), "history": history}
