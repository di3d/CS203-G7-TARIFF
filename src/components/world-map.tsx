"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryData {
  id: number;
  name: string;
  tariffRate: number;
}

interface TradeAgreement {
  countryA: string;
  countryB: string;
  hsCode: string;
  rate: number;
  tariffType: string;
}

interface WorldMapProps {
  countries: CountryData[];
  tradeAgreements: TradeAgreement[];
}

// Map GeoJSON country names to your API country names
const COUNTRY_NAME_MAP: { [key: string]: string } = {
  "United States of America": "United States",
  "United Kingdom": "United Kingdom",
  "China": "China",
  "Japan": "Japan",
  "Germany": "Germany",
  "France": "France",
  "India": "India",
  "Brazil": "Brazil",
  "Canada": "Canada",
  "Australia": "Australia",
  "South Korea": "South Korea",
  "Korea": "South Korea",
  "Republic of Korea": "South Korea",
  "Mexico": "Mexico",
  "Indonesia": "Indonesia",
  "Netherlands": "Netherlands",
  "Saudi Arabia": "Saudi Arabia",
  "Turkey": "Turkey",
  "Türkiye": "Turkey",
  "Switzerland": "Switzerland",
  "Poland": "Poland",
  "Belgium": "Belgium",
  "Sweden": "Sweden",
  "Argentina": "Argentina",
  "Norway": "Norway",
  "Austria": "Austria",
  "United Arab Emirates": "United Arab Emirates",
  "UAE": "United Arab Emirates",
  "Nigeria": "Nigeria",
  "Israel": "Israel",
  "Ireland": "Ireland",
  "Denmark": "Denmark",
  "Singapore": "Singapore",
  "Malaysia": "Malaysia",
  "South Africa": "South Africa",
  "Philippines": "Philippines",
  "Colombia": "Colombia",
  "Pakistan": "Pakistan",
  "Chile": "Chile",
  "Finland": "Finland",
  "Bangladesh": "Bangladesh",
  "Egypt": "Egypt",
  "Vietnam": "Vietnam",
  "Viet Nam": "Vietnam",
  "Czech Republic": "Czech Republic",
  "Czechia": "Czech Republic",
  "Romania": "Romania",
  "Portugal": "Portugal",
  "Peru": "Peru",
  "New Zealand": "New Zealand",
  "Greece": "Greece",
  "Qatar": "Qatar",
  "Algeria": "Algeria",
  "Hungary": "Hungary",
  "Kazakhstan": "Kazakhstan",
  "Kuwait": "Kuwait",
  "Morocco": "Morocco",
  "Ecuador": "Ecuador",
  "Slovakia": "Slovakia",
  "Slovak Republic": "Slovakia",
  "Dominican Republic": "Dominican Republic",
  "Kenya": "Kenya",
  "Ethiopia": "Ethiopia",
  "Guatemala": "Guatemala",
  "Myanmar": "Myanmar",
  "Burma": "Myanmar",
  "Oman": "Oman",
  "Luxembourg": "Luxembourg",
  "Panama": "Panama",
  "Bulgaria": "Bulgaria",
  "Uruguay": "Uruguay",
  "Croatia": "Croatia",
  "Costa Rica": "Costa Rica",
  "Lithuania": "Lithuania",
  "Serbia": "Serbia",
  "Slovenia": "Slovenia",
  "Tunisia": "Tunisia",
  "Jordan": "Jordan",
  "Paraguay": "Paraguay",
  "Bolivia": "Bolivia",
  "Bahrain": "Bahrain",
  "Cambodia": "Cambodia",
  "Latvia": "Latvia",
  "Estonia": "Estonia",
  "Cyprus": "Cyprus",
  "Iceland": "Iceland",
  "Malta": "Malta",
  "Mongolia": "Mongolia",
  "Thailand": "Thailand",
  "Taiwan": "Taiwan",
  "Hong Kong": "Hong Kong",
  "Russia": "Russia",
  "Russian Federation": "Russia",
  "Ukraine": "Ukraine",
  "Spain": "Spain",
  "Italy": "Italy",
};

export function WorldMap({ countries, tradeAgreements }: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");

  const normalizeCountryName = (geoName: string): string => {
    return COUNTRY_NAME_MAP[geoName] || geoName;
  };

  const getCountryData = (geoName: string) => {
    const normalizedName = normalizeCountryName(geoName);
    return countries.find(
      (c) => c.name.toLowerCase() === normalizedName.toLowerCase()
    );
  };

  const getTradeAgreements = (countryName: string) => {
    const normalizedName = normalizeCountryName(countryName);
    return tradeAgreements.filter(
      (ta) =>
        ta.countryA.toLowerCase() === normalizedName.toLowerCase() ||
        ta.countryB.toLowerCase() === normalizedName.toLowerCase()
    );
  };

  const handleMouseEnter = (geo: any) => {
    const geoName = geo.properties.name;
    const countryData = getCountryData(geoName);
    const agreements = getTradeAgreements(geoName);

    if (countryData) {
      let content = `<div class="p-2">
        <div class="font-bold text-lg mb-2">${countryData.name}</div>
        <div class="text-sm mb-1">
          <span class="font-medium">Base Tariff Rate:</span> ${countryData.tariffRate.toFixed(1)}%
        </div>`;

      if (agreements.length > 0) {
        // Group agreements by partner country
        const groupedAgreements = agreements.reduce((acc, agreement) => {
          const partner =
            agreement.countryA.toLowerCase() === countryData.name.toLowerCase()
              ? agreement.countryB
              : agreement.countryA;
          
          if (!acc[partner]) {
            acc[partner] = [];
          }
          acc[partner].push(agreement);
          return acc;
        }, {} as { [key: string]: TradeAgreement[] });

        const partnerCount = Object.keys(groupedAgreements).length;

        content += `<div class="mt-3 pt-2 border-t border-gray-300 dark:border-gray-600">
          <div class="font-medium text-sm mb-2">Active Trade Agreements (${partnerCount} ${partnerCount === 1 ? 'partner' : 'partners'})</div>
          <div class="space-y-2 max-h-40 overflow-y-auto">`;

        const partners = Object.entries(groupedAgreements).slice(0, 5);
        partners.forEach(([partner, partnerAgreements]) => {
          content += `<div class="text-xs border-b border-gray-200 dark:border-gray-700 pb-1 mb-1">
            <div class="font-medium text-gray-900 dark:text-gray-100">${partner}</div>`;
          
          partnerAgreements.slice(0, 3).forEach((agreement) => {
            content += `<div class="ml-2 text-gray-600 dark:text-gray-400">
              • HS ${agreement.hsCode}: ${agreement.rate.toFixed(1)}% (${agreement.tariffType})
            </div>`;
          });
          
          if (partnerAgreements.length > 3) {
            content += `<div class="ml-2 text-xs italic text-gray-500">
              +${partnerAgreements.length - 3} more agreements...
            </div>`;
          }
          
          content += `</div>`;
        });

        if (partnerCount > 5) {
          content += `<div class="text-xs italic text-gray-500 mt-1">
            +${partnerCount - 5} more partners...
          </div>`;
        }

        content += `</div></div>`;
      } else {
        content += `<div class="text-xs text-gray-500 mt-2">
          No active trade agreements
        </div>`;
      }

      content += `</div>`;
      setTooltipContent(content);
    } else {
      setTooltipContent(`<div class="p-2">
        <div class="font-bold text-gray-900 dark:text-gray-100">${geoName}</div>
        <div class="text-xs text-gray-500">No tariff data available</div>
      </div>`);
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  const getFillColor = (geo: any) => {
    const geoName = geo.properties.name;
    const countryData = getCountryData(geoName);

    if (!countryData) {
      return "#E5E7EB"; // gray-200
    }

    // Color based on tariff rate
    const rate = countryData.tariffRate;
    if (rate === 0) {
      return "#10B981"; // green-500 - No tariffs
    } else if (rate < 5) {
      return "#34D399"; // green-400 - Low tariffs
    } else if (rate < 10) {
      return "#FBBF24"; // yellow-400 - Medium tariffs
    } else if (rate < 15) {
      return "#FB923C"; // orange-400 - High tariffs
    } else {
      return "#EF4444"; // red-500 - Very high tariffs
    }
  };

  return (
    <div className="w-full">
      <div
        data-tooltip-id="map-tooltip"
        data-tooltip-html={tooltipContent}
        className="w-full"
      >
        <ComposableMap
          projectionConfig={{
            scale: 147,
          }}
          className="w-full h-auto"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => handleMouseEnter(geo)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: getFillColor(geo),
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#6366F1",
                      stroke: "#FFFFFF",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#4F46E5",
                      stroke: "#FFFFFF",
                      strokeWidth: 1,
                      outline: "none",
                    },
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
        float
        className="!bg-background !text-foreground !opacity-100 !shadow-lg !border !border-border !rounded-lg !z-50"
        style={{
          maxWidth: "350px",
        }}
      />
    </div>
  );
}
