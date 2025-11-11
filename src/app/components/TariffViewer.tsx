"use client";

import { useEffect, useState } from "react";
import React from "react";
import { api } from "@/lib/api";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Loader2, ChevronDown, ChevronRight, FileSearch } from "lucide-react";

// === Interfaces ===
interface Country {
    countryId: number;
    name: string;
    isoCode: string;
    region: string;
}

interface HsCode {
    hsCode: string;
    description: string;
    level: string;
    parent: string | null;
    section: {
        id: number;
        code: string;
        name: string;
    } | null;
}

interface TariffOrigin {
    id: { tariffId: number; countryId: number };
    country: Country;
}

interface TariffDestination {
    id: { tariffId: number; countryId: number };
    country: Country;
}

interface Tariff {
    tariffId: number;
    hsCode: HsCode;
    baseRate: number | null;
    rateType: "Ad Valorem" | "Specific" | "Mixed";
    specificRate: number | null;
    unit: string | null;
    effectiveDate: string;
    expiryDate: string;
    tariffOrigins: TariffOrigin[];
    tariffDestinations: TariffDestination[];
}

// === Component ===
export function TariffViewer() {
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<number | null>(null);

    useEffect(() => {
        const fetchTariffs = async () => {
            try {
                const { data } = await api.get<Tariff[]>("/tariffs");
                setTariffs(data);
            } catch (err) {
                console.error("Failed to fetch tariffs:", err);
            } finally {
                setLoading(false);
            }
        };
        void fetchTariffs();
    }, []);

    // === Derived state ===
    const filtered = tariffs.filter((t) =>
        `${t.hsCode.hsCode} ${t.hsCode.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // === Formatting ===
    const formatRate = (t: Tariff): string => {
        const base = t.baseRate != null ? `${t.baseRate}%` : null;
        const specific =
            t.specificRate != null
                ? t.unit
                    ? `${t.specificRate} per ${t.unit}`
                    : `${t.specificRate}`
                : null;

        switch (t.rateType) {
            case "Ad Valorem":
                return base ?? "—";
            case "Specific":
                return specific ?? "—";
            case "Mixed":
                if (base && specific) return `${base} + ${specific}`;
                return base ?? specific ?? "—";
            default:
                return "—";
        }
    };

    // === Loading state ===
    if (loading)
        return (
            <div className="flex justify-center items-center h-60 text-muted-foreground">
                <Loader2 className="animate-spin mr-2" /> Loading tariff data...
            </div>
        );

    // === Render ===
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileSearch className="h-5 w-5" />
                    Tariff Viewer
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <Input
                    placeholder="Search by HS code or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />

                <div className="border rounded-md overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-muted/50">
                        <tr>
                            <th className="w-8"></th>
                            <th className="text-left px-3 py-2 w-28">HS Code</th>
                            <th className="text-left px-3 py-2">Description</th>
                            <th className="text-left px-3 py-2 w-40">Rate</th>
                            <th className="text-left px-3 py-2 w-32">Type</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-6 text-muted-foreground"
                                >
                                    No tariffs found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((t) => (
                                <React.Fragment key={t.tariffId}>
                                    <tr className="border-t hover:bg-muted/30 transition">
                                        <td
                                            className="px-3 py-2 cursor-pointer"
                                            onClick={() =>
                                                setExpanded(expanded === t.tariffId ? null : t.tariffId)
                                            }
                                        >
                                            {expanded === t.tariffId ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </td>
                                        <td className="px-3 py-2 font-mono">
                                            {t.hsCode.hsCode}
                                        </td>
                                        <td className="px-3 py-2">{t.hsCode.description}</td>
                                        <td className="px-3 py-2">{formatRate(t)}</td>
                                        <td className="px-3 py-2">{t.rateType}</td>
                                    </tr>

                                    {expanded === t.tariffId && (
                                        <tr className="bg-muted/20 border-t">
                                            <td colSpan={5} className="px-6 py-4 text-sm">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <strong>Allowed Origins:</strong>
                                                        <ul className="list-disc ml-5 mt-1">
                                                            {t.tariffOrigins.length ? (
                                                                t.tariffOrigins.map((o) => (
                                                                    <li key={o.country.countryId}>
                                                                        {o.country.name} ({o.country.isoCode})
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="text-muted-foreground">
                                                                    None specified
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <strong>Allowed Destinations:</strong>
                                                        <ul className="list-disc ml-5 mt-1">
                                                            {t.tariffDestinations.length ? (
                                                                t.tariffDestinations.map((d) => (
                                                                    <li key={d.country.countryId}>
                                                                        {d.country.name} ({d.country.isoCode})
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="text-muted-foreground">
                                                                    None specified
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-muted-foreground mt-4">
                                                    Effective:{" "}
                                                    {new Date(t.effectiveDate).toLocaleDateString()} →{" "}
                                                    {new Date(t.expiryDate).toLocaleDateString()}
                                                </div>

                                                {t.hsCode.section && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Section: {t.hsCode.section.code} –{" "}
                                                        {t.hsCode.section.name.replace(/"/g, "")}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
