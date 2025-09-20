// services/api.ts
export async function getForecast(stationId: string, n_future: number = 7) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/forecast/${stationId}?n_future=${n_future}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching forecast:", err);
    throw err;
  }
}
