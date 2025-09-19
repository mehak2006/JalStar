import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB", "dwlr")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

def get_station_data(station_id, limit=500):
    """Fetch last N readings for a station (flat schema)"""
    readings = (
        db.readings.find({"station_id": station_id})
        .sort("ts", -1)
        .limit(limit)
    )
    return list(readings)[::-1]  # reverse chronological to chronological

def insert_forecast(station_id, forecast):
    """Store forecast result into forecast collection"""
    db.forecast.update_one(
        {"station_id": station_id},
        {"$set": {"station_id": station_id, "forecast": forecast}},
        upsert=True,
    )

