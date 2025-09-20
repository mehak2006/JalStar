import React, { useEffect, useRef } from "react";
import L from "leaflet";
import * as d3 from "d3";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "../css/base.css";
import "../css/cinder.css";
import "../css/highlight.css";

const DistrictsMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const leafletMap = L.map(mapRef.current, { scrollWheelZoom: false }).setView([23.4, 83], 6);

    L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png", {
      maxZoom: 18,
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap);

    (async () => {
      const districts: any = await d3.json("../data/geojson/dists11.geojson");
      const geoLayer = L.geoJSON(districts, {
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({ weight: 4, color: "#fff", fillOpacity: 0.9 });
              if (infoRef.current) {
                infoRef.current.innerHTML = `
                  <h4>District Info</h4>
                  <b>${feature.properties.ST_NM}</b><br/>
                  District: <b>${feature.properties.DISTRICT}</b>`;
              }
            },
            mouseout: (e) => {
              geoLayer.resetStyle(e.target);
              if (infoRef.current) {
                infoRef.current.innerHTML = "<h4>District Info</h4>Hover over a district";
              }
            },
            click: (e) => {
              leafletMap.fitBounds(e.target.getBounds());
            },
          });
        },
      }).addTo(leafletMap);
    })();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Info Box */}
      <div
        ref={infoRef}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          background: "rgba(255,255,255,0.9)",
          padding: "8px",
          borderRadius: "4px",
          boxShadow: "0 0 8px rgba(0,0,0,0.3)",
        }}
      >
        <h4>District Info</h4>
        Hover over a district
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ width: "700px", height: "800px", marginTop: "60px" }} />
    </div>
  );
};

export default DistrictsMap;
