// src/app/(dashboard)/dashboard/page.tsx
"use client";
import {useEffect, useState} from "react";
import TradeAgreementsCard from "@/app/components/TradeAgreementsCard";
import {TariffViewer} from "@/app/components/TariffViewer";

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
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tariffsRes, countriesRes] = await Promise.all([
                    fetch("http://localhost:8080/api/trade-agreements/tariffs"),
                    fetch("http://localhost:8080/api/countries"),
                ]);

                if (!tariffsRes.ok || !countriesRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const [tariffsData, countriesData] = await Promise.all([
                    tariffsRes.json(),
                    countriesRes.json(),
                ]);

                setTariffs(tariffsData);
                setCountries(countriesData);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data from backend");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Global tariff overview and trade agreements
                </p>
            </div>
            <TradeAgreementsCard/>
            <TariffViewer/>
        </div>
    );
}
