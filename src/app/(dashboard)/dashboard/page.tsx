// src/app/(dashboard)/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Globe } from "lucide-react";
import { WorldMap } from "@/components/world-map";
import { MapLegend } from "@/components/map-legend";

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
          fetch("http://localhost:8080/tariffs"),
          fetch("http://localhost:8080/countries"),
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
        setError("Failed to load data. Please check backend connection.");
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

      {/* Tariffs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Trade Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Country A
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Country B
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      HS Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Rate (%)
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tariffs.map((t, index) => (
                    <tr
                      key={`${t.countryA}-${t.countryB}-${t.hsCode}-${index}`}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">{t.countryA}</td>
                      <td className="px-4 py-3 text-sm">{t.countryB}</td>
                      <td className="px-4 py-3 text-sm font-mono">{t.hsCode}</td>
                      <td className="px-4 py-3 text-sm">{t.rate}%</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                          {t.tariffType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive World Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Tariff Map
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
              <WorldMap countries={countries} tradeAgreements={tariffs} />
              <MapLegend />
              <p className="text-xs text-muted-foreground">
                Hover over countries to view base tariff rates and active trade
                agreements
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
