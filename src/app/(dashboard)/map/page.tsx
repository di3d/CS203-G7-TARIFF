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

    const formattedAgreements = tariffs.map((t) => ({
        agreementName: "Base Tariff",
        hsCode: t.hsCode,
        countryA: t.countryA,
        countryB: t.countryB,
        rate: t.rate,
        tariffType: t.tariffType,
    }));

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tariff Map</h1>
                <p className="text-muted-foreground">
                    Map visualisation of trade relationships and tariff agreements
                </p>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Globe View
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full space-y-4">
                            <div className="flex-1 overflow-hidden">
                                <WorldMap
                                    countries={countries}
                                    tradeAgreements={formattedAgreements}
                                />
                            </div>
                            <MapLegend />
                            <p className="text-xs text-muted-foreground">
                                Hover over countries to view active trade summaries. Click a
                                country for detailed breakdowns.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
