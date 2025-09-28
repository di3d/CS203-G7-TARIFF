"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Plus, Minus, RotateCcw } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";

const tariffData = {
  // Major economies
  "840": { tariff: 7.5, name: "United States", imports: 2400 },
  "156": { tariff: 15.2, name: "China", imports: 2100 },
  "276": { tariff: 4.2, name: "Germany", imports: 1800 },
  "392": { tariff: 3.8, name: "Japan", imports: 700 },
  "826": { tariff: 5.1, name: "United Kingdom", imports: 650 },
  
  // Singapore and Southeast Asia
  "702": { tariff: 0.0, name: "Singapore", imports: 380 },
  "458": { tariff: 8.1, name: "Malaysia", imports: 220 },
  "764": { tariff: 9.8, name: "Thailand", imports: 280 },
  "704": { tariff: 6.5, name: "Vietnam", imports: 180 },
  "360": { tariff: 7.3, name: "Indonesia", imports: 240 },
  "608": { tariff: 8.9, name: "Philippines", imports: 160 },
  "096": { tariff: 4.2, name: "Brunei", imports: 15 },
  
  // Europe
  "250": { tariff: 6.8, name: "France", imports: 580 },
  "380": { tariff: 8.9, name: "Italy", imports: 520 },
  "724": { tariff: 5.3, name: "Spain", imports: 220 },
  "528": { tariff: 4.1, name: "Netherlands", imports: 200 },
  "056": { tariff: 5.7, name: "Belgium", imports: 180 },
  "756": { tariff: 3.2, name: "Switzerland", imports: 190 },
  "752": { tariff: 4.8, name: "Sweden", imports: 150 },
  "208": { tariff: 6.2, name: "Denmark", imports: 120 },
  "578": { tariff: 3.9, name: "Norway", imports: 140 },
  
  // Americas
  "124": { tariff: 6.2, name: "Canada", imports: 450 },
  "484": { tariff: 11.4, name: "Mexico", imports: 280 },
  "076": { tariff: 12.8, name: "Brazil", imports: 320 },
  "032": { tariff: 8.7, name: "Argentina", imports: 120 },
  "152": { tariff: 9.3, name: "Chile", imports: 80 },
  "170": { tariff: 10.5, name: "Colombia", imports: 90 },
  
  // Asia Pacific
  "410": { tariff: 9.7, name: "South Korea", imports: 260 },
  "356": { tariff: 13.1, name: "India", imports: 240 },
  "036": { tariff: 3.5, name: "Australia", imports: 380 },
  "554": { tariff: 4.6, name: "New Zealand", imports: 95 },
  "344": { tariff: 12.5, name: "Hong Kong", imports: 180 },
  "158": { tariff: 9.8, name: "Taiwan", imports: 200 },
  
  // Middle East & Africa
  "784": { tariff: 5.0, name: "United Arab Emirates", imports: 160 },
  "682": { tariff: 7.8, name: "Saudi Arabia", imports: 140 },
  "376": { tariff: 8.9, name: "Israel", imports: 85 },
  "710": { tariff: 6.4, name: "South Africa", imports: 110 },
  "818": { tariff: 12.3, name: "Egypt", imports: 95 },
  "566": { tariff: 11.8, name: "Nigeria", imports: 120 },
  
  // Additional countries
  "040": { tariff: 5.1, name: "Austria", imports: 140 },
  "616": { tariff: 4.3, name: "Poland", imports: 160 },
  "203": { tariff: 4.7, name: "Czech Republic", imports: 120 },
  "348": { tariff: 5.9, name: "Hungary", imports: 95 },
  "642": { tariff: 8.2, name: "Romania", imports: 80 },
  "300": { tariff: 6.1, name: "Greece", imports: 70 },
  "620": { tariff: 4.8, name: "Portugal", imports: 85 },
  "372": { tariff: 3.1, name: "Ireland", imports: 110 },
  "246": { tariff: 4.5, name: "Finland", imports: 100 },
  "050": { tariff: 11.7, name: "Bangladesh", imports: 85 },
  "586": { tariff: 10.4, name: "Pakistan", imports: 90 },
  "144": { tariff: 12.9, name: "Sri Lanka", imports: 45 },
  "524": { tariff: 8.6, name: "Nepal", imports: 20 },
  "496": { tariff: 7.2, name: "Mongolia", imports: 25 },
  "604": { tariff: 9.1, name: "Peru", imports: 75 },
  "218": { tariff: 8.8, name: "Ecuador", imports: 50 },
  "858": { tariff: 7.6, name: "Uruguay", imports: 35 },
  "600": { tariff: 8.3, name: "Paraguay", imports: 30 },
  "068": { tariff: 9.4, name: "Bolivia", imports: 25 },
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const HeroMinimal = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const getColor = (id: string) => {
    const data = tariffData[id as keyof typeof tariffData];
    if (!data) return "#F8FAFC"; 
    
    const tariff = data.tariff;
    if (tariff > 12) return "#020617"; // slate-950 - almost black
    if (tariff > 8) return "#0F172A"; // slate-900 - very dark
    if (tariff > 5) return "#1E293B"; // slate-800 - dark
    if (tariff === 0) return "#172554"; // blue-950 for free trade - very dark blue
    return "#334155"; // slate-700 - medium
  };

  const handleCountryClick = (countryId: string) => {
    window.location.href = '/calculator';
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(prev => ({ ...prev, zoom: prev.zoom * 2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(prev => ({ ...prev, zoom: prev.zoom / 2 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Compact Header Section */}
      <div className="max-w-6xl mx-auto px-8 pt-12 pb-8">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="relative">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-slate-900 leading-[0.8] relative z-10">
                TARIFF
              </h1>
              <div className="absolute -top-1 -left-1 w-full h-full text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-blue-200 -z-10">
                TARIFF
              </div>
            </div>
            <h2 className="text-xl lg:text-2xl font-light tracking-[0.3em] text-blue-700 uppercase">
              Calculator
            </h2>
          </div>
          
          <div className="max-w-xl mx-auto space-y-6">
            <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
              Navigate global trade with <span className="text-blue-800 font-semibold">real-time calculations</span> for 60+ countries.
            </p>
            
            <Button 
              asChild 
              size="lg" 
              className="bg-slate-950 hover:bg-slate-900 text-white px-10 py-4 font-semibold tracking-wide uppercase rounded-none transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              <a href="/calculator" className="inline-flex items-center gap-2">
                Start Now 
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Large Map Section */}
      <div className="w-full h-[75vh] relative bg-white border-t-2 border-slate-950">
        {/* Zoom Controls */}
        <div className="absolute top-6 left-6 z-30 flex gap-0 bg-white shadow-xl border-2 border-slate-950 overflow-hidden">
          <Button
            size="sm"
            variant="ghost"
            className="w-11 h-11 p-0 hover:bg-slate-100 rounded-none border-r border-slate-300 last:border-r-0 text-slate-950"
            onClick={handleZoomIn}
            disabled={position.zoom >= 4}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-11 h-11 p-0 hover:bg-slate-100 rounded-none border-r border-slate-300 last:border-r-0 text-slate-950"
            onClick={handleZoomOut}
            disabled={position.zoom <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-11 h-11 p-0 hover:bg-slate-100 rounded-none text-slate-950"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div 
          className="w-full h-full flex items-center justify-center"
          onMouseMove={handleMouseMove}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 160,
              center: [0, 0],
            }}
            width={1400}
            height={700}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={handleMoveEnd}
            >
              <Sphere stroke="none" fill="#FFFFFF" />
              <Graticule stroke="#E2E8F0" strokeWidth={0.3} opacity={0.4} />
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
                        strokeWidth={0.6}
                        style={{
                          default: { outline: "none", cursor: "pointer" },
                          hover: { 
                            outline: "none", 
                            stroke: "#172554",
                            strokeWidth: 2,
                            filter: "brightness(0.8)"
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() => setHoveredCountry(id)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => handleCountryClick(id)}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
        
        {/* Tooltip */}
        {hoveredCountry && tariffData[hoveredCountry as keyof typeof tariffData] && (
          <div 
            className="absolute bg-white border-2 border-slate-950 p-4 z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full shadow-xl"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y - 12}px`,
            }}
          >
            <h4 className="font-bold text-slate-950 text-sm uppercase tracking-wide mb-1">
              {tariffData[hoveredCountry as keyof typeof tariffData].name}
            </h4>
            <p className="text-slate-700 text-xs font-semibold">
              {tariffData[hoveredCountry as keyof typeof tariffData].tariff === 0 
                ? 'FREE TRADE ZONE' 
                : `${tariffData[hoveredCountry as keyof typeof tariffData].tariff}% AVERAGE TARIFF`}
            </p>
            <p className="text-xs text-blue-700 font-medium mt-1">
              Click to calculate →
            </p>
          </div>
        )}
        
        {/* Legend */}
        <div className="absolute bottom-6 right-6 z-20">
          <div className="bg-white border-2 border-slate-950 px-5 py-4 shadow-lg">
            <div className="flex items-center gap-5 text-xs uppercase tracking-wider font-semibold">
              <span className="text-slate-950">TARIFF RATES</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-950"></div>
                  <span className="text-slate-700">FREE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-700"></div>
                  <span className="text-slate-700">LOW</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-800"></div>
                  <span className="text-slate-700">MED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-900"></div>
                  <span className="text-slate-700">HIGH</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-950"></div>
                  <span className="text-slate-700">MAX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroMinimal;
