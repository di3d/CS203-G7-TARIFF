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
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    agreements: TradeAgreement[];
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [mapWidth, setMapWidth] = useState(980);

  // 🧭 Dynamically resize map based on screen DPI and width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth =
          containerRef.current.getBoundingClientRect().width *
          window.devicePixelRatio;

        if (newWidth < 500) setMapWidth(420);
        else if (newWidth < 900) setMapWidth(700);
        else setMapWidth(980);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const normalizeCountryName = (geoName: string) =>
    COUNTRY_NAME_MAP[geoName] || geoName;

  const getCountryData = (geoName: string) => {
    const normalized = normalizeCountryName(geoName);
    return countries.find(
      (c) => c.name.toLowerCase() === normalized.toLowerCase()
    );
  };

  const getTradeAgreements = (countryName: string) => {
    const normalized = normalizeCountryName(countryName);
    return tradeAgreements.filter(
      (t) =>
        t.countryA.toLowerCase() === normalized.toLowerCase() ||
        t.countryB.toLowerCase() === normalized.toLowerCase()
    );
  };

  const handleMouseEnter = (geo: CountryFeature) => {
    const geoName = geo.properties
