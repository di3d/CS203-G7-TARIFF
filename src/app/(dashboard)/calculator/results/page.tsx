"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

// API data structure
interface Country {
  id: number;
  name: string;
  tariffRate: number;
}

interface Tariff {
  id: number;
  country_a_id: number;
  country_b_id: number;
  hscode_id: number;
  rate: number;
  tariff_type: "MFN" | "AHS" | "BND";
  start_date: string;
  end_date: string;
}

interface CalculationResult {
  baseTariff: number;
  totalDuty: number;
  effectiveRate: number;
  applicableTariff: Tariff | null;
  defaultRate: number;
}

interface TariffDTO {
  countryA: string;
  countryB: string;
  hsCode: string;
  description: string;
  rate: number;
  tariffType: string;
  startDate: string;
  endDate: string;
}

// Currency symbols
const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  SGD: "S$",
};

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const calculateTariff = async () => {
      try {
        setLoading(true);
        setError(null);

        const originCountry = searchParams.get("originCountry");
        const importingCountry = searchParams.get("importingCountry");
        const hsCode = searchParams.get("hsCode");
        const shipmentValue = parseFloat(
          searchParams.get("shipmentValue") || "0"
        );

        if (
          !originCountry ||
          !importingCountry ||
          !hsCode ||
          isNaN(shipmentValue)
        ) {
          throw new Error("Missing or invalid parameters");
        }

        // Get data
        const [countriesResponse, tariffsResponse] = await Promise.all([
          axios.get<Country[]>("http://localhost:8080/countries"),
          axios.get<TariffDTO[]>("http://localhost:8080/tariffs"),
        ]);

        // Find countries and rates
        const origin = countriesResponse.data.find(
          (c) => c.name === originCountry
        );
        const importing = countriesResponse.data.find(
          (c) => c.name === importingCountry
        );

        if (!origin || !importing) {
          throw new Error("Invalid country");
        }

        // Default rate is tariffRate of the importing country (country B)
        const defaultRate = Number(importing.tariffRate) || 0;

        // Check for tariff agreement
        const specificTariff = tariffsResponse.data.find(
          (t) =>
            t.countryA === originCountry &&
            t.countryB === importingCountry &&
            t.hsCode === hsCode &&
            new Date(t.startDate) <= new Date() &&
            new Date(t.endDate) >= new Date()
        );

        // Use specific tariff rate if exists, otherwise use default country rate
        const rate = specificTariff ? Number(specificTariff.rate) : defaultRate;
        const totalDuty = (shipmentValue * rate) / 100;

        setResult({
          baseTariff: rate,
          totalDuty: totalDuty,
          effectiveRate: (totalDuty / shipmentValue) * 100,
          applicableTariff: specificTariff
            ? {
                id: 0,
                country_a_id: origin.id,
                country_b_id: importing.id,
                hscode_id: 0,
                rate: Number(specificTariff.rate),
                tariff_type: specificTariff.tariffType as "MFN" | "AHS" | "BND",
                start_date: specificTariff.startDate,
                end_date: specificTariff.endDate,
              }
            : null,
          defaultRate: defaultRate,
        });
      } catch (err) {
        console.error("Error calculating tariff:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to calculate tariff. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    calculateTariff();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>No Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currency = searchParams.get("currency") || "USD";
  const currencySymbol = CURRENCY_SYMBOLS[currency] || "$";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Calculation Results
          </h1>
          <p className="text-muted-foreground">
            Your tariff calculation details
          </p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Input Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Input Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  HS Code
                </p>
                <p className="text-lg">{searchParams.get("hsCode")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Shipment Value
                </p>
                <p className="text-lg">
                  {currencySymbol}
                  {parseFloat(searchParams.get("shipmentValue") || "0").toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Currency
                </p>
                <p className="text-lg">{currency}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Country of Origin
                </p>
                <p className="text-lg">{searchParams.get("originCountry")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Importing Country
                </p>
                <p className="text-lg">{searchParams.get("importingCountry")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg">
                  {new Date(searchParams.get("date") || "").toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tariff Details */}
      <Card>
        <CardHeader>
          <CardTitle>Tariff Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Rate Type
              </p>
              <p className="text-lg">
                {result.applicableTariff
                  ? result.applicableTariff.tariff_type
                  : "Default Country Rate"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Base Rate
              </p>
              <p className="text-lg">
                {(result.baseTariff || 0).toFixed(1)}%
                {result.applicableTariff && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (Default: {(result.defaultRate || 0).toFixed(1)}%)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Effective Rate
              </p>
              <p className="text-3xl font-bold text-primary text-red-600">
                {(result.effectiveRate || 0).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Duty</p>
              <p className="text-3xl font-bold text-primary text-red-600">
                {currencySymbol}
                {(result.totalDuty || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {result.applicableTariff && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Special agreement valid from{" "}
                {new Date(result.applicableTariff.start_date).toLocaleDateString()} to{" "}
                {new Date(result.applicableTariff.end_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
