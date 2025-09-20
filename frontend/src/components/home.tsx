// src/pages/home.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./ui/header";
import Footer from "./ui/footer";

interface HomeProps {
  projectName: string;
  tagline: string;
  teamName: string | string[];
  imageSrc: string[];
  cards: Array<{
    title: string;
    desc: string;
    stat?: string;
    cta?: { text: string; href: string };
  }>;
}

const DEFAULT_CARDS: HomeProps["cards"] = [
  {
    title: "How It Works",
    desc: "DWLR sensors → Time-series DB → ML forecasts → Maps & alerts. End-to-end real-time pipeline.",
  },
  {
    title: "What It Has",
    desc: "Heatmaps, dashboards, role-based access, multi-language UI, and a research-friendly API layer.",
  },
  {
    title: "Realtime & Alerts",
    desc: "Threshold-based detection & ML anomalies trigger SMS, push notifications, and live dashboards.",
  },
  {
    title: "Research Tools",
    desc: "Downloadable datasets, explainable forecasts, and rich visualization for scientists & policymakers.",
  },
];

// ✅ TypingTitle with blue gradient theme
function TypingTitle({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text[i]);
        setI((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setDisplayed("");
          setI(0);
        }, 1500);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [i, text]);

  return (
    <h1 className="pt-20 text-4xl md:text-6xl font-extrabold text-center">
      <motion.span
        className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent"
        animate={{
          backgroundPosition: ["0%", "100%", "0%"],
        }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        {displayed}
      </motion.span>
      <span className="animate-pulse text-blue-500">|</span>
    </h1>
  );
}

const Home: React.FC<HomeProps> = ({
  projectName,
  tagline,
  teamName,
  imageSrc,
  cards,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % imageSrc.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [imageSrc]);

  return (
    <main className="max-w-[100%] bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen overflow-hidden">
      <Header />

      {/* HERO Section with dashboard theme */}
      <section className="px-6 py-16 grid gap-12 items-center lg:grid-cols-2 pt-32">
        {/* Text side */}
        <div className="space-y-6 text-center lg:text-center">
          <TypingTitle text={projectName} />

          <p className="text-slate-700 text-2xl md:text-xl max-w-xl mx-auto lg:mx-auto font-medium">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-center">
            <span className="inline-block bg-white/95 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-blue-100 ring-1 ring-blue-200/50">
              🚀 Innovation
            </span>
            <span className="inline-block bg-white/95 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-blue-100 ring-1 ring-blue-200/50">
              👥 Team: {Array.isArray(teamName) ? teamName.join(", ") : teamName}
            </span>
            <span className="inline-block bg-white/95 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-blue-100 ring-1 ring-blue-200/50">
              🌍 Real-world use
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg ring-1 ring-blue-200/50 border border-blue-100">
            <p className="text-slate-700 text-lg max-w-prose mx-auto lg:mx-auto text-center lg:text-center leading-relaxed">
              JalSthar transforms raw DWLR telemetry into actionable insights.
              From farmers to researchers, anyone can track depletion, forecast
              water levels, and receive alerts that matter — empowering
              sustainable water management.
            </p>
          </div>

          <div className="flex gap-4 items-center justify-center lg:justify-center">
            <a
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline"
              href="#map"
            >
              🌐 View Map
            </a>
            <a
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/95 backdrop-blur-sm text-blue-600 border border-blue-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 hover:bg-blue-50 transition-all duration-300 no-underline ring-1 ring-blue-200/50"
              href="#docs"
            >
              📑 Project Docs
            </a>
          </div>
        </div>

        {/* Image side with dashboard styling */}
        <motion.div className="relative w-full h-80 md:h-[28rem] flex justify-center items-center rounded-3xl overflow-hidden shadow-2xl ring-1 ring-blue-200/50 border border-blue-100">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={imageSrc[index]}
              alt="Groundwater visualization"
              className="w-full h-full object-cover"
              loading="lazy"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
          
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* CARDS Section with dashboard theme */}
      <section className="relative z-10 px-6 mt-20">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {cards.map((c, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 25px 50px rgba(59,130,246,0.15)",
              }}
              className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-lg ring-1 ring-blue-200/50 border border-blue-100 cursor-pointer overflow-hidden transition-all duration-300 group w-full hover:shadow-xl"
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl" />
              
              {/* Content in row layout */}
              <div className="relative z-10 flex items-start gap-6">
                {/* Icon area with dashboard styling */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <span className="text-2xl font-bold text-white">
                      {i === 0 ? '⚙️' : i === 1 ? '🎯' : i === 2 ? '🚨' : '🔬'}
                    </span>
                  </div>
                </div>
                
                {/* Text content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 relative z-10 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {c.title}
                  </h3>
                  <p className="text-slate-700 relative z-10 leading-relaxed group-hover:text-slate-800 transition-colors duration-300">
                    {c.desc}
                  </p>
                  {c.cta && (
                    <a
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-cyan-500 hover:underline relative z-10 transition-colors duration-300"
                      href={c.cta.href}
                    >
                      {c.cta.text}
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* FOOTER STATS with dashboard theme */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 py-6 bg-white/95 backdrop-blur-sm text-sm text-slate-700 flex flex-wrap gap-6 justify-center rounded-t-2xl shadow-lg ring-1 ring-blue-200/50 border-t border-blue-100"
      >
        <div className="bg-blue-50 px-4 py-2 rounded-full font-semibold text-blue-700">📡 Stations: 5,260</div>
        <div className="bg-cyan-50 px-4 py-2 rounded-full font-semibold text-cyan-700">⏱ Latest update: 2025-09-19 14:00</div>
        <div className="bg-teal-50 px-4 py-2 rounded-full font-semibold text-teal-700">💧 Data Source: DWLR telemetry</div>
      </motion.div>
    </main>
  );
};

export default function HomePage() {
  return (
    <>
      <Home
        projectName="JalSthar — Groundwater Level Detection"
        tagline="Real-time national-scale groundwater monitoring using DWLR network"
        teamName="BlueMetrics"
        imageSrc={[
          "/istockphoto-686935440-612x612.jpg",
          "/istockphoto-1300343679-612x612.jpg",
          "/WhatsApp Image 2025-09-20 at 18.45.28_59d575d3.jpg",
        ]}
        cards={DEFAULT_CARDS}
      />
      <Footer/>
    </>
  );
}