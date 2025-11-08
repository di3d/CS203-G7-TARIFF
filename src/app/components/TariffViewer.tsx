"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronDown, ChevronRight, FileSearch } from "lucide-react";
import React from "react";

interface Country {
    name: string;
    isoCode: string;
}

interface Tariff {
    tariffId: number;
    hsCode: { hsCode: string; description: string };
    baseRate: number;
    rateType: string;
    origins: Country[];
    destinations: Country[];
}

export function TariffViewer() {
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<number | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/tariffs/with-countries") // ✅ NEW ENDPOINT
            .then((r) => r.json())
            .then(setTariffs)
            .finally(() => setLoading(false));
    }, []);

    const filtered = tariffs.filter((t) =>
        (t.hsCode?.hsCode + " " + t.hsCode?.description)
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading)
        return (
            <div className="flex justify-center items-center h-60 text-muted-foreground">
                <Loader2 className="animate-spin mr-2" /> Loading tariff data...
            </div>
        );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileSearch className="h-5 w-5" />
                    Tariff Lookup
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <Input
                    placeholder="Search by HS code or product description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table className="w-full border text-sm">
                    <thead className="bg-muted/50">
                    <tr>
                        <th></th>
                        <th className="text-left px-4 py-2">HS Code</th>
                        <th className="text-left px-4 py-2">Description</th>
                        <th className="text-left px-4 py-2">Base Rate</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filtered.map((t) => (
                        <React.Fragment key={t.tariffId}>
                            <tr className="border-b">
                                <td
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() =>
                                        setExpanded(expanded === t.tariffId ? null : t.tariffId)
                                    }
                                >
                                    {expanded === t.tariffId
                                        ? <ChevronDown className="h-4 w-4" />
                                        : <ChevronRight className="h-4 w-4" />}
                                </td>
                                <td className="px-4 py-2 font-medium">{t.hsCode.hsCode}</td>
                                <td className="px-4 py-2">{t.hsCode.description}</td>
                                <td className="px-4 py-2">{t.baseRate}%</td>
                            </tr>

                            {expanded === t.tariffId && (
                                <tr className="bg-muted/20 border-b">
                                    <td colSpan={4} className="px-4 py-3 text-sm">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <strong>Allowed Origins (Exporting Countries):</strong>
                                                <ul className="list-disc ml-5">
                                                    {t.origins.map((c) => (
                                                        <li key={c.isoCode}>{c.name} ({c.isoCode})</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <strong>Allowed Destinations (Importing Countries):</strong>
                                                <ul className="list-disc ml-5">
                                                    {t.destinations.map((c) => (
                                                        <li key={c.isoCode}>{c.name} ({c.isoCode})</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
