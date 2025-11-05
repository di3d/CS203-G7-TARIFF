"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

// Backend response structure
interface TariffAgreementDTO {
  id: number;
  countryAId: number;
  countryBId: number;
  hscodeId: number;
  rate: number;
  tariffType: string;
  startDate: string;
  endDate: string;
}

interface CalculationResult {
  baseTariff: number;
  totalDuty: number;
  effectiveRate: number;
  applicableTariff: TariffAgreementDTO | null;
  defaultRate: number;
  hsCode: string;
  commodityDescription: string;
  shipmentValue: number;
  originCountry: string;
  importingCountry: string;
  date: string;
  currency: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const loadResult = () => {
      try {
        setLoading(true);
        setError(null);

        // Get calculation result from sessionStorage
        const storedResult = sessionStorage.getItem("calculationResult");
        
        if (!storedResult) {
          throw new Error("No calculation result found. Please perform a calculation first.");
        }

        const parsedResult: CalculationResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (err) {
        console.error("Error loading result:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load calculation result. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, []);

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
            <Button onClick={() => router.push("/calculator")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Calculator
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
            <Button onClick={() => router.push("/calculator")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Calculator
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currencySymbol = CURRENCY_SYMBOLS[result.currency] || "$";

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
        <Button onClick={() => router.push("/calculator")} variant="outline">
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
                <p className="text-lg">{result.hsCode}</p>
                {result.commodityDescription && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.commodityDescription}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Shipment Value
                </p>
                <p className="text-lg">
                  {currencySymbol}
                  {result.shipmentValue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Currency
                </p>
                <p className="text-lg">{result.currency}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Country of Origin
                </p>
                <p className="text-lg">{result.originCountry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Importing Country
                </p>
                <p className="text-lg">{result.importingCountry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg">
                  {new Date(result.date).toLocaleDateString()}
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
                  ? result.applicableTariff.tariffType
                  : "Default Country Rate"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Base Rate
              </p>
              <p className="text-lg">
                {result.baseTariff.toFixed(1)}%
                {result.applicableTariff && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (Default: {result.defaultRate.toFixed(1)}%)
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
                {result.effectiveRate.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Duty</p>
              <p className="text-3xl font-bold text-primary text-red-600">
                {currencySymbol}
                {result.totalDuty.toLocaleString(undefined, {
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
                {new Date(result.applicableTariff.startDate).toLocaleDateString()} to{" "}
                {new Date(result.applicableTariff.endDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
