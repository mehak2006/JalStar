import React, { useState } from "react";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  phone: string;
  preferredChannel: "sms" | "email" | "both";
}

const AlertSubscription: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    preferredChannel: "both",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post("/api/subscribe", formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.ok) {
        setMessage("✅ Subscription successful! You'll get alerts.");
        setFormData({
          name: "Jyoti",
          email: "jyotikumarisingh881@gmail.com",
          phone: "7024887608",
          preferredChannel: "both",
        });
      } else {
        setError("Subscription failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Subscribe to Groundwater Alerts</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Preferred Channel</label>
          <select
            name="preferredChannel"
            value={formData.preferredChannel}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
          >
            <option value="both">Both</option>
            <option value="email">Email only</option>
            <option value="sms">SMS only</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Subscribe"}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AlertSubscription;
