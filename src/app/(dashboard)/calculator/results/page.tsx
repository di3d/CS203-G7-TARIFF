"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Core state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Currency conversion state
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  // Available currencies
  const availableCurrencies = Array.from(
    new Set([...(result ? [result.currency] : []), ...Object.keys(CURRENCY_SYMBOLS)])
  ).filter(Boolean);

  useEffect(() => {
    const loadResult = () => {
      try {
        setLoading(true);
        setError(null);

        const storedResult = sessionStorage.getItem("calculationResult");

        if (!storedResult) {
          throw new Error("No calculation result found. Please perform a calculation first.");
        }

        const parsedResult: CalculationResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (err) {
        console.error("Error loading result:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load calculation result. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, []);

  useEffect(() => {
    if (!result) return;
    setSelectedCurrency(result.currency);
    setConvertedAmount(result.totalDuty);
    setConversionRate(null);
    setConversionError(null);
  }, [result]);

  // ✅ FIXED fetchConversion function
  const fetchConversion = async (toCurrency: string) => {
    if (!result) return;
    const originalCurrency = result.currency;
    const originalAmount = result.totalDuty;

    if (toCurrency === originalCurrency) {
      setConvertedAmount(originalAmount);
      setConversionRate(null);
      setConversionError(null);
      setConversionLoading(false);
      return;
    }

    setConversionLoading(true);
    setConversionError(null);

    try {
      const params = new URLSearchParams({
        from: originalCurrency,
        to: toCurrency,
        amount: String(originalAmount),
      });

      // ✅ Fixed: point to backend (port 8080), not Next.js (port 3000)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/exchange?${params.toString()}`
      );

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const payload = await res.json();
      const converted = typeof payload.converted === "number" ? payload.converted : payload.result;
      const rate = payload.rate ?? payload.info?.rate ?? null;

      if (typeof converted !== "number") throw new Error("Invalid response from exchange API");

      setConvertedAmount(converted);
      setConversionRate(typeof rate === "number" ? rate : null);
    } catch (err) {
      console.error("Conversion error:", err);
      setConversionError(err instanceof Error ? err.message : "Conversion failed");
      setConvertedAmount(null);
      setConversionRate(null);
    } finally {
      setConversionLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCurrency || !result) return;
    fetchConversion(selectedCurrency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency, result]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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
            <Button onClick={() => router.push("/calculator")} variant="default">
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
            <Button onClick={() => router.push("/calculator")} variant="default">
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
          <h1 className="text-3xl font-bold tracking-tight">Calculation Results</h1>
          <p className="text-muted-foreground">Your tariff calculation details</p>
        </div>
        <Button onClick={() => router.push("/calculator")} variant="default">
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
                <p className="text-sm font-medium text-muted-foreground">HS Code</p>
                <p className="text-lg">{result.hsCode}</p>
                {result.commodityDescription && (
                  <p className="text-sm text-muted-foreground mt-1">{result.commodityDescription}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shipment Value</p>
                <p className="text-lg">
                  {currencySymbol}
                  {result.shipmentValue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Currency</p>
                <p className="text-lg">{result.currency}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country of Origin</p>
                <p className="text-lg">{result.originCountry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Importing Country</p>
                <p className="text-lg">{result.importingCountry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg">{new Date(result.date).toLocaleDateString()}</p>
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
              <p className="text-sm font-medium text-muted-foreground mb-1">Rate Type</p>
              <p className="text-lg">
                {result.applicableTariff ? result.applicableTariff.tariffType : "Default Country Rate"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Base Rate</p>
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
              <p className="text-sm font-medium text-muted-foreground">Effective Rate</p>
              <p className="text-3xl font-bold text-primary text-red-600">
                {result.effectiveRate.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Duty</p>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-primary text-red-600">
                  {currencySymbol}
                  {result.totalDuty.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                <div className="w-40">
                  <Select value={selectedCurrency} onValueChange={(val: string) => setSelectedCurrency(val)}>
                    <SelectTrigger aria-label="Convert currency">
                      <SelectValue placeholder="Convert to" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c} {CURRENCY_SYMBOLS[c] ? `(${CURRENCY_SYMBOLS[c]})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Converted value */}
                <div className="ml-auto text-right flex items-center justify-end gap-2">
                  {selectedCurrency && selectedCurrency !== result.currency ? (
                    <>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                      {conversionLoading ? (
                        <div className="flex items-center justify-end text-muted-foreground">
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          <span className="text-sm">Converting…</span>
                        </div>
                      ) : conversionError ? (
                        <p className="text-sm text-destructive">{conversionError}</p>
                      ) : convertedAmount != null ? (
                        <div>
                          <p className="text-3xl font-bold text-muted-foreground">
                            {CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency}
                            {convertedAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>

              {selectedCurrency && selectedCurrency !== result.currency && conversionRate != null && !conversionError && (
                <div className="mt-2 text-sm text-muted-foreground text-right">
                  Rate: 1 {result.currency} = {conversionRate.toLocaleString(undefined, { maximumFractionDigits: 10 })} {selectedCurrency}
                </div>
              )}
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
