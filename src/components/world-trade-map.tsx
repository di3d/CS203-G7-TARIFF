"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";

const tariffData = {
  "840": { tariff: 7.5, name: "United States", imports: 2400 },
  "156": { tariff: 15.2, name: "China", imports: 2100 },
  "276": { tariff: 4.2, name: "Germany", imports: 1800 },
  "392": { tariff: 3.8, name: "Japan", imports: 700 },
  "826": { tariff: 5.1, name: "United Kingdom", imports: 650 },
  "250": { tariff: 6.8, name: "France", imports: 580 },
  "380": { tariff: 8.9, name: "Italy", imports: 520 },
  "124": { tariff: 6.2, name: "Canada", imports: 450 },
  "036": { tariff: 3.5, name: "Australia", imports: 380 },
  "076": { tariff: 12.8, name: "Brazil", imports: 320 },
  "484": { tariff: 11.4, name: "Mexico", imports: 280 },
  "410": { tariff: 9.7, name: "South Korea", imports: 260 },
  "356": { tariff: 13.1, name: "India", imports: 240 },
  "724": { tariff: 5.3, name: "Spain", imports: 220 },
  "528": { tariff: 4.1, name: "Netherlands", imports: 200 },
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const WorldTradeMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getColor = (id: string) => {
    const data = tariffData[id as keyof typeof tariffData];
    if (!data) return "#F8FAFC";
    
    const tariff = data.tariff;
    if (tariff > 12) return "#1E3A8A";
    if (tariff > 8) return "#3B82F6"; 
    if (tariff > 5) return "#60A5FA";
    return "#DBEAFE";
  };

  return (
    <div className="py-16 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Global Tariff Landscape
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Interactive world map showing average tariff rates by country
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="w-full h-[400px] relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 130,
                center: [0, 20],
              }}
              width={800}
              height={400}
              style={{ width: "100%", height: "100%" }}
            >
              <Sphere stroke="#E5E7EB" strokeWidth={0.5} fill="none" />
              <Graticule stroke="#E5E7EB" strokeWidth={0.3} />
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const id = geo.id;
                    const data = tariffData[id as keyof typeof tariffData];
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColor(id)}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            outline: "none", 
                            stroke: "#2563EB",
                            strokeWidth: 2,
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() => setHoveredCountry(id)}
                        onMouseLeave={() => setHoveredCountry(null)}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            
            {hoveredCountry && tariffData[hoveredCountry as keyof typeof tariffData] && (
              <div className="absolute top-4 left-4 bg-white border border-gray-200 p-4 rounded-lg shadow-lg z-10">
                <h3 className="font-semibold text-gray-900">
                  {tariffData[hoveredCountry as keyof typeof tariffData].name}
                </h3>
                <p className="text-sm text-gray-600">
                  Average Tariff: <span className="font-medium text-blue-600">{tariffData[hoveredCountry as keyof typeof tariffData].tariff}%</span>
                </p>
                <p className="text-sm text-gray-600">
                  Trade Volume: <span className="font-medium text-blue-600">${tariffData[hoveredCountry as keyof typeof tariffData].imports}B</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 inline-flex items-center gap-6">
            <div className="text-sm font-medium text-gray-700">Tariff Rates:</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100"></div>
                <span className="text-sm text-gray-600">Low (0-5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-300"></div>
                <span className="text-sm text-gray-600">Medium (5-8%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-sm text-gray-600">High (8-12%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-800"></div>
                <span className="text-sm text-gray-600">Very High (12%+)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldTradeMap;
