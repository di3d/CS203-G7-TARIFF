"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/app/components/ui/popover";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandInput,
    CommandEmpty,
} from "@/app/components/ui/command";
import {
    Cog,
    Loader2,
    Search,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    AlertCircle,
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
    tariffId?: number;
    hsCode: HsCode;
    baseRate: number;
    rateType: string;
    effectiveDate: string;
    expiryDate: string | null;
    tariffOrigins: { country: Country }[];
    tariffDestinations: { country: Country }[];
}

type EditableTariff = Partial<Tariff> & {
    origins?: string;
    destinations?: string;
};

export default function ManageTariffPage() {
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [hsCodes, setHsCodes] = useState<HsCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [hsLoading, setHsLoading] = useState(true);
    const [error, setError] = useState("");
    const [openHS, setOpenHS] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTariff, setEditedTariff] = useState<EditableTariff>({});
    const [newTariff, setNewTariff] = useState<EditableTariff>({
        hsCode: { hsCode: "", description: "" },
        baseRate: 0,
        rateType: "",
        effectiveDate: "",
        expiryDate: "",
    });

    // === Fetch HS Codes and Tariffs ===
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tariffsRes, hsCodesRes] = await Promise.all([
                    api.get("/tariffs"),
                    api.get("/hscodes"),
                ]);
                setTariffs(tariffsRes.data);
                setHsCodes(hsCodesRes.data);
            } catch {
                setError("Failed to load data.");
                toast.error("Could not fetch tariffs or HS codes.");
            } finally {
                setLoading(false);
                setHsLoading(false);
            }
        };
        void fetchData();
    }, []);

    const refreshTariffs = async () => {
        const { data } = await api.get("/tariffs");
        setTariffs(data);
    };

    const handleCreate = async () => {
        try {
            const payload: Tariff = {
                ...(newTariff as Tariff),
                tariffOrigins: newTariff.origins
                    ? newTariff.origins.split(",").map((o) => ({ country: { name: o.trim() } }))
                    : [],
                tariffDestinations: newTariff.destinations
                    ? newTariff.destinations.split(",").map((d) => ({ country: { name: d.trim() } }))
                    : [],
            };
            await api.post("/tariffs", payload);
            toast.success("Tariff created.");
            setNewTariff({
                hsCode: { hsCode: "", description: "" },
                baseRate: 0,
                rateType: "",
                effectiveDate: "",
                expiryDate: "",
            });
            await refreshTariffs();
        } catch {
            toast.error("Failed to create tariff.");
        }
    };

    const handleSave = async () => {
        if (!editingId) return;
        try {
            const payload: Tariff = {
                ...(editedTariff as Tariff),
                tariffOrigins: editedTariff.origins
                    ? editedTariff.origins.split(",").map((o) => ({ country: { name: o.trim() } }))
                    : [],
                tariffDestinations: editedTariff.destinations
                    ? editedTariff.destinations.split(",").map((d) => ({ country: { name: d.trim() } }))
                    : [],
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

    const formatDate = (date: string | null): string =>
        date ? new Date(date).toLocaleDateString("en-SG") : "—";

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage Tariffs</h1>
                <p className="text-muted-foreground">Add, update, or remove tariff entries</p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Cog className="h-5 w-5 text-primary" />
                        Tariff Management
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6 space-y-10">
                    {/* Create Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="hsCode">HS Code</Label>
                            <Popover open={openHS} onOpenChange={setOpenHS}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between h-11 text-left",
                                            !newTariff.hsCode?.hsCode && "text-muted-foreground"
                                        )}
                                    >
                                        {newTariff.hsCode?.hsCode ? (
                                            <div className="flex flex-col text-left">
                                                <span className="font-medium">{newTariff.hsCode.hsCode}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[260px]">
                          {newTariff.hsCode.description}
                        </span>
                                            </div>
                                        ) : (
                                            "Select HS Code"
                                        )}
                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[420px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search HS codes..." />
                                        <CommandList>
                                            <CommandEmpty>No HS codes found.</CommandEmpty>
                                            <CommandGroup>
                                                {hsCodes.map((item) => (
                                                    <CommandItem
                                                        key={item.hsCode}
                                                        value={item.hsCode}
                                                        onSelect={() => {
                                                            setNewTariff({
                                                                ...newTariff,
                                                                hsCode: item,
                                                            });
                                                            setOpenHS(false);
                                                        }}
                                                    >
                                                        <div className="flex flex-col text-left">
                                                            <span className="font-medium">{item.hsCode}</span>
                                                            <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Base Rate (%)</Label>
                                <Input
                                    type="number"
                                    value={newTariff.baseRate || ""}
                                    onChange={(e) =>
                                        setNewTariff({
                                            ...newTariff,
                                            baseRate: parseFloat(e.target.value),
                                        })
                                    }
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rate Type</Label>
                                <Input
                                    value={newTariff.rateType || ""}
                                    onChange={(e) =>
                                        setNewTariff({ ...newTariff, rateType: e.target.value })
                                    }
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Effective Date</Label>
                                <Input
                                    type="date"
                                    value={newTariff.effectiveDate || ""}
                                    onChange={(e) =>
                                        setNewTariff({ ...newTariff, effectiveDate: e.target.value })
                                    }
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Expiry Date</Label>
                                <Input
                                    type="date"
                                    value={newTariff.expiryDate || ""}
                                    onChange={(e) =>
                                        setNewTariff({ ...newTariff, expiryDate: e.target.value })
                                    }
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Origin Countries</Label>
                                <Input
                                    placeholder="Comma-separated (e.g. China, Japan)"
                                    onChange={(e) =>
                                        setNewTariff({ ...newTariff, origins: e.target.value })
                                    }
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Destination Countries</Label>
                                <Input
                                    placeholder="Comma-separated (e.g. Singapore, Malaysia)"
                                    onChange={(e) =>
                                        setNewTariff({ ...newTariff, destinations: e.target.value })
                                    }
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button size="lg" className="px-8" onClick={handleCreate}>
                                <Plus className="h-4 w-4 mr-2" /> Add Tariff
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border rounded-md overflow-auto">
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
                                    <th className="px-2 py-2 text-left">Description</th>
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
                                {tariffs.map((t) => (
                                    <tr
                                        key={t.tariffId}
                                        className="border-t hover:bg-muted/40 transition"
                                    >
                                        <td className="px-2 py-1.5">{t.tariffId}</td>
                                        <td className="px-2 py-1.5 font-mono">{t.hsCode.hsCode}</td>
                                        <td className="px-2 py-1.5">{t.hsCode.description}</td>
                                        <td className="px-2 py-1.5">{t.baseRate}%</td>
                                        <td className="px-2 py-1.5">{t.rateType}</td>
                                        <td className="px-2 py-1.5">{formatDate(t.effectiveDate)}</td>
                                        <td className="px-2 py-1.5">{formatDate(t.expiryDate)}</td>
                                        <td className="px-2 py-1.5">
                                            {t.tariffOrigins.map((o) => o.country.name).join(", ") || "—"}
                                        </td>
                                        <td className="px-2 py-1.5">
                                            {t.tariffDestinations
                                                .map((d) => d.country.name)
                                                .join(", ") || "—"}
                                        </td>
                                        <td className="px-2 py-1.5 text-center">
                                            <div className="flex gap-1 justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-6 px-2 text-[11px]"
                                                    onClick={() => {
                                                        setEditingId(t.tariffId!);
                                                        setEditedTariff({
                                                            ...t,
                                                            origins: t.tariffOrigins
                                                                .map((o) => o.country.name)
                                                                .join(", "),
                                                            destinations: t.tariffDestinations
                                                                .map((d) => d.country.name)
                                                                .join(", "),
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
