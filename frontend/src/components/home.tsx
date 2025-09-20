// src/pages/home.tsx
import React from "react";
import { motion } from "framer-motion";
import Header from "./ui/header";
interface HomeProps {
  projectName: string;
  tagline: string;
  teamName: string | string[];
  imageSrc: string;
  cards: Array<{
    title: string;
    desc: string;
    stat?: string;
    cta?: { text: string; href: string };
  }>;
}

const DEFAULT_CARDS: HomeProps["cards"] = [
  {
    title: "How it works",
    desc: "DWLR sensors → Time-series DB → ML forecasts → Maps & alerts. End-to-end real-time pipeline.",
    stat: "Realtime pipeline",
  },
  {
    title: "What it has",
    desc: "Heatmaps, dashboards, role-based access, multi-language UI, and a research-friendly API layer.",
    stat: "Features",
  },
  {
    title: "Realtime & Alerts",
    desc: "Threshold-based detection & ML anomalies trigger SMS, push notifications, and live dashboards.",
    stat: "Critical Alerts",
  },
  {
    title: "Research Tools",
    desc: "Downloadable datasets, explainable forecasts, and rich visualization for scientists & policymakers.",
    stat: "Data + ML",
  },
];

const Home: React.FC<HomeProps> = ({
  projectName,
  tagline,
  teamName,
  imageSrc,
  cards,
}) => {
  return (
    <main className="max-w-[100%] bg-gradient-to-b from-blue-100 to-blue-900 overflow-hidden">
      <Header/>
      {/* HERO */}
      
      <section className="px-4 py-10 grid gap-12 items-center lg:grid-cols-2">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent leading-tight text-center text-black pt-20">
            {projectName}
          </h1>
        {/* IMAGE SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-80 md:h-[28rem] rounded-3xl overflow-hidden shadow-xl p-6 rounded-lg"
        >
          <img
            src={imageSrc}
            alt="Groundwater level visualization"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
          
          </div>
          <h2 className="absolute bottom-4 left-6 text-white text-lg font-semibold">
            Live groundwater insights
          </h2>
        </motion.div>

        {/* INFO SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          
          <p className="text-gray-600 text-lg max-w-xl">{tagline}</p>

          <div className="flex flex-wrap gap-3">
            <span className="inline-block bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium shadow">
              🚀 Innovation
            </span>
            <span className="inline-block bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium shadow">
              👥 Team:{" "}
              {Array.isArray(teamName) ? teamName.join(", ") : teamName}
            </span>
            <span className="inline-block bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium shadow">
              🌍 Real-world use
            </span>
          </div>

          <p className="text-gray-700 max-w-prose">
            GroundWatch transforms raw DWLR telemetry into actionable insights.
            From farmers to researchers, anyone can track depletion, forecast
            water levels, and receive alerts that matter — empowering
            sustainable water management.
          </p>

          <div className="flex gap-4">
            <a
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition no-underline"
              href="#map"
              aria-label="View map"
            >
              🌐 View Map
            </a>
            <a
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg  text-gray-700 hover:bg-gray-50 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105  transition no-underline"
              href="#docs"
              aria-label="Project docs"
            >
              📑 Project Docs
            </a>
          </div>
        </motion.div>
      </section>

      {/* CARDS */}
      <section className="px-4 mt-16 grid gap-8 grid-cols-4 ">
        {cards.map((c, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 hover:-translate-y-2 transition transform"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">{c.title}</h3>
              {c.stat ? (
                <span className="text-xs text-indigo-600 font-medium">
                  {c.stat}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {c.desc}
            </p>
            {c.cta ? (
              <a
                className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                href={c.cta.href}
              >
                {c.cta.text}
              </a>
            ) : null}
          </motion.article>
        ))}
      </section>

      {/* FOOTER STATS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-14 text-sm text-gray-500 flex flex-wrap gap-6 justify-center"
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
    <Home
      projectName="JalSthar — Groundwater Level Detection"
      tagline="Real-time national-scale groundwater monitoring using DWLR network"
      teamName="BlueMetrics"
      imageSrc="frontend\src\img\istockphoto-686935440-612x612.jpg"
      cards={DEFAULT_CARDS}
    />
  );
}
