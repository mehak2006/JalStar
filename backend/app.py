print(">>> LOADING THIS APP.PY <<<")
# run with: uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000

import os

from dotenv import load_dotenv

# ensure we read backend/.env regardless of CWD
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)
print(f"🔐 Loaded env from: {dotenv_path}")
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

from backend.db import init_db, get_session
from backend.models.subscriber import Subscriber
from backend.services import scheduler, notification
from backend.services.forecast import forecast_future
from backend.services.db import get_station_data

# ------------------ Pydantic models ------------------

class SubscriberRequest(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    preferredChannel: str = "both"

class SubscribeResponse(BaseModel):
    ok: bool
    id: int
    message: Optional[str] = None

class SubscriberOut(BaseModel):
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    preferred_channel: str
    active: bool
    last_alert_sent_at: Optional[str]

# ------------------ Email import ------------------

try:
    from backend.services.email_service import send_alert_email
except Exception as e:
    print("⚠ Email service disabled due to error:", e)
    def send_alert_email(*args, **kwargs):
        print("⚠ Dummy email alert: skipped")

# ------------------ Setup ------------------


init_db()

DEV_TRIGGER_TOKEN = os.getenv("DEV_TRIGGER_TOKEN", "dev-secret")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Health ------------------

@app.get("/")
def read_root():
    return {"message": "Hello, world!"}

@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}

# ------------------ Subscription ------------------

@app.post("/api/subscribe", response_model=SubscribeResponse)
def subscribe(data: SubscriberRequest):
    name = data.name
    email = data.email
    phone = data.phone
    preferred = data.preferredChannel

    if not name:
        raise HTTPException(status_code=400, detail="Name required")
    if not email and not phone:
        raise HTTPException(status_code=400, detail="Email or phone required")

    with get_session() as session:
        existing = None
        if email:
            existing = session.query(Subscriber).filter_by(email=email).first()
        if not existing and phone:
            existing = session.query(Subscriber).filter_by(phone=phone).first()

        if existing:
            existing.active = True
            existing.preferred_channel = preferred
            session.commit()
            return {"ok": True, "id": existing.id, "message": "Updated existing subscriber"}

        sub = Subscriber(
            name=name,
            email=email,
            phone=phone,
            preferred_channel=preferred,
        )
        session.add(sub)
        session.commit()
        return {"ok": True, "id": sub.id}

@app.get("/api/subscribers", response_model=List[SubscriberOut])
def list_subscribers():
    with get_session() as session:
        subs = session.query(Subscriber).all()
        return [
            {
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "phone": s.phone,
                "preferred_channel": s.preferred_channel,
                "active": s.active,
                "last_alert_sent_at": s.last_alert_sent_at.isoformat() if s.last_alert_sent_at else None,
            }
            for s in subs
        ]

@app.get("/api/trigger-test")
def trigger_test(token: str = Query(...)):
    if token != DEV_TRIGGER_TOKEN:
        raise HTTPException(status_code=403, detail="Unauthorized")

    now = datetime.now(timezone.utc)
    summary = notification.notify_subscribers(
        level="critical",
        station_id="TEST_STATION",
        reading_value=-42.0,
        timestamp=now,
    )
    return {"ok": True, "summary": summary}

# ------------------ Forecast & Data ------------------

@app.get("/forecast/{station_id}")
def get_forecast(station_id: str, n_future: int = 7):
    try:
        return forecast_future(station_id=station_id, n_future=n_future)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{station_id}")
def get_history(station_id: str, days: int = 7):
    docs = get_station_data(station_id, limit=days)
    if not docs:
        return {"station_id": station_id, "history": []}

    history = [
        {"date": str(d["ts"].date()), "water_level": float(d.get("gw_level_smoothed", d["gw_level"]))}
        for d in docs
    ]
    return {"station_id": station_id, "count": len(history), "history": history}

@app.get("/stations")
def get_stations():
    from backend.services.db import db
    stations = list(db.latest.find({}, {"_id": 0, "station_id": 1, "lat": 1, "lon": 1, "name": 1}))
    return {"stations": stations}

@app.get("/latest/{station_id}")
def get_latest(station_id: str):
    from backend.services.db import db
    doc = db.latest.find_one({"station_id": station_id}, {"_id": 0})
    if not doc:
        return {"station_id": station_id, "currentLevel": None}
    return {
        "station_id": station_id,
        "currentLevel": doc["last"]["gw_level_smoothed"] if "last" in doc else None,
        "ts": doc.get("ts"),
        "lat": doc.get("lat") or doc.get("meta", {}).get("lat"),
        "lon": doc.get("lon") or doc.get("meta", {}).get("lon"),
        "name": doc.get("name")
    }

# ------------------ Startup ------------------

@app.on_event("startup")
def startup_event():
    scheduler.start_scheduler()
    print("✅ Scheduler started")
