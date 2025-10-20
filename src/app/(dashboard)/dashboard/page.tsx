// src/app/(dashboard)/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

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

export default function DashboardPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/tariffs")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTariffs(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching tariffs:", err);
        setError("Failed to load tariffs. Please check backend connection.");
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of active tariffs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tariffs in Effect</CardTitle>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
