"use client";

import { useState } from "react";
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
        const geoName = geo.properties.name;
        const countryData = getCountryData(geoName);
        const agreements = getTradeAgreements(geoName);

        if (!countryData) {
            setTooltipContent(
                `<div class="p-3"><div class="font-bold">${geoName}</div><div class="text-xs text-gray-500">No data available</div></div>`
            );
            return;
        }

        let content = `<div class="p-3"><div class="font-bold text-lg mb-2">${countryData.name}</div>`;

        if (agreements.length > 0) {
            const grouped = agreements.reduce((acc, a) => {
                const partner =
                    a.countryA.toLowerCase() === countryData.name.toLowerCase()
                        ? a.countryB
                        : a.countryA;
                if (!acc[partner]) acc[partner] = [];
                acc[partner].push(a);
                return acc;
            }, {} as Record<string, TradeAgreement[]>);

            const partnerCount = Object.keys(grouped).length;
            const totalAgreements = agreements.length;
            const avgRate = (
                agreements.reduce((s, a) => s + a.rate, 0) / agreements.length
            ).toFixed(1);

            content += `<div class="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
        <div class="font-medium text-sm mb-1">Trade Summary</div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">
          <div>• ${partnerCount} partner ${
                partnerCount === 1 ? "country" : "countries"
            }</div>
          <div>• ${totalAgreements} total ${
                totalAgreements === 1 ? "agreement" : "agreements"
            }</div>
          <div>• Avg. preferential rate: ${avgRate}%</div>
        </div>`;

            const topPartners = Object.entries(grouped)
                .sort((a, b) => b[1].length - a[1].length)
                .slice(0, 3);

            content += `<div class="text-xs mt-2">
        <div class="font-medium text-gray-700 dark:text-gray-300 mb-1">Top Partners:</div>`;

            topPartners.forEach(([partner, deals]) => {
                const partnerAvg = (
                    deals.reduce((s, a) => s + a.rate, 0) / deals.length
                ).toFixed(1);
                content += `<div class="ml-2 mb-1">
          <span class="font-medium text-gray-900 dark:text-gray-100">${partner}</span>
          <span class="text-gray-600 dark:text-gray-400"> - ${deals.length} ${
                    deals.length === 1 ? "agreement" : "agreements"
                }, avg: ${partnerAvg}%</span>
        </div>`;
            });

            if (partnerCount > 3) {
                content += `<div class="ml-2 text-xs italic text-gray-500 mt-1">
          +${partnerCount - 3} more ${
                    partnerCount - 3 === 1 ? "partner" : "partners"
                }
        </div>`;
            }

            content += `</div></div>
        <div class="text-xs text-gray-500 italic mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          Click for detailed breakdown
        </div>`;
        } else {
            content += `<div class="text-xs text-gray-500">No active trade agreements</div>`;
        }

        content += `</div>`;
        setTooltipContent(content);
    };

    const handleMouseLeave = () => setTooltipContent("");

    const handleCountryClick = (geo: CountryFeature) => {
        const geoName = geo.properties.name;
        const countryData = getCountryData(geoName);
        const agreements = getTradeAgreements(geoName);
        if (countryData && agreements.length > 0) {
            setSelectedCountry({ name: countryData.name, agreements });
        }
    };

    const getFillColor = (geo: CountryFeature) => {
        const geoName = geo.properties.name;
        const normalized = normalizeCountryName(geoName);

        const hasAgreements = tradeAgreements.some(
            (a) =>
                a.countryA.toLowerCase() === normalized.toLowerCase() ||
                a.countryB.toLowerCase() === normalized.toLowerCase()
        );

        if (hasAgreements) return "#60A5FA"; // blue for countries with agreements
        return "#E5E7EB"; // gray for no data
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div
                data-tooltip-id="map-tooltip"
                data-tooltip-html={tooltipContent}
                className="w-full h-full flex items-center justify-center"
            >
                <ComposableMap
                    projectionConfig={{ scale: 150 }}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "80vh",
                    }}
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onMouseEnter={() =>
                                        handleMouseEnter(geo as CountryFeature)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() =>
                                        handleCountryClick(geo as CountryFeature)
                                    }
                                    style={{
                                        default: {
                                            fill: getFillColor(geo as CountryFeature),
                                            stroke: "#FFFFFF",
                                            strokeWidth: 0.5,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#6366F1",
                                            stroke: "#FFFFFF",
                                            strokeWidth: 1,
                                            cursor: "pointer",
                                        },
                                        pressed: {
                                            fill: "#4F46E5",
                                            stroke: "#FFFFFF",
                                            strokeWidth: 1,
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
