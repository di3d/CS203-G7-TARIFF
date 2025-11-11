"use client";

import { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { CountryDetail } from "./country-detail";
import { Feature } from "geojson";

const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

    const getTradeAgreements = (countryName: string): TradeAgreement[] => {
        const normalized = normalizeCountryName(countryName).toLowerCase();
        const matches = tradeAgreements.filter(
            (t) =>
                t.countryA.toLowerCase() === normalized ||
                t.countryB.toLowerCase() === normalized
        );
        // Deduplicate by agreement name
        return Array.from(
            new Map(matches.map((t) => [t.agreementName, t])).values()
        );
    };

    const getFillColor = (geo: CountryFeature) => {
        const agreements = getTradeAgreements(geo.properties.name);
        const count = agreements.length;
        if (count >= 10) return "#0047AB";
        if (count >= 6) return "#1976D2";
        if (count >= 3) return "#64B5F6";
        if (count >= 1) return "#BBDEFB";
        return "#E0E0E0";
    };

    const handleMouseEnter = (geo: CountryFeature) => {
        const name = geo.properties.name;
        const agreements = getTradeAgreements(name);
        setTooltipContent(
            `<strong>${name}</strong><br/>${agreements.length} ${
                agreements.length === 1 ? "agreement" : "agreements"
            }`
        );
    };

    const handleMouseLeave = () => setTooltipContent("");

    const handleCountryClick = (geo: CountryFeature) => {
        const name = geo.properties.name;
        const agreements = getTradeAgreements(name);
        setSelectedCountry({ name, agreements });
    };

    return (
        <div className="w-full flex flex-col items-center justify-center relative">
            <div
                data-tooltip-id="map-tooltip"
                data-tooltip-html={tooltipContent}
                className="w-full flex items-start justify-center"
            >
                <ComposableMap
                    projectionConfig={{ scale: 150 }}
                    style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "80vh",
                    }}
                >
                    <ZoomableGroup
                        center={[0, 20]}
                        zoom={1}
                        minZoom={0.7}
                        maxZoom={8}
                        translateExtent={[
                            [-1000, -500],
                            [1000, 500],
                        ] as [[number, number], [number, number]]}
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
                                        onClick={() => handleCountryClick(geo as CountryFeature)}
                                        style={{
                                            default: {
                                                fill: getFillColor(geo as CountryFeature),
                                                outline: "none",
                                                transition: "fill 0.15s ease-in-out",
                                            },
                                            hover: { fill: "#0077b6", outline: "none" },
                                            pressed: { fill: "#023e8a", outline: "none" },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>
                    </ZoomableGroup>
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
