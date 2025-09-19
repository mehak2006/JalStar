"use client";
import { useEffect } from "react";
import Header from "@/components/ui/header";
const States = () => {
  useEffect(() => {
    // Load external scripts dynamically (same order as HTML)
    const scripts = [
      "https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js",
      "https://api.tiles.mapbox.com/mapbox.js/v2.2.2/mapbox.js",
      "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",
      "../js/jquery-1.10.2.min.js",
      "../js/bootstrap-3.0.3.min.js",
      "../js/highlight.pack.js",
      "https://cdnjs.cloudflare.com/ajax/libs/d3/3.3.0/d3.min.js",
      "../bower_components/leaflet/dist/leaflet.js",
      "../js/mapsplot.js",
    ];

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      document.body.appendChild(script);
    });

    // Initialize map when ready
    (window as any).$(document).ready(function () {
      if (typeof (window as any).plotStates === "function") {
        (window as any).plotStates("statesmap");
      }
    });
  }, []);

  return (
    <>
      <title>States - Community Created Maps of India</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="None" />
      <link rel="shortcut icon" href="../img/favicon.ico" />

      {/* CSS Links */}
      <link href="../css/bootstrap-custom.min.css" rel="stylesheet" />
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="//cdn.jsdelivr.net/font-hack/2.018/css/hack.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=PT+Sans:400,400italic,700,700italic&subset=latin-ext,latin"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,700italic,400,300,600,700&subset=latin-ext,latin"
        rel="stylesheet"
      />
      <link href="../css/base.css" rel="stylesheet" />
      <link href="../css/cinder.css" rel="stylesheet" />
      <link rel="stylesheet" href="../css/highlight.css" />
      <link
        href="../bower_components/leaflet/dist/leaflet.css"
        rel="stylesheet"
      />
      <link
        href="https://api.tiles.mapbox.com/mapbox.js/v2.2.2/mapbox.css"
        rel="stylesheet"
      />

      {/* Inline CSS */}
      <style>{`
        #statesmap {
          width: 700px;
          height: 800px;
        }
        #statesmap .info {
          padding: 6px 8px;
          font: 0.7rem Arial, Helvetica, sans-serif;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
        }
        #statesmap .info h6 {
          font-size: 1.2rem;
          margin: 0 0 5px;
          color: #777;
        }
        #statesmap .legend {
          line-height: 18px;
          color: #555;
        }
        #statesmap .legend i {
          width: 15px;
          height: 15px;
          float: left;
          margin-right: 8px;
          opacity: 0.8;
        }
      `}</style>
        <Header/>
      {/* Page Content */}
      <main className="container" style={{ marginTop: "100px" }}>
        <h1>India - State Boundaries</h1>
        <div id="statesmap"></div>
        </main>
    </>
  );
};

export default States;
