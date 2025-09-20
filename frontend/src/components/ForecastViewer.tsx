import { useEffect, useState } from "react";
import { getForecast } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function ForecastViewer() {
  const [stationId, setStationId] = useState<string>("DWLR_001");
  const [data, setData] = useState<any[]>([]);
  const [trend, setTrend] = useState<string>("");
  const [meanCategory, setMeanCategory] = useState<string>("");

  useEffect(() => {
    getForecast(stationId, 7).then((json) => {
      const formatted = json.predictions.map((p: number, i: number) => ({
        day: `Day ${i + 1}`,
        prediction: p,
      }));
      setData(formatted);
      setTrend(json.trend);
      setMeanCategory(json.mean_category);
    });
  }, [stationId]);

  if (!data.length) return <div>Loading forecast…</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="text-xl font-bold mb-2">
        7-Day Groundwater Forecast ({stationId})
      </h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Station:</label>
        <select
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="DWLR_001">DWLR_001</option>
          <option value="DWLR_002">DWLR_002</option>
          <option value="DWLR_003">DWLR_003</option>
        </select>
      </div>

      <p className="mb-2">
        Trend: <strong>{trend}</strong>
      </p>
      <p className="mb-4">
        Mean category: <strong>{meanCategory}</strong>
      </p>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="prediction" stroke="#2563eb" dot />
            {/* Threshold lines */}
            <ReferenceLine y={-10} stroke="green" strokeDasharray="3 3" />
            <ReferenceLine y={-20} stroke="orange" strokeDasharray="3 3" />
            <ReferenceLine y={-40} stroke="red" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
