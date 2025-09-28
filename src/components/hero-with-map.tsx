"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calculator, BarChart3, Shield, Globe, TrendingUp } from "lucide-react";
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

const HeroWithMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getColor = (id: string) => {
    const data = tariffData[id as keyof typeof tariffData];
    if (!data) return "#F3F4F6"; // gray-100 for no data - blends with background
    
    const tariff = data.tariff;
    if (tariff > 12) return "#1E40AF"; // blue-800 - Very High
    if (tariff > 8) return "#3B82F6"; // blue-500 - High 
    if (tariff > 5) return "#60A5FA"; // blue-400 - Medium
    return "#DBEAFE"; // blue-100 - Low
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Header Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
              CS203 Project - Tariffic
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Navigate tariffs with 
              <span className="block text-blue-600">confidence</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Instantly calculate duties, spot special rates, and stay ahead of changing trade policies. Calculate tariffs for any commodity in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium shadow-lg"
              >
                <a href="/calculator">
                  Start Calculating <ArrowUpRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-white/80 backdrop-blur-sm px-8 py-4 text-lg font-medium"
              >
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">150+</div>
              <div className="text-gray-600">Countries Supported</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">$2.1T</div>
              <div className="text-gray-600">Trade Processed</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
        
        {/* Map Title - Floating */}
        <div className="text-center mb-8 relative z-20">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-full px-6 py-3 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900">Global Tariff Overview</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live data</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seamless Map - Full Width, No Container */}
      <div className="w-full h-[600px] relative -mt-32">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 180,
            center: [0, 20],
          }}
          width={1400}
          height={600}
          style={{ width: "100%", height: "100%" }}
        >
          <Sphere stroke="#E5E7EB" strokeWidth={0.5} fill="transparent" />
          <Graticule stroke="#E5E7EB" strokeWidth={0.2} opacity={0.3} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = geo.id;
                
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
                        stroke: "#1D4ED8",
                        strokeWidth: 2,
                        filter: "brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
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
        
        {/* Floating Tooltip */}
        {hoveredCountry && tariffData[hoveredCountry as keyof typeof tariffData] && (
          <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md border border-white/50 p-6 rounded-xl shadow-2xl z-30">
            <h4 className="font-bold text-gray-900 text-lg mb-2">
              {tariffData[hoveredCountry as keyof typeof tariffData].name}
            </h4>
            <div className="space-y-1">
              <p className="text-gray-600">
                Average Tariff: <span className="font-bold text-blue-600">{tariffData[hoveredCountry as keyof typeof tariffData].tariff}%</span>
              </p>
              <p className="text-gray-600">
                Trade Volume: <span className="font-bold text-blue-600">${tariffData[hoveredCountry as keyof typeof tariffData].imports}B</span>
              </p>
            </div>
          </div>
        )}
        
        {/* Floating Map Legend */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-xl px-6 py-4 shadow-lg flex items-center gap-6 text-sm text-gray-700">
            <span className="font-semibold">Tariff Rates:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100"></div>
              <span>Low (0-5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-400"></div>
              <span>Medium (5-8%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span>High (8-12%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-800"></div>
              <span>Very High (12%+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroWithMap;
