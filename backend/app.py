print(">>> LOADING THIS APP.PY <<<")
# run with: python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.services.forecast import forecast_future
from backend.services.db import get_station_data  # <-- new import
from backend.services.email_service import send_alert_email
from typing import Optional
# backend/app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timezone

from backend.db import init_db, get_session
from backend.models.subscriber import Subscriber
from backend.services import scheduler, notification
from backend.services import scheduler

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize DB + tables
init_db()

DEV_TRIGGER_TOKEN = os.getenv("DEV_TRIGGER_TOKEN", "dev-secret")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "time": datetime.now(timezone.utc).isoformat()})


@app.route("/api/subscribe", methods=["POST"])
def subscribe():
    """
    Subscribe a user to alerts.
    JSON body: {name, email?, phone?, preferredChannel?}
    """
    data = request.get_json(force=True)
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    preferred = data.get("preferredChannel", "both")

    if not name:
        return jsonify({"ok": False, "error": "Name required"}), 400
    if not email and not phone:
        return jsonify({"ok": False, "error": "Email or phone required"}), 400

    with get_session() as session:
        # Check if already subscribed
        existing = None
        if email:
            existing = session.query(Subscriber).filter_by(email=email).first()
        if not existing and phone:
            existing = session.query(Subscriber).filter_by(phone=phone).first()

        if existing:
            existing.active = True
            existing.preferred_channel = preferred
            session.commit()
            return jsonify({"ok": True, "id": existing.id, "message": "Updated existing subscriber"})

        sub = Subscriber(
            name=name,
            email=email,
            phone=phone,
            preferred_channel=preferred,
        )
        session.add(sub)
        session.commit()
        return jsonify({"ok": True, "id": sub.id})


@app.route("/api/trigger-test", methods=["GET"])
def trigger_test():
    """
    Manually trigger a test alert.
    Usage: GET /api/trigger-test?token=DEV_TRIGGER_TOKEN
    """
    token = request.args.get("token")
    if token != DEV_TRIGGER_TOKEN:
        return jsonify({"ok": False, "error": "Unauthorized"}), 403

    now = datetime.now(timezone.utc)
    summary = notification.notify_subscribers(
        level="critical",
        station_id="TEST_STATION",
        reading_value=-42.0,
        timestamp=now,
    )
    return jsonify({"ok": True, "summary": summary})


@app.route("/api/subscribers", methods=["GET"])
def list_subscribers():
    """
    List subscribers (admin/debug only).
    """
    with get_session() as session:
        subs = session.query(Subscriber).all()
        result = [
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
        return jsonify(result)


if __name__ == "__main__":
    # Start background scheduler
    scheduler.start_scheduler()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))

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
