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
    <h1 className=" pt-20 text-4xl md:text-6xl font-extrabold text-center lg:text-left">
      <motion.span
        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]"
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
      <span className="animate-pulse text-blue-600">|</span>
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
    <main className="max-w-[100%] bg-gradient-to-b from-blue-50 via-white to-blue-100 overflow-hidden dark:bg-gradient-to-b from-black-50 via-gray to-black-100">
      <Header />

      {/* HERO */}
      <section className="px-6 py-16 grid gap-12 items-center lg:grid-cols-2">
        {/* Text side */}
        <div className="space-y-6">
          <TypingTitle text={projectName} />

          <p className="text-gray-700 text-2xl md:text-xl max-w-xl">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <span className="inline-block bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium shadow">
              🚀 Innovation
            </span>
            <span className="inline-block bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium shadow">
              👥 Team: {Array.isArray(teamName) ? teamName.join(", ") : teamName}
            </span>
            <span className="inline-block bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium shadow">
              🌍 Real-world use
            </span>
          </div>

          <p className="text-gray-700 text-xl max-w-prose">
            JalSthar transforms raw DWLR telemetry into actionable insights.
            From farmers to researchers, anyone can track depletion, forecast
            water levels, and receive alerts that matter — empowering
            sustainable water management.
          </p>

          <div className="flex gap-4 items-center">
            <a
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition no-underline"
              href="#map"
            >
              🌐 View Map
            </a>
            <a
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-blue-600 border border-blue-600 font-medium shadow hover:bg-gray-50 transition no-underline"
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
        <div className="grid grid-cols-4 gap-8">
          {cards.map((c, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 15px 30px rgba(59,130,246,0.4)",
              }}
              className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-md cursor-pointer overflow-hidden transition"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 hover:opacity-10 transition duration-500 rounded-2xl" />
              <h3 className="text-xl font-bold text-gray-900 relative z-10">
                {c.title}
              </h3>
              <p className="text-sm text-gray-700 mt-3 relative z-10">
                {c.desc}
              </p>
              {c.cta && (
                <a
                  className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline relative z-10"
                  href={c.cta.href}
                >
                  {c.cta.text}
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      {/* FOOTER STATS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 text-sm text-gray-600 flex flex-wrap gap-6 justify-center rounded-t-2xl"
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
