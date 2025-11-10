"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    TooltipProps,
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/app/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/app/components/ui/select";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface HSSectionRow {
    section: string;
    name: string;
    avgRate: number;
    productCount: number;
}

interface HSCodeBreakdownChartProps {
    title?: string;
    originId?: number;
    destId?: number;
    agreementId?: number | null;
}

export default function HSCodeBreakdownChart({
                                                 title = "HS Section Tariff Breakdown",
                                                 originId,
                                                 destId,
                                                 agreementId,
                                             }: HSCodeBreakdownChartProps) {
    const [rows, setRows] = useState<HSSectionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<"avgRate" | "productCount">("avgRate");
    const [minCount, setMinCount] = useState(0);

    const { theme } = useTheme();

    const colors =
        theme === "dark"
            ? {
                grid: "#333",
                text: "#e5e5e5",
                barRate: "#3b82f6",
                barCount: "#22c55e",
                tooltipBg: "#1f2937",
                tooltipText: "#f3f4f6",
            }
            : {
                grid: "#e5e7eb",
                text: "#111827",
                barRate: "#2563eb",
                barCount: "#16a34a",
                tooltipBg: "#ffffff",
                tooltipText: "#111827",
            };

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            setLoading(true);
            setError(null);
            try {
                const params: Record<string, unknown> = {};
                if (originId) params.originId = originId;
                if (destId) params.destId = destId;
                if (agreementId) params.agreementId = agreementId;

                const res = await api.get<HSSectionRow[]>("/hs/sections/breakdown", { params });
                setRows(res.data ?? []);
            } catch {
                setError("Failed to fetch data from backend.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [originId, destId, agreementId]);

    const data = useMemo(() => {
        const filtered = rows.filter((r) => r.productCount >= minCount);
        return [...filtered].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
    }, [rows, sortKey, minCount]);

    // Tooltip typing
    const customFormatter: TooltipProps<ValueType, NameType>["formatter"] = (
        value,
        name,
        entry
    ) => {
        const val = typeof value === "number" ? value : Number(value);
        const row = entry?.payload as HSSectionRow;
        if (name === "Avg Tariff") {
            return [`${val.toFixed(2)}%`, `${row.name}`];
        }
        return [val, `${row.name}`];
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <div className="flex gap-2">
                    <Select value={sortKey} onValueChange={(v) => setSortKey(v as "avgRate" | "productCount")}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="avgRate">Sort: Avg Tariff</SelectItem>
                            <SelectItem value="productCount">Sort: Product Count</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={String(minCount)} onValueChange={(v) => setMinCount(Number(v))}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Min products" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Min Count: 0</SelectItem>
                            <SelectItem value="25">Min Count: 25</SelectItem>
                            <SelectItem value="50">Min Count: 50</SelectItem>
                            <SelectItem value="100">Min Count: 100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading HS Section data…
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground">
                        No data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                            barGap={6}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                            <XAxis
                                dataKey="section"
                                tick={{ fill: colors.text }}
                                label={{
                                    value: "HS Section",
                                    position: "insideBottom",
                                    dy: 20,
                                    fill: colors.text,
                                }}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                tick={{ fill: colors.text }}
                                stroke={colors.text}
                                width={40}
                                label={{
                                    value: "Avg Tariff (%)",
                                    angle: -90,
                                    position: "insideLeft",
                                    fill: colors.text,
                                }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fill: colors.text }}
                                stroke={colors.text}
                                width={40}
                                label={{
                                    value: "Products",
                                    angle: 90,
                                    position: "insideRight",
                                    fill: colors.text,
                                }}
                            />
                            <Tooltip
                                formatter={customFormatter}
                                contentStyle={{
                                    backgroundColor: colors.tooltipBg,
                                    color: colors.tooltipText,
                                    border: `1px solid ${colors.grid}`,
                                }}
                            />
                            <Legend wrapperStyle={{ color: colors.text }} />
                            <Bar
                                yAxisId="left"
                                dataKey="avgRate"
                                name="Avg Tariff"
                                fill={colors.barRate}
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="productCount"
                                name="Products"
                                fill={colors.barCount}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
                {error && <p className="text-xs text-muted-foreground mt-2">{error}</p>}
            </CardContent>
        </Card>
    );
}
