"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { CountryDetail } from "./country-detail";
import { Feature } from "geojson";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/world-110m.json";

interface CountryData {
  id: number;
  name: string;
}

interface TradeAgreement {
  countryA: string;
  countryB: string;
  hsCode: string;
  rate: number;
  tariffType: string;
  agreementName: string;
}

interface WorldMapProps {
  countries: CountryData[];
  tradeAgreements: TradeAgreement[];
}

type CountryFeature = Feature & { properties: { name?: string } };

const COUNTRY_NAME_MAP: Record<string, string> = {
  "United States of America": "United States",
  "United Kingdom": "United Kingdom",
  "Republic of Korea": "South Korea",
  Korea: "South Korea",
  Türkiye: "Turkey",
  "Viet Nam": "Vietnam",
  Czechia: "Czech Republic",
  "Slovak Republic": "Slovakia",
  "Russian Federation": "Russia",
  UAE: "United Arab Emirates",
  Burma: "Myanmar",
};

export function WorldMap({ countries, tradeAgreements }: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    agreements: TradeAgreement[];
  } | null>(null);

  const normalizeCountryName = (geoName?: string) =>
    geoName ? COUNTRY_NAME_MAP[geoName] || geoName : "";

  const getTradeAgreements = (countryName?: string) => {
    const normalized = normalizeCountryName(countryName);
    return tradeAgreements.filter(
      (t) =>
        t.countryA.toLowerCase() === normalized.toLowerCase() ||
        t.countryB.toLowerCase() === normalized.toLowerCase()
    );
  };

  const getFillColor = (geo: CountryFeature) => {
    const geoName = geo.properties.name;
    const agreements = getTradeAgreements(geoName);
    const count = agreements.length;

    if (count >= 25) return "#0047AB";
    if (count >= 5) return "#1976D2";
    if (count >= 1) return "#64B5F6";
    return "#E0E0E0";
  };

  const handleMouseEnter = (geo: CountryFeature) => {
    const geoName = geo.properties.name;
    const agreements = getTradeAgreements(geoName);
    setTooltipContent(
      `<strong>${geoName || "Unknown"}</strong><br/>${agreements.length} ${
        agreements.length === 1 ? "agreement" : "agreements"
      }`
    );
  };

  const handleMouseLeave = () => setTooltipContent("");

  const handleCountryClick = (geo: CountryFeature) => {
    const geoName = geo.properties.name;
    const agreements = getTradeAgreements(geoName);
    setSelectedCountry({ name: geoName || "Unknown", agreements });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        data-tooltip-id="map-tooltip"
        data-tooltip-html={tooltipContent}
        className="w-full flex items-center justify-center"
        style={{
          aspectRatio: "2 / 1", // Ensures consistent height across screens
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        <ComposableMap
          projectionConfig={{ scale: 160, center: [0, 20] }}
          preserveAspectRatio="xMidYMid"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => handleMouseEnter(geo as CountryFeature)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleCountryClick(geo as CountryFeature)}
                  style={{
                    default: {
                      fill: getFillColor(geo as CountryFeature),
                      outline: "none",
                    },
                    hover: { fill: "#0077b6", outline: "none" },
                    pressed: { fill: "#023e8a", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>

      <Tooltip
        id="map-tooltip"
        place="top"
        className="!bg-background !text-foreground !shadow-lg !border !border-border !rounded-lg !z-50 !max-w-[400px]"
        style={{ maxWidth: "400px" }}
        float
        positionStrategy="fixed"
      />

      {selectedCountry && (
        <CountryDetail
          countryName={selectedCountry.name}
          agreements={selectedCountry.agreements}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
