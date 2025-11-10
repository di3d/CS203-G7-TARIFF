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
    origins?: string[];
    destinations?: string[];
};

export default function ManageTariffPage() {
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [hsCodes, setHsCodes] = useState<HsCode[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [openHS, setOpenHS] = useState(false);
    const [openOrigin, setOpenOrigin] = useState(false);
    const [openDest, setOpenDest] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTariff, setEditedTariff] = useState<EditableTariff>({});
    const [openOriginEdit, setOpenOriginEdit] = useState(false);
    const [openDestEdit, setOpenDestEdit] = useState(false);

    const [newTariff, setNewTariff] = useState<EditableTariff>({
        hsCode: { hsCode: "", description: "" },
        baseRate: 0,
        rateType: "",
        effectiveDate: "",
        expiryDate: "",
        origins: [],
        destinations: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tariffsRes, hsCodesRes, countriesRes] = await Promise.all([
                    api.get("/tariffs"),
                    api.get("/hscodes"),
                    api.get("/countries"),
                ]);
                setTariffs(tariffsRes.data);
                setHsCodes(hsCodesRes.data);
                setCountries(countriesRes.data);
            } catch {
                setError("Failed to load data.");
                toast.error("Could not fetch tariffs, HS codes, or countries.");
            } finally {
                setLoading(false);
            }
        };
        void fetchData();
    }, []);

    const refreshTariffs = async () => {
        const { data } = await api.get("/tariffs");
        setTariffs(data);
    };

    const toggleSelection = (list: string[] = [], value: string): string[] =>
        list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

    const handleCreate = async () => {
        try {
            const payload: Tariff = {
                ...(newTariff as Tariff),
                tariffOrigins: newTariff.origins?.map((n) => ({ country: { name: n } })) ?? [],
                tariffDestinations: newTariff.destinations?.map((n) => ({ country: { name: n } })) ?? [],
            };
            await api.post("/tariffs", payload);
            toast.success("Tariff created.");
            setNewTariff({
                hsCode: { hsCode: "", description: "" },
                baseRate: 0,
                rateType: "",
                effectiveDate: "",
                expiryDate: "",
                origins: [],
                destinations: [],
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
                tariffOrigins: editedTariff.origins?.map((n) => ({ country: { name: n } })) ?? [],
                tariffDestinations: editedTariff.destinations?.map((n) => ({ country: { name: n } })) ?? [],
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
                    {/* === CREATE FORM === */}
                    <div className="space-y-6">
                        {/* HS CODE SELECT */}
                        <div className="space-y-2">
                            <Label>HS Code</Label>
                            <Popover open={openHS} onOpenChange={setOpenHS}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between h-11 text-left">
                                        {newTariff.hsCode?.hsCode
                                            ? `${newTariff.hsCode.hsCode} - ${newTariff.hsCode.description}`
                                            : "Select HS Code"}
                                        <Search className="ml-2 h-4 w-4 opacity-50" />
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
                                                        onSelect={() => {
                                                            setNewTariff({ ...newTariff, hsCode: item });
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
                                        setNewTariff({ ...newTariff, baseRate: parseFloat(e.target.value) })
                                    }
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rate Type</Label>
                                <Input
                                    value={newTariff.rateType || ""}
                                    onChange={(e) => setNewTariff({ ...newTariff, rateType: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Effective Date</Label>
                                <Input
                                    type="date"
                                    value={newTariff.effectiveDate || ""}
                                    onChange={(e) => setNewTariff({ ...newTariff, effectiveDate: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Expiry Date</Label>
                                <Input
                                    type="date"
                                    value={newTariff.expiryDate || ""}
                                    onChange={(e) => setNewTariff({ ...newTariff, expiryDate: e.target.value })}
                                    className="h-11"
                                />
                            </div>

                            {/* ORIGINS */}
                            <div className="space-y-2">
                                <Label>Origin Countries</Label>
                                <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between h-11 text-left">
                                            {newTariff.origins?.length
                                                ? newTariff.origins.join(", ")
                                                : "Select origins"}
                                            <Search className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search countries..." />
                                            <CommandList>
                                                <CommandEmpty>No countries found.</CommandEmpty>
                                                <CommandGroup>
                                                    {countries.map((c) => {
                                                        const selected = newTariff.origins?.includes(c.name);
                                                        return (
                                                            <CommandItem
                                                                key={c.name}
                                                                onSelect={() =>
                                                                    setNewTariff({
                                                                        ...newTariff,
                                                                        origins: toggleSelection(newTariff.origins, c.name),
                                                                    })
                                                                }
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selected ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {c.name}
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* DESTINATIONS */}
                            <div className="space-y-2">
                                <Label>Destination Countries</Label>
                                <Popover open={openDest} onOpenChange={setOpenDest}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between h-11 text-left">
                                            {newTariff.destinations?.length
                                                ? newTariff.destinations.join(", ")
                                                : "Select destinations"}
                                            <Search className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search countries..." />
                                            <CommandList>
                                                <CommandEmpty>No countries found.</CommandEmpty>
                                                <CommandGroup>
                                                    {countries.map((c) => {
                                                        const selected = newTariff.destinations?.includes(c.name);
                                                        return (
                                                            <CommandItem
                                                                key={c.name}
                                                                onSelect={() =>
                                                                    setNewTariff({
                                                                        ...newTariff,
                                                                        destinations: toggleSelection(
                                                                            newTariff.destinations,
                                                                            c.name
                                                                        ),
                                                                    })
                                                                }
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selected ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {c.name}
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button size="lg" className="px-8" onClick={handleCreate}>
                                <Plus className="h-4 w-4 mr-2" /> Add Tariff
                            </Button>
                        </div>
                    </div>

                    {/* === TABLE === */}
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
                                    <th className="px-2 py-2 text-left">Rate</th>
                                    <th className="px-2 py-2 text-left">Type</th>
                                    <th className="px-2 py-2 text-left">Origins</th>
                                    <th className="px-2 py-2 text-left">Destinations</th>
                                    <th className="px-2 py-2 text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tariffs.map((t) => {
                                    const isEditing = editingId === t.tariffId;
                                    return (
                                        <tr key={t.tariffId} className="border-t hover:bg-muted/40 transition">
                                            <td className="px-2 py-1.5">{t.tariffId}</td>
                                            <td className="px-2 py-1.5 font-mono">{t.hsCode.hsCode}</td>
                                            <td className="px-2 py-1.5">
                                                {isEditing ? (
                                                    <Input
                                                        type="number"
                                                        value={editedTariff.baseRate ?? t.baseRate}
                                                        onChange={(e) =>
                                                            setEditedTariff({
                                                                ...editedTariff,
                                                                baseRate: parseFloat(e.target.value),
                                                            })
                                                        }
                                                        className="h-7 text-xs"
                                                    />
                                                ) : (
                                                    `${t.baseRate}%`
                                                )}
                                            </td>
                                            <td className="px-2 py-1.5">
                                                {isEditing ? (
                                                    <Input
                                                        value={editedTariff.rateType ?? t.rateType}
                                                        onChange={(e) =>
                                                            setEditedTariff({ ...editedTariff, rateType: e.target.value })
                                                        }
                                                        className="h-7 text-xs"
                                                    />
                                                ) : (
                                                    t.rateType
                                                )}
                                            </td>

                                            {/* Editable Origins */}
                                            <td className="px-2 py-1.5">
                                                {isEditing ? (
                                                    <Popover open={openOriginEdit} onOpenChange={setOpenOriginEdit}>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">
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
                                                                            const selected = editedTariff.origins?.includes(c.name);
                                                                            return (
                                                                                <CommandItem
                                                                                    key={c.name}
                                                                                    onSelect={() =>
                                                                                        setEditedTariff({
                                                                                            ...editedTariff,
                                                                                            origins: toggleSelection(
                                                                                                editedTariff.origins,
                                                                                                c.name
                                                                                            ),
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            selected ? "opacity-100" : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                    {c.name}
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

                                            {/* Editable Destinations */}
                                            <td className="px-2 py-1.5">
                                                {isEditing ? (
                                                    <Popover open={openDestEdit} onOpenChange={setOpenDestEdit}>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">
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
                                                                            return (
                                                                                <CommandItem
                                                                                    key={c.name}
                                                                                    onSelect={() =>
                                                                                        setEditedTariff({
                                                                                            ...editedTariff,
                                                                                            destinations: toggleSelection(
                                                                                                editedTariff.destinations,
                                                                                                c.name
                                                                                            ),
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            selected ? "opacity-100" : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                    {c.name}
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
                                                                    setEditingId(t.tariffId!);
                                                                    setEditedTariff({
                                                                        ...t,
                                                                        origins: t.tariffOrigins.map(
                                                                            (o) => o.country.name
                                                                        ),
                                                                        destinations: t.tariffDestinations.map(
                                                                            (d) => d.country.name
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
