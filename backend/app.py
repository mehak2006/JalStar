print(">>> LOADING THIS APP.PY <<<")

from fastapi import FastAPI, HTTPException
from backend.services.forecast import forecast_future

app = FastAPI()

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
