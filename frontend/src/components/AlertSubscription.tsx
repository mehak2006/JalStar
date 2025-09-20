import React, { useState } from "react";
import axios from "axios";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Bell, MessageSquare, Mail, Smartphone, AlertTriangle } from "lucide-react";

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
        setMessage("Subscription successful! You'll receive groundwater alerts.");
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 pt-32">
        <div className="w-full max-w-md">
          {/* Main subscription card */}
          <div className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl p-8 ring-1 ring-blue-200/50 border border-blue-100">
            {/* Header section */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Alert Subscription
              </h2>
              <p className="text-slate-600 mt-2 font-medium">
                Stay informed with groundwater level alerts
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div>
                <label className="block text-slate-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 bg-white/90 border-blue-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 shadow-sm rounded-xl py-3 ring-1 ring-blue-100/50 h-12 transition-colors duration-200"
                />
              </div>

              {/* Email field */}
              <div>
                <label className="block text-slate-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 bg-white/90 border-blue-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 shadow-sm rounded-xl py-3 ring-1 ring-blue-100/50 h-12 transition-colors duration-200"
                />
              </div>

              {/* Phone field */}
              <div>
                <label className="block text-slate-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 bg-white/90 border-blue-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 shadow-sm rounded-xl py-3 ring-1 ring-blue-100/50 h-12 transition-colors duration-200"
                />
              </div>

              {/* Preferred channel */}
              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  Preferred Alert Channel
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="preferredChannel"
                      value="both"
                      checked={formData.preferredChannel === "both"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl text-center transition-all duration-200 ring-1 ${
                      formData.preferredChannel === "both"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg ring-blue-300"
                        : "bg-blue-50 text-slate-700 hover:bg-blue-100 ring-blue-200"
                    }`}>
                      <MessageSquare className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Both</span>
                    </div>
                  </label>
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="preferredChannel"
                      value="email"
                      checked={formData.preferredChannel === "email"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl text-center transition-all duration-200 ring-1 ${
                      formData.preferredChannel === "email"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg ring-blue-300"
                        : "bg-blue-50 text-slate-700 hover:bg-blue-100 ring-blue-200"
                    }`}>
                      <Mail className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                  </label>
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="preferredChannel"
                      value="sms"
                      checked={formData.preferredChannel === "sms"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl text-center transition-all duration-200 ring-1 ${
                      formData.preferredChannel === "sms"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg ring-blue-300"
                        : "bg-blue-50 text-slate-700 hover:bg-blue-100 ring-blue-200"
                    }`}>
                      <Smartphone className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">SMS</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Bell className="h-5 w-5 mr-2 inline" />
                {loading ? "Subscribing..." : "Subscribe to Alerts"}
              </button>
            </form>

            {/* Status messages */}
            {message && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 ring-1 ring-emerald-100">
                <p className="text-center text-sm text-emerald-700 font-medium flex items-center justify-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  {message}
                </p>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 ring-1 ring-red-100">
                <p className="text-center text-sm text-red-700 font-medium flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6 shadow-lg ring-1 ring-blue-200/50 border border-blue-100">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Alert Types</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">🚨</div>
                  <p className="text-slate-600 font-medium">Critical Levels</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📈</div>
                  <p className="text-slate-600 font-medium">Trend Changes</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔔</div>
                  <p className="text-slate-600 font-medium">Daily Updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AlertSubscription;