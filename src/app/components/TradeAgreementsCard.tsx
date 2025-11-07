"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, ScrollText, Loader2, Globe2 } from "lucide-react";

interface Country {
    countryId: number;
    name: string;
    isoCode: string;
    region: string;
}

interface TradeAgreement {
    agreementId: number;
    name: string;
    description: string;
    effectiveDate: string;
    expiryDate: string | null;
    countries?: Country[];
}

export default function TradeAgreementsCard() {
    const [agreements, setAgreements] = useState<TradeAgreement[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAgreements = async () => {
            try {
                // Step 1: get all agreements
                const res = await fetch("http://localhost:8080/api/trade-agreements");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const baseData: TradeAgreement[] = await res.json();

                // Step 2: for each agreement, fetch its countries
                const withCountries = await Promise.all(
                    baseData.map(async (a) => {
                        try {
                            const res2 = await fetch(
                                `http://localhost:8080/api/trade-agreements/${a.agreementId}/countries`
                            );
                            if (!res2.ok) throw new Error();
                            const countries: Country[] = await res2.json();
                            return { ...a, countries };
                        } catch {
                            return { ...a, countries: [] };
                        }
                    })
                );

                setAgreements(withCountries);
            } catch {
                setError("Failed to fetch trade agreements");
            } finally {
                setLoading(false);
            }
        };

        fetchAgreements();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ScrollText className="h-5 w-5" />
                    Active Trade Agreements
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-6 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading trade agreements...
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 text-destructive py-4">
                        <AlertCircle className="h-4 w-4" />
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="rounded-md border overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Effective</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Expiry</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Member Countries</th>
                            </tr>
                            </thead>
                            <tbody>
                            {agreements.map((a) => (
                                <tr
                                    key={a.agreementId}
                                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm">{a.agreementId}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{a.name}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {a.description}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(a.effectiveDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {a.expiryDate
                                            ? new Date(a.expiryDate).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {a.countries && a.countries.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {a.countries.map((c) => (
                                                    <span
                                                        key={c.countryId}
                                                        className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium"
                                                    >
                              <Globe2 className="h-3 w-3" />
                                                        {c.name}
                            </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">No countries</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {agreements.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-4 text-sm text-muted-foreground"
                                    >
                                        No trade agreements found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
