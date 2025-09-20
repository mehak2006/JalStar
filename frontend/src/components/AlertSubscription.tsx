import React, { useState } from "react";
import axios from "axios";
import Header from "@/components/ui/header";
// import Footer from "@/components/ui/footer";
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
      const res = await axios.post("http://127.0.0.1:8000/api/subscribe", formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.ok) {
        setMessage("✅ Subscription successful! You'll get alerts.");
        setFormData({
          name: "",
          email: "",
          phone: "",
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
    <>
      <Header/>
      {/* Add container with top padding to account for fixed header */}
      <div className="pt-20 min-h-screen py-8">
        <div className="max-w-lg mx-auto mt-8 mb-8 rounded-3xl overflow-hidden shadow-2xl border border-sky-200 bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300/95 ">
          
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white text-center drop-shadow">
              Subscribe to JalSthar Alerts
            </h2>
            <p className="text-sky-100 text-lg text-center">
              Get groundwater updates via Email or SMS
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sky-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full h-12 px-3 border border-sky-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-sky-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full h-12 px-3 border border-sky-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-sky-700 font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 w-full h-12 px-3 border border-sky-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-sky-700 font-medium">
                Preferred Channel
              </label>
              <select
                name="preferredChannel"
                value={formData.preferredChannel}
                onChange={handleChange}
                className="mt-2 w-full h-12 px-3 border border-sky-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              >
                <option value="both">Both</option>
                <option value="email">Email only</option>
                <option value="sms">SMS only</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-lg font-semibold shadow-md hover:from-sky-600 hover:to-blue-700 transition-all"
            >
              {loading ? "Submitting..." : "Subscribe"}
            </button>
          </form>

          {/* Status messages */}
          {message && (
            <p className="px-8 pb-6 text-green-600 font-medium text-center">
              {message}
            </p>
          )}
          {error && (
            <p className="px-8 pb-6 text-red-600 font-medium text-center">
              {error}
            </p>
          )}
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default AlertSubscription;