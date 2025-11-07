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

export default function MapPage() {
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
