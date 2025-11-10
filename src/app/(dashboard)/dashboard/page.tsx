// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import TradeAgreementsCard from "@/app/components/TradeAgreementsCard";
import { TariffViewer } from "@/app/components/TariffViewer";
import { api } from "@/lib/api";
import HSCodeBreakdownChart from "@/app/components/visualisations/HSCodeBreakdownChart";

type Tariff = {
    id: number;
    countryA: string;
    countryB: string;
    hsCode: string;
    rate: number;
    tariffType: string;
    startDate: string;
    endDate: string;
};

type Country = {
    id: number;
    name: string;
    tariffRate: number;
};

export default function DashboardPage() {
    const [,setTariffs] = useState<Tariff[]>([]);
    const [,setCountries] = useState<Country[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tariffsRes, countriesRes] = await Promise.all([
                    api.get<Tariff[]>("/trade-agreements/tariffs"),
                    api.get<Country[]>("/countries"),
                ]);

                setTariffs(tariffsRes.data);
                setCountries(countriesRes.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data from backend");
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-60 text-muted-foreground">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-60 text-destructive">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Global tariff overview and trade agreements
                </p>
            </div>
            <TradeAgreementsCard />
            <TariffViewer />
            <HSCodeBreakdownChart/>
        </div>
    );
}
