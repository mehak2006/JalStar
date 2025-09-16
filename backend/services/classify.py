def classify_level(wl: float) -> str:
    if wl >= -10:
        return "Safe"
    elif wl >= -20:
        return "Semi-critical"
    elif wl >= -40:
        return "Critical"
    else:
        return "Over-exploited"

def trend_alert(predictions, tolerance=0.05):
    start, end = predictions[0], predictions[-1]
    if end < start - tolerance:
        return "⚠️ Alert: Steady Decline"
    elif end > start + tolerance:
        return "✅ Increasing (Recharge)"
    else:
        return "Stable"
