"use client";
import { Link } from "lucide-react";
import { useEffect } from "react";
// import Head from "next/head";
import Header from "@/components/ui/header";
const Districts = () => {
  useEffect(() => {
    // Load external scripts dynamically
    const scripts = [
      "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",
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

    // Dropdown toggle
    const mapToggle = document.getElementById("mapToggle");
    const mapMenu = document.getElementById("mapMenu");
    if (mapToggle && mapMenu) {
      mapToggle.addEventListener("click", () => {
        mapMenu.classList.toggle("hidden");
      });
    }

    // Init map when jQuery + plotDistricts is ready
    (window as any).$(document).ready(function () {
      if (typeof (window as any).plotDistricts === "function") {
        (window as any).plotDistricts("distsmap");
      }
    });
  }, []);

  return (
    <>
        <title>Districts - Community Created Maps of India</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="None" />
        <link rel="shortcut icon" href="../img/favicon.ico" />

        {/* CSS files */}
        <link href="../css/bootstrap-custom.min.css" rel="stylesheet" />
        <link
          href="//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/font-hack/2.018/css/hack.min.css"
        />
        <link
          href="//fonts.googleapis.com/css?family=PT+Sans:400,400italic,700,700italic&subset=latin-ext,latin"
          rel="stylesheet"
        />
        <link
          href="//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,700italic,400,300,600,700&subset=latin-ext,latin"
          rel="stylesheet"
        />
        <link href="../css/base.css" rel="stylesheet" />
        <link href="../css/cinder.css" rel="stylesheet" />
        <link rel="stylesheet" href="../css/highlight.css" />
        <link href="../bower_components/leaflet/dist/leaflet.css" rel="stylesheet" />
        <link
          href="//api.tiles.mapbox.com/mapbox.js/v2.2.2/mapbox.css"
          rel="stylesheet"
        />

        {/* Inline CSS */}
        <style>{`
          #distsmap {
            width: 700px;
            height: 800px;
          }
          #distsmap .info {
            margin-top: 160px;
            margin-right: 10px;
            padding: 6px 8px;
            font: 0.7rem Arial, Helvetica, sans-serif;
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
          }
          #distsmap .info h6 {
            font-size: 1.2rem;
            margin: 0 0 5px;
            color: #777;
          }
          #distsmap .legend {
            line-height: 18px;
            color: #555;
            margin-bottom: 150px;
            margin-right: 10px;
          }
          #distsmap .legend-control input {
            float: left;
            margin-bottom: 8px;
          }
        `}</style>

      {/* Navbar */}
      <Header/>
      {/* Main content */}
      <main className="col-md-9" role="main" style={{ marginTop: "100px" }}>
        <h1>India - District Boundaries</h1>
        <p>
          The District Boundaries of India, Scraped from ECI&apos;s{" "}
          <a href="http://psleci.nic.in/">Poling Station Locations</a> Website.
        </p>
        <ol>
          <li>
            District Boundaries for Jammu And Kashmir, Jharkhand, Assam, Manipur,
            Nagaland & Arunachal Pradesh are pre-delimitation boundaries.
          </li>
          <li>There may be some shift in the data.</li>
          <li>Some Assembly Constituency Names may be incorrect or missing.</li>
          <li>
            Assembly Constituencies in Telangana are still marked as Andhra Pradesh.
          </li>
          <li>
            Union Territories (Andaman & Nicobar, Chandigarh, Dadra & Nagar Haveli,
            Daman & Diu, Lakshadweep) do not have state assemblies.
          </li>
        </ol>

        <h2>Shapefile Attributes</h2>
        <ul>
          <li>DISTRICT: Name of District</li>
          <li>ST_NM: State name</li>
          <li>ST_CEN_CD: State Census Code</li>
          <li>DT_CEN_CD: District Census Code</li>
          <li>censuscode: Census code of the district</li>
        </ul>

        <h1>Quick View</h1>
        <div id="distsmap"></div>

        <h2>Download</h2>
        <p>
          <a
            className="btn btn-lg btn-success"
            href="https://github.com/datameet/maps/archive/master.zip"
          >
            <i className="fa fa-download fa-2x mr-2"></i> Download Everything
          </a>
        </p>

        <h2>License</h2>
        <p>
          Dataset shared under{" "}
          <a href="http://creativecommons.org/licenses/by/2.5/in/">
            Creative Commons Attribution 2.5 India
          </a>{" "}
          license.
        </p>

        <h2>Attribute</h2>
        <p>
          Maps provided by{" "}
          <a href="http://projects.datameet.org/maps/">
            Data{`{Meet}`} Community Maps Project
          </a>
          . Licensed under CC BY 2.5 India.
        </p>

        <h2>Issues</h2>
        <p>
          <a
            href="https://github.com/datameet/maps/issues/new"
            className="btn btn-primary"
          >
            Report Issue
          </a>
          <a
            href="https://github.com/datameet/maps/issues"
            className="btn btn-primary"
          >
            Active Issues
          </a>
        </p>

        <h2>Repository</h2>
        <p>
          <a
            className="btn btn-lg btn-success"
            href="https://github.com/datameet/maps"
          >
            <i className="fa fa-github fa-2x mr-2"></i> GitHub
          </a>
          <a
            className="btn btn-lg btn-success"
            href="https://gitlab.com/datameet/maps"
          >
            <i className="fa fa-git fa-2x mr-2"></i> GitLab
          </a>
        </p>
      </main>

      <footer className="text-center mt-4">
        <hr />
        <p>
          <small>
            A <a href="http://datameet.org/">Data{`{meet}`}</a> Project.
          </small>
        </p>
      </footer>
    </>
  );
};

export default Districts;
