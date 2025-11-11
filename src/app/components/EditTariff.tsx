"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/app/components/ui/popover";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandInput,
} from "@/app/components/ui/command";
import {
    Cog,
    Loader2,
    Search,
    Save,
    X,
    Edit2,
    Trash2,
    AlertCircle,
    Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Country {
    name: string;
    isoCode?: string;
}

interface HsCode {
    hsCode: string;
    description: string;
}

interface Tariff {
    tariffId: number;
    hsCode: HsCode;
    baseRate: number | null;
    specificRate: number | null;
    unit: string | null;
    rateType: "Ad Valorem" | "Specific" | "Mixed";
    effectiveDate: string;
    expiryDate: string;
    tariffOrigins: { country: Country }[];
    tariffDestinations: { country: Country }[];
}

type EditableTariff = Partial<Tariff> & {
    origins?: string[];
    destinations?: string[];
};

export default function EditTariff() {
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTariff, setEditedTariff] = useState<EditableTariff>({});
    const [openOriginEdit, setOpenOriginEdit] = useState(false);
    const [openDestEdit, setOpenDestEdit] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tariffsRes, countriesRes] = await Promise.all([
                    api.get("/tariffs"),
                    api.get("/countries"),
                ]);
                setTariffs(tariffsRes.data);
                setCountries(countriesRes.data);
            } catch {
                setError("Failed to load data.");
                toast.error("Could not fetch tariffs or countries.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const refreshTariffs = async () => {
        const { data } = await api.get("/tariffs");
        setTariffs(data);
    };

    const toggleSelection = (list: string[] = [], value: string): string[] =>
        list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

    const handleSave = async () => {
        if (!editingId) return;

        const overlap = editedTariff.origins?.some((o) =>
            editedTariff.destinations?.includes(o),
        );
        if (overlap) {
            toast.error("Origin and destination cannot be the same country.");
            return;
        }

        try {
            const payload: Tariff = {
                ...(editedTariff as Tariff),
                tariffOrigins:
                    editedTariff.origins?.map((name) => ({ country: { name } })) ?? [],
                tariffDestinations:
                    editedTariff.destinations?.map((name) => ({ country: { name } })) ?? [],
            };
            await api.put(`/tariffs/${editingId}`, payload);
            toast.success("Tariff updated.");
            setEditingId(null);
            await refreshTariffs();
        } catch {
            toast.error("Failed to update tariff.");
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!confirm("Delete this tariff?")) return;
        try {
            await api.delete(`/tariffs/${id}`);
            toast.success("Tariff deleted.");
            await refreshTariffs();
        } catch {
            toast.error("Failed to delete tariff.");
        }
    };

    const formatRate = (t: Tariff): string => {
        if (t.rateType === "Ad Valorem") {
            return t.baseRate != null ? `${t.baseRate}%` : "—";
        }
        if (t.rateType === "Specific") {
            return t.specificRate != null
                ? t.unit
                    ? `${t.specificRate} per ${t.unit}`
                    : `${t.specificRate}`
                : "—";
        }
        if (t.rateType === "Mixed") {
            const base = t.baseRate != null ? `${t.baseRate}%` : "—";
            const specific =
                t.specificRate != null
                    ? t.unit
                        ? `${t.specificRate} per ${t.unit}`
                        : `${t.specificRate}`
                    : "—";
            return `${base} + ${specific}`;
        }
        return "—";
    };

    const formatDate = (date: string): string =>
        date ? new Date(date).toLocaleDateString("en-SG") : "—";

    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Cog className="h-10 w-10 text-primary" />
                    Edit Tariffs
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
                {loading ? (
                    <div className="flex justify-center py-8 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading tariffs...
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 text-destructive py-4">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                ) : (
                    <table className="w-full text-xs">
                        <thead>
                        <tr className="bg-muted/50 text-muted-foreground uppercase text-[11px]">
                            <th className="px-2 py-2 text-left">ID</th>
                            <th className="px-2 py-2 text-left">HS Code</th>
                            <th className="px-2 py-2 text-left">Rate</th>
                            <th className="px-2 py-2 text-left">Type</th>
                            <th className="px-2 py-2 text-left">Effective</th>
                            <th className="px-2 py-2 text-left">Expiry</th>
                            <th className="px-2 py-2 text-left">Origins</th>
                            <th className="px-2 py-2 text-left">Destinations</th>
                            <th className="px-2 py-2 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tariffs.map((t) => {
                            const isEditing = editingId === t.tariffId;
                            return (
                                <tr
                                    key={t.tariffId}
                                    className="border-t hover:bg-muted/40 transition"
                                >
                                    <td className="px-2 py-1.5">{t.tariffId}</td>
                                    <td className="px-2 py-1.5 font-mono">{t.hsCode.hsCode}</td>
                                    <td className="px-2 py-1.5">
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    type="number"
                                                    value={editedTariff.baseRate ?? t.baseRate ?? ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            baseRate: parseFloat(e.target.value),
                                                        })
                                                    }
                                                    className="h-7 text-xs mb-1"
                                                    placeholder="Base Rate (%)"
                                                />
                                                {(editedTariff.rateType ?? t.rateType) !== "Ad Valorem" && (
                                                    <>
                                                        <Input
                                                            type="number"
                                                            value={editedTariff.specificRate ?? t.specificRate ?? ""}
                                                            onChange={(e) =>
                                                                setEditedTariff({
                                                                    ...editedTariff,
                                                                    specificRate: parseFloat(e.target.value),
                                                                })
                                                            }
                                                            className="h-7 text-xs mb-1"
                                                            placeholder="Specific Rate"
                                                        />
                                                        <Input
                                                            value={editedTariff.unit ?? t.unit ?? ""}
                                                            onChange={(e) =>
                                                                setEditedTariff({
                                                                    ...editedTariff,
                                                                    unit: e.target.value,
                                                                })
                                                            }
                                                            className="h-7 text-xs"
                                                            placeholder="Unit"
                                                        />
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            formatRate(t)
                                        )}
                                    </td>
                                    <td className="px-2 py-1.5">
                                        {isEditing ? (
                                            <select
                                                value={editedTariff.rateType ?? t.rateType}
                                                onChange={(e) =>
                                                    setEditedTariff({
                                                        ...editedTariff,
                                                        rateType: e.target.value as Tariff["rateType"],
                                                    })
                                                }
                                                className="h-7 w-full"
                                            >
                                                <option value="Ad Valorem">Ad Valorem</option>
                                                <option value="Specific">Specific</option>
                                                <option value="Mixed">Mixed</option>
                                            </select>
                                        ) : (
                                            t.rateType
                                        )}
                                    </td>
                                    <td className="px-2 py-1.5">
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedTariff.effectiveDate ?? t.effectiveDate}
                                                onChange={(e) =>
                                                    setEditedTariff({
                                                        ...editedTariff,
                                                        effectiveDate: e.target.value,
                                                    })
                                                }
                                                className="h-7 text-xs"
                                            />
                                        ) : (
                                            formatDate(t.effectiveDate)
                                        )}
                                    </td>
                                    <td className="px-2 py-1.5">
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedTariff.expiryDate ?? t.expiryDate}
                                                onChange={(e) =>
                                                    setEditedTariff({
                                                        ...editedTariff,
                                                        expiryDate: e.target.value,
                                                    })
                                                }
                                                className="h-7 text-xs"
                                            />
                                        ) : (
                                            formatDate(t.expiryDate)
                                        )}
                                    </td>

                                    {/* Origins */}
                                    <td className="px-2 py-1.5">
                                        {isEditing ? (
                                            <Popover
                                                open={openOriginEdit}
                                                onOpenChange={setOpenOriginEdit}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 px-2 text-[11px]"
                                                    >
                                                        {editedTariff.origins?.length
                                                            ? editedTariff.origins.join(", ")
                                                            : "Select origins"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[240px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search..." />
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {countries.map((c) => {
                                                                    const selected =
                                                                        editedTariff.origins?.includes(c.name);
                                                                    const disabled =
                                                                        editedTariff.destinations?.includes(c.name);
                                                                    return (
                                                                        <CommandItem
                                                                            key={c.name}
                                                                            disabled={disabled}
                                                                            onSelect={() =>
                                                                                setEditedTariff({
                                                                                    ...editedTariff,
                                                                                    origins: toggleSelection(
                                                                                        editedTariff.origins,
                                                                                        c.name,
                                                                                    ),
                                                                                })
                                                                            }
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    selected
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0",
                                                                                )}
                                                                            />
                                                                            <span
                                                                                className={
                                                                                    disabled
                                                                                        ? "opacity-40 cursor-not-allowed"
                                                                                        : ""
                                                                                }
                                                                            >
                                          {c.name}
                                        </span>
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            t.tariffOrigins.map((o) => o.country.name).join(", ") || "—"
                                        )}
                                    </td>

                                    {/* Destinations */}
                                    <td className="px-2 py-1.5">
                                        {isEditing ? (
                                            <Popover
                                                open={openDestEdit}
                                                onOpenChange={setOpenDestEdit}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 px-2 text-[11px]"
                                                    >
                                                        {editedTariff.destinations?.length
                                                            ? editedTariff.destinations.join(", ")
                                                            : "Select destinations"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[240px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search..." />
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {countries.map((c) => {
                                                                    const selected =
                                                                        editedTariff.destinations?.includes(c.name);
                                                                    const disabled =
                                                                        editedTariff.origins?.includes(c.name);
                                                                    return (
                                                                        <CommandItem
                                                                            key={c.name}
                                                                            disabled={disabled}
                                                                            onSelect={() =>
                                                                                setEditedTariff({
                                                                                    ...editedTariff,
                                                                                    destinations: toggleSelection(
                                                                                        editedTariff.destinations,
                                                                                        c.name,
                                                                                    ),
                                                                                })
                                                                            }
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    selected
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0",
                                                                                )}
                                                                            />
                                                                            <span
                                                                                className={
                                                                                    disabled
                                                                                        ? "opacity-40 cursor-not-allowed"
                                                                                        : ""
                                                                                }
                                                                            >
                                          {c.name}
                                        </span>
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            t.tariffDestinations.map((d) => d.country.name).join(", ") || "—"
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-2 py-1.5 text-center">
                                        <div className="flex gap-1 justify-center">
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={handleSave}
                                                    >
                                                        <Save className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={() => {
                                                            setEditingId(t.tariffId);
                                                            setEditedTariff({
                                                                ...t,
                                                                origins: t.tariffOrigins.map(
                                                                    (o) => o.country.name,
                                                                ),
                                                                destinations: t.tariffDestinations.map(
                                                                    (d) => d.country.name,
                                                                ),
                                                            });
                                                        }}
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={() => void handleDelete(t.tariffId)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
}
