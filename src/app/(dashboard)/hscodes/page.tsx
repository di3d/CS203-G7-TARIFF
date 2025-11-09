"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Loader2, Search, FileSearch } from "lucide-react";
import { api } from "@/lib/api";

interface HsCode {
    hsCode: string;
    description: string;
}

export default function HsCodeViewerPage() {
    const [codes, setCodes] = useState<HsCode[]>([]);
    const [filtered, setFiltered] = useState<HsCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 50;

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const { data } = await api.get<HsCode[]>("/hscodes");
                setCodes(data);
                setFiltered(data);
            } catch {
                console.error("Failed to load HS codes");
            } finally {
                setLoading(false);
            }
        };
        fetchCodes();
    }, []);

    useEffect(() => {
        const q = query.toLowerCase();
        const result = codes.filter(
            (c) =>
                c.hsCode.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q)
        );
        setFiltered(result);
        setPage(1);
    }, [query, codes]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">HS Codes</h1>
                <p className="text-muted-foreground">
                    Browse all available Harmonized System (HS) codes
                </p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <FileSearch className="h-5 w-5 text-primary" />
                        HS Code Directory
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1 w-full sm:w-1/2">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by HS code or description..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="pl-9 h-11"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Showing {paginated.length} of {filtered.length} results
                        </p>
                    </div>

                    <div className="border rounded-md overflow-auto max-h-[70vh]">
                        {loading ? (
                            <div className="flex justify-center items-center py-10 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Loading HS codes...
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                    <th className="px-3 py-2 text-left w-32">HS Code</th>
                                    <th className="px-3 py-2 text-left">Description</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((item) => (
                                        <tr
                                            key={item.hsCode}
                                            className="border-t hover:bg-muted/40 transition"
                                        >
                                            <td className="px-3 py-2 font-mono">{item.hsCode}</td>
                                            <td className="px-3 py-2">{item.description}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="text-center py-6 text-muted-foreground"
                                        >
                                            No HS codes found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="px-3 py-1 rounded-md border border-border text-sm disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="px-3 py-1 rounded-md border border-border text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
