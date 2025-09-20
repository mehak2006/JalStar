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

// ✅ TypingTitle
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
        className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]"
        animate={{
          textShadow: [
            "0 0 10px #3b82f6",
            "0 0 25px #6366f1",
            "0 0 10px #3b82f6",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {displayed}
      </motion.span>
      <span className="animate-pulse text-blue-400">|</span>
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
    <main className="max-w-[100%] bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 overflow-hidden">
      <Header />

      {/* HERO */}
      <section className="px-6 py-16 grid gap-12 items-center lg:grid-cols-2">
        {/* Text side */}
        <div className="space-y-6 text-center lg:text-center">
          <TypingTitle text={projectName} />

          <p className="text-slate-300 text-2xl md:text-xl max-w-xl mx-auto lg:mx-auto">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-center">
            <span className="inline-block bg-slate-800/80 backdrop-blur-sm text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium shadow border border-slate-700">
              🚀 Innovation
            </span>
            <span className="inline-block bg-slate-800/80 backdrop-blur-sm text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium shadow border border-slate-700">
              👥 Team: {Array.isArray(teamName) ? teamName.join(", ") : teamName}
            </span>
            <span className="inline-block bg-slate-800/80 backdrop-blur-sm text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium shadow border border-slate-700">
              🌍 Real-world use
            </span>
          </div>

          <p className="text-slate-300 text-xl max-w-prose mx-auto lg:mx-auto text-center lg:text-center">
            JalSthar transforms raw DWLR telemetry into actionable insights.
            From farmers to researchers, anyone can track depletion, forecast
            water levels, and receive alerts that matter — empowering
            sustainable water management.
          </p>

          <div className="flex gap-4 items-center justify-center lg:justify-center">
            <a
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition no-underline"
              href="#map"
            >
              🌐 View Map
            </a>
            <a
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800/80 backdrop-blur-sm text-blue-400 border border-slate-600 font-medium shadow hover:bg-slate-700/80 transition no-underline"
              href="#docs"
            >
              📑 Project Docs
            </a>
          </div>
        </div>

        {/* Image side */}
        <motion.div className="relative w-full h-80 md:h-[28rem] flex justify-center items-center rounded-3xl overflow-hidden shadow-2xl">
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
        </motion.div>
      </section>

      {/* CARDS */}
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
                boxShadow: "0px 20px 40px rgba(59,130,246,0.3)",
              }}
              className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 shadow-2xl cursor-pointer overflow-hidden transition group w-full"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl" />
              
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
              
              {/* Content in row layout */}
              <div className="relative z-10 flex items-start gap-6">
                {/* Icon area */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <span className="text-2xl font-bold text-white">
                      {i === 0 ? '⚙️' : i === 1 ? '🎯' : i === 2 ? '🚨' : '🔬'}
                    </span>
                  </div>
                </div>
                
                {/* Text content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white relative z-10 mb-3 group-hover:text-blue-300 transition-colors duration-300">
                    {c.title}
                  </h3>
                  <p className="text-slate-300 relative z-10 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {c.desc}
                  </p>
                  {c.cta && (
                    <a
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-cyan-400 hover:underline relative z-10 transition-colors duration-300"
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

      {/* FOOTER STATS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 py-6 bg-slate-800/80 backdrop-blur-sm text-sm text-slate-300 flex flex-wrap gap-6 justify-center rounded-t-2xl border-t border-slate-700"
      >
        <div>📡 Stations: 5,260</div>
        <div>⏱ Latest update: 2025-09-19 14:00</div>
        <div>💧 Data Source: DWLR telemetry</div>
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