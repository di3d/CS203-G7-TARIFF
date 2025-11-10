"use client";

import { useState, useRef, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { CountryDetail } from "./country-detail";
import { Feature } from "geojson";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

type CountryFeature = Feature & { properties: { name: string } };

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
  const [selectedCountry, setSelectedCountry] = useState<{
    countryName: string;
    agreements: TradeAgreement[];
  } | null>(null);
  const [tooltipContent, setTooltipContent] = useState("");

  const normalizeCountryName = (geoName: string) =>
    COUNTRY_NAME_MAP[geoName] || geoName;

  const getCountryAgreementsCount = (countryName: string) => {
    const normalized = normalizeCountryName(countryName);
    return tradeAgreements.filter(
      (t) =>
        t.countryA.toLowerCase() === normalized.toLowerCase() ||
        t.countryB.toLowerCase() === normalized.toLowerCase()
    ).length;
  };

  const getCountryColor = (count: number) => {
    if (count >= 10) return "#0047AB";
    if (count >= 6) return "#1976D2";
    if (count >= 3) return "#64B5F6";
    if (count >= 1) return "#BBDEFB";
    return "#E0E0E0";
  };

  const handleCountryClick = (geo: CountryFeature) => {
    const geoName = geo.properties.name;
    const normalized = normalizeCountryName(geoName);
    const agreements = tradeAgreements.filter(
      (t) =>
        t.countryA.toLowerCase() === normalized.toLowerCase() ||
        t.countryB.toLowerCase() === normalized.toLowerCase()
    );
    setSelectedCountry({ countryName: normalized, agreements });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 🌍 Auto-fit responsive map */}
      <ComposableMap
        projection="geoEqualEarth"
        style={{
          width: "100%",
          height: "auto",
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoName = geo.properties.name;
              const count = getCountryAgreementsCount(geoName);
              const fillColor = getCountryColor(count);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() =>
                    setTooltipContent(
                      `${geoName} — ${count} ${
                        count === 1 ? "agreement" : "agreements"
                      }`
                    )
                  }
                  onMouseLeave={() => setTooltipContent("")}
                  onClick={() => handleCountryClick(geo as CountryFeature)}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={tooltipContent}
                  style={{
                    default: { fill: fillColor, outline: "none" },
                    hover: { fill: "#0077b6", outline: "none" },
                    pressed: { fill: "#023e8a", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip id="tooltip" />

      {selectedCountry && (
        <CountryDetail
          countryName={selectedCountry.countryName}
          agreements={selectedCountry.agreements}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
