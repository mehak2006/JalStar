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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 p-6 pt-24">
        <div className="w-full max-w-md rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl p-8">
          <h2 className="mb-2 text-center text-2xl font-semibold text-white">
            Subscribe to JalSthar Alerts
          </h2>
          <p className="mb-6 text-center text-sm text-slate-600 dark:text-slate-300">
            Get groundwater updates via Email or SMS
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2">
                Preferred Channel
              </label>
              <select
                name="preferredChannel"
                value={formData.preferredChannel}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-md px-3 py-2"
              >
                <option value="both">Both</option>
                <option value="email">Email only</option>
                <option value="sms">SMS only</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Subscribe"}
            </button>
          </form>

          {/* Status messages */}
          {message && (
            <p className="mt-4 text-center text-sm text-emerald-400 font-medium">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 text-center text-sm text-red-400 font-medium">
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