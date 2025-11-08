"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { CountryDetail } from "./country-detail";

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
  agreementName: string;
}

interface WorldMapProps {
  countries: CountryData[];
  tradeAgreements: TradeAgreement[];
}

// Map GeoJSON country names to API country names
const COUNTRY_NAME_MAP: { [key: string]: string } = {
  "United States of America": "United States",
  "United Kingdom": "United Kingdom",
  China: "China",
  Japan: "Japan",
  Germany: "Germany",
  France: "France",
  India: "India",
  Brazil: "Brazil",
  Canada: "Canada",
  Australia: "Australia",
  "South Korea": "South Korea",
  Korea: "South Korea",
  "Republic of Korea": "South Korea",
  Mexico: "Mexico",
  Indonesia: "Indonesia",
  Netherlands: "Netherlands",
  "Saudi Arabia": "Saudi Arabia",
  Turkey: "Turkey",
  Türkiye: "Turkey",
  Switzerland: "Switzerland",
  Poland: "Poland",
  Belgium: "Belgium",
  Sweden: "Sweden",
  Argentina: "Argentina",
  Norway: "Norway",
  Austria: "Austria",
  "United Arab Emirates": "United Arab Emirates",
  UAE: "United Arab Emirates",
  Nigeria: "Nigeria",
  Israel: "Israel",
  Ireland: "Ireland",
  Denmark: "Denmark",
  Singapore: "Singapore",
  Malaysia: "Malaysia",
  "South Africa": "South Africa",
  Philippines: "Philippines",
  Colombia: "Colombia",
  Pakistan: "Pakistan",
  Chile: "Chile",
  Finland: "Finland",
  Bangladesh: "Bangladesh",
  Egypt: "Egypt",
  Vietnam: "Vietnam",
  "Viet Nam": "Vietnam",
  "Czech Republic": "Czech Republic",
  Czechia: "Czech Republic",
  Romania: "Romania",
  Portugal: "Portugal",
  Peru: "Peru",
  "New Zealand": "New Zealand",
  Greece: "Greece",
  Qatar: "Qatar",
  Algeria: "Algeria",
  Hungary: "Hungary",
  Kazakhstan: "Kazakhstan",
  Kuwait: "Kuwait",
  Morocco: "Morocco",
  Ecuador: "Ecuador",
  Slovakia: "Slovakia",
  "Slovak Republic": "Slovakia",
  "Dominican Republic": "Dominican Republic",
  Kenya: "Kenya",
  Ethiopia: "Ethiopia",
  Guatemala: "Guatemala",
  Myanmar: "Myanmar",
  Burma: "Myanmar",
  Oman: "Oman",
  Luxembourg: "Luxembourg",
  Panama: "Panama",
  Bulgaria: "Bulgaria",
  Uruguay: "Uruguay",
  Croatia: "Croatia",
  "Costa Rica": "Costa Rica",
  Lithuania: "Lithuania",
  Serbia: "Serbia",
  Slovenia: "Slovenia",
  Tunisia: "Tunisia",
  Jordan: "Jordan",
  Paraguay: "Paraguay",
  Bolivia: "Bolivia",
  Bahrain: "Bahrain",
  Cambodia: "Cambodia",
  Latvia: "Latvia",
  Estonia: "Estonia",
  Cyprus: "Cyprus",
  Iceland: "Iceland",
  Malta: "Malta",
  Mongolia: "Mongolia",
  Thailand: "Thailand",
  Taiwan: "Taiwan",
  "Hong Kong": "Hong Kong",
  Russia: "Russia",
  "Russian Federation": "Russia",
  Ukraine: "Ukraine",
  Spain: "Spain",
  Italy: "Italy",
};

export function WorldMap({ countries, tradeAgreements }: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    tariffRate: number;
    agreements: TradeAgreement[];
  } | null>(null);

  const normaliseCountryName = (geoName: string): string => {
    return COUNTRY_NAME_MAP[geoName] || geoName;
  };

  const getCountryData = (geoName: string) => {
    const normalisedName = normaliseCountryName(geoName);
    return countries.find(
      (c) => c.name.toLowerCase() === normalisedName.toLowerCase()
    );
  };

  const getTradeAgreements = (countryName: string) => {
    const normalizedName = normaliseCountryName(countryName);
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
      let content = `<div class="p-3">
        <div class="font-bold text-lg mb-2">${countryData.name}</div>
        <div class="text-sm mb-1">
          <span class="font-medium">Base Tariff Rate:</span> ${
            countryData.tariffRate != null 
              ? countryData.tariffRate.toFixed(1) + '%'
              : 'N/A'
          }
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
        const totalAgreements = agreements.length;

        // Calculate average preferential rate
        const avgRate = (agreements.reduce((sum, a) => sum + a.rate, 0) / agreements.length).toFixed(1);

        content += `<div class="mt-3 pt-2 border-t border-gray-300 dark:border-gray-600">
          <div class="font-medium text-sm mb-1">Trade Agreements Summary</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">
            <div>• ${partnerCount} partner ${partnerCount === 1 ? "country" : "countries"}</div>
            <div>• ${totalAgreements} total ${totalAgreements === 1 ? "agreement" : "agreements"}</div>
            <div>• Avg. preferential rate: ${avgRate}%</div>
          </div>`;

        // Show top 3 partners only
        const topPartners = Object.entries(groupedAgreements)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 3);

        content += `<div class="text-xs mt-2">
          <div class="font-medium text-gray-700 dark:text-gray-300 mb-1">Top Partners:</div>`;

        topPartners.forEach(([partner, partnerAgreements]) => {
          // Calculate average rate for this partner
          const partnerAvgRate = (
            partnerAgreements.reduce((sum, a) => sum + a.rate, 0) / partnerAgreements.length
          ).toFixed(1);

          content += `<div class="ml-2 mb-1">
            <span class="font-medium text-gray-900 dark:text-gray-100">${partner}</span>
            <span class="text-gray-600 dark:text-gray-400"> - ${partnerAgreements.length} ${
            partnerAgreements.length === 1 ? "agreement" : "agreements"
          }, avg: ${partnerAvgRate}%</span>
          </div>`;
        });

        if (partnerCount > 3) {
          content += `<div class="ml-2 text-xs italic text-gray-500 mt-1">
            +${partnerCount - 3} more ${partnerCount - 3 === 1 ? "partner" : "partners"}
          </div>`;
        }

        content += `</div></div>`;
        content += `<div class="text-xs text-gray-500 italic mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          Click country for detailed breakdown
        </div>`;
      } else {
        content += `<div class="text-xs text-gray-500 mt-2">
          No active trade agreements
        </div>`;
      }

      content += `</div>`;
      setTooltipContent(content);
    } else {
      setTooltipContent(`<div class="p-3">
        <div class="font-bold text-gray-900 dark:text-gray-100">${geoName}</div>
        <div class="text-xs text-gray-500">No tariff data available</div>
      </div>`);
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  const handleCountryClick = (geo: any) => {
    const geoName = geo.properties.name;
    const countryData = getCountryData(geoName);
    const agreements = getTradeAgreements(geoName);

    if (countryData && agreements.length > 0) {
      setSelectedCountry({
        name: countryData.name,
        tariffRate: countryData.tariffRate,
        agreements,
      });
    }
  };

  const getFillColor = (geo: any) => {
    const geoName = geo.properties.name;
    const countryData = getCountryData(geoName);

    if (!countryData || countryData.tariffRate == null) {
      return "#E5E7EB"; // gray-200 - No data
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
                  onClick={() => handleCountryClick(geo)}
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
        className="!bg-background !text-foreground !opacity-100 !shadow-lg !border !border-border !rounded-lg !z-50 !max-w-[400px]"
        style={{
          maxWidth: "400px",
        }}
        float
        positionStrategy="fixed"
      />
      {selectedCountry && (
        <CountryDetail
          countryName={selectedCountry.name}
          tariffRate={selectedCountry.tariffRate}
          agreements={selectedCountry.agreements}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
