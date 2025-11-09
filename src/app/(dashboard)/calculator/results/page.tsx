"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Map/ui/card";
import { Button } from "@/app/components/Map/ui/button";
import { ArrowLeft, AlertCircle, ArrowRight } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/Map/ui/select";
import { api } from "@/lib/api";

interface TariffAgreementDTO {
    id: number;
    tariffId: number;
    agreementId: number;
    agreementName: string;
    preferentialRate: number;
    rateType: string;
    effectiveDate: string;
    expiryDate: string | null;
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

const CURRENCY_SYMBOLS: Record<string, string> = {
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

    const [selectedCurrency, setSelectedCurrency] = useState<string>("");
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
    const [conversionRate, setConversionRate] = useState<number | null>(null);
    const [conversionLoading, setConversionLoading] = useState(false);
    const [conversionError, setConversionError] = useState<string | null>(null);

    const availableCurrencies = Array.from(
        new Set([...(result ? [result.currency] : []), ...Object.keys(CURRENCY_SYMBOLS)])
    ).filter(Boolean);

    useEffect(() => {
        const stored = sessionStorage.getItem("calculationResult");
        if (!stored) {
            setError("No calculation result found.");
        } else {
            setResult(JSON.parse(stored));
        }
        setLoading(false);
    }, []);


    useEffect(() => {
        if (!result) return;
        setSelectedCurrency(result.currency);
        setConvertedAmount(result.totalDuty);
        setConversionRate(null);
        setConversionError(null);
    }, [result]);

    const fetchConversion = async (toCurrency: string) => {
        if (!result) return;
        const originalCurrency = result.currency;
        const originalAmount = result.totalDuty;

        if (toCurrency === originalCurrency) {
            setConvertedAmount(originalAmount);
            setConversionRate(null);
            setConversionError(null);
            return;
        }

        setConversionLoading(true);
        setConversionError(null);

        try {
            const params = { from: originalCurrency, to: toCurrency, amount: originalAmount };
            const { data } = await api.get("/exchange", { params });

            const converted = data.converted ?? data.result;
            const rate = data.rate ?? data.info?.rate ?? null;

            if (typeof converted !== "number") throw new Error("Invalid API response.");

            setConvertedAmount(converted);
            setConversionRate(rate);
        } catch {
            setConversionError("Conversion failed.");
            setConvertedAmount(null);
            setConversionRate(null);
        } finally {
            setConversionLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCurrency && result) void fetchConversion(selectedCurrency);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCurrency, result]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );

    if (error)
        return (
            <div className="space-y-6">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" /> Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">{error}</p>
                        <Button onClick={() => router.push("/calculator")}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back to Calculator
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );

    if (!result)
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push("/calculator")}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Go Back to Calculator
                    </Button>
                </CardContent>
            </Card>
        );

    const currencySymbol = CURRENCY_SYMBOLS[result.currency] || "$";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calculation Results</h1>
                    <p className="text-muted-foreground">Your tariff calculation details</p>
                </div>
                <Button onClick={() => router.push("/calculator")}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
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
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {result.commodityDescription}
                                    </p>
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
                                {result.applicableTariff
                                    ? result.applicableTariff.rateType
                                    : "Default Country Rate"}
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
                            <p className="text-3xl font-bold text-red-600">
                                {result.effectiveRate.toFixed(1)}%
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Duty</p>
                            <div className="flex items-center gap-4">
                                <p className="text-3xl font-bold text-red-600">
                                    {currencySymbol}
                                    {result.totalDuty.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>

                                <div className="w-40">
                                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
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
                                    {selectedCurrency && selectedCurrency !== result.currency && (
                                        <>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            {conversionLoading ? (
                                                <div className="flex items-center text-muted-foreground">
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
                                    )}
                                </div>
                            </div>

                            {selectedCurrency &&
                                selectedCurrency !== result.currency &&
                                conversionRate != null &&
                                !conversionError && (
                                    <div className="mt-2 text-sm text-muted-foreground text-right">
                                        Rate: 1 {result.currency} ={" "}
                                        {conversionRate.toLocaleString(undefined, {
                                            maximumFractionDigits: 10,
                                        })}{" "}
                                        {selectedCurrency}
                                    </div>
                                )}
                        </div>
                    </div>

                    {result.applicableTariff && (
                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Special agreement ({result.applicableTariff.agreementName}) valid from{" "}
                                {new Date(result.applicableTariff.effectiveDate).toLocaleDateString()}
                                {result.applicableTariff.expiryDate && (
                                    <> to {new Date(result.applicableTariff.expiryDate).toLocaleDateString()}</>
                                )}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
