"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { AlertCircle, Globe } from "lucide-react";
import { WorldMap } from "@/app/components/Map/world-map";
import { MapLegend } from "@/app/components/Map/map-legend";
import { api } from "@/lib/api";

interface Tariff {
    id: number;
    countryA: string;
    countryB: string;
    hsCode: string;
    rate: number;
    tariffType: string;
    startDate: string;
    endDate: string;
}

interface Country {
    id: number;
    name: string;
    tariffRate: number;
}

export default function MapPage() {
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tariffsRes, countriesRes] = await Promise.all([
                    api.get("/trade-agreements/tariffs"),
                    api.get("/countries"),
                ]);

                setTariffs(tariffsRes.data);
                setCountries(countriesRes.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data from backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fix: Include hsCode so it matches TradeAgreement type
    const formattedAgreements = tariffs.map((t) => ({
        agreementName: "Base Tariff",
        hsCode: t.hsCode,
        countryA: t.countryA,
        countryB: t.countryB,
        rate: t.rate,
        tariffType: t.tariffType,
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tariff Map</h1>
                <p className="text-muted-foreground">
                    Map visualisation of tariff rates and active trade agreements
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Globe View
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <WorldMap
                                countries={countries}
                                tradeAgreements={formattedAgreements}
                            />
                            <MapLegend />
                            <p className="text-xs text-muted-foreground">
                                Hover over countries to view base tariff rates and trade
                                agreement summaries. Click on a country for a detailed
                                breakdown of all agreements.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
