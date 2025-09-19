import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

export default function HistoryViewer() {
  const [days, setDays] = useState<number>(7);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/history?days=${days}`)
      .then(res => res.json())
      .then(json => {
        const formatted = json.history.map((d: any) => ({
          date: d.date,
          water_level: d.water_level,
        }));
        setData(formatted);
      })
      .catch(console.error);
  }, [days]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="text-xl font-bold mb-4">Groundwater Levels (History)</h2>

      {/* Dropdown selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Select period:</label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          <option value={7}>Last 7 days</option>
          <option value={15}>Last 15 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {/* Line chart */}
      {data.length ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="water_level" stroke="#10b981" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>Loading history…</div>
      )}

      
    </div>
  );
}
