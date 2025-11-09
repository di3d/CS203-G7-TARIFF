"use client";

import React, {useEffect, useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/app/components/ui/card";
import {Input} from "@/app/components/ui/input";
import {Button} from "@/app/components/ui/button";
import {
    Loader2,
    Cog,
    AlertCircle,
    Save,
    X,
    Plus,
    Trash2,
    Edit2,
} from "lucide-react";
import {toast} from "sonner";
import {api} from "@/lib/api";

interface Country {
    countryId?: number;
    name: string;
    isoCode?: string;
    region?: string;
}

interface TariffOrigin {
    country: Country;
}

interface TariffDestination {
    country: Country;
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
    tariffOrigins: TariffOrigin[];
    tariffDestinations: TariffDestination[];
}

type EditableTariff = Partial<Tariff> & {
    origins?: string;
    destinations?: string;
};

export default function ManageTariff() {
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTariff, setEditedTariff] = useState<EditableTariff>({});
    const [newTariff, setNewTariff] = useState<EditableTariff>({
        hsCode: {hsCode: "", description: ""},
        baseRate: 0,
        rateType: "",
        effectiveDate: "",
        expiryDate: "",
        tariffOrigins: [],
        tariffDestinations: [],
    });

    const fetchTariffs = async (): Promise<void> => {
        try {
            setLoading(true);
            const {data} = await api.get<Tariff[]>("/tariffs");
            setTariffs(data);
        } catch {
            setError("Failed to load tariffs.");
            toast.error("Failed to load tariffs from server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchTariffs();
    }, []);

    const handleCreate = async (): Promise<void> => {
        try {
            const payload: Tariff = {
                ...(newTariff as Tariff),
                tariffOrigins: newTariff.origins
                    ? newTariff.origins
                        .split(",")
                        .map((o) => ({country: {name: o.trim()}}))
                    : [],
                tariffDestinations: newTariff.destinations
                    ? newTariff.destinations
                        .split(",")
                        .map((d) => ({country: {name: d.trim()}}))
                    : [],
            };

            await api.post("/tariffs", payload);
            toast.success("Tariff created.");
            setNewTariff({
                hsCode: {hsCode: "", description: ""},
                baseRate: 0,
                rateType: "",
                effectiveDate: "",
                expiryDate: "",
                tariffOrigins: [],
                tariffDestinations: [],
            });
            await fetchTariffs();
        } catch {
            toast.error("Failed to create tariff.");
        }
    };

    const handleSave = async (): Promise<void> => {
        if (!editingId) return;
        try {
            const payload: Tariff = {
                ...(editedTariff as Tariff),
                tariffOrigins: editedTariff.origins
                    ? editedTariff.origins
                        .split(",")
                        .map((o) => ({country: {name: o.trim()}}))
                    : [],
                tariffDestinations: editedTariff.destinations
                    ? editedTariff.destinations
                        .split(",")
                        .map((d) => ({country: {name: d.trim()}}))
                    : [],
            };

            await api.put(`/tariffs/${editingId}`, payload);
            toast.success("Tariff updated.");
            setEditingId(null);
            await fetchTariffs();
        } catch {
            toast.error("Failed to update tariff.");
        }
    };

    const handleDelete = async (id?: number): Promise<void> => {
        if (!id) return;
        if (!confirm("Delete this tariff?")) return;
        try {
            await api.delete(`/tariffs/${id}`);
            toast.success("Tariff deleted.");
            await fetchTariffs();
        } catch {
            toast.error("Failed to delete tariff.");
        }
    };

    const formatDate = (date: string | null): string => {
        if (!date) return "—";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-SG");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5"/>
                    Manage Tariffs
                </CardTitle>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-10 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2"/>
                        Loading tariffs...
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 text-destructive py-4">
                        <AlertCircle className="h-4 w-4"/>
                        {error}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-6 gap-2">
                            <Input
                                placeholder="HS Code"
                                value={newTariff.hsCode?.hsCode || ""}
                                onChange={(e) =>
                                    setNewTariff({
                                        ...newTariff,
                                        hsCode: {...newTariff.hsCode!, hsCode: e.target.value},
                                    })
                                }
                            />
                            <Input
                                placeholder="Description"
                                value={newTariff.hsCode?.description || ""}
                                onChange={(e) =>
                                    setNewTariff({
                                        ...newTariff,
                                        hsCode: {...newTariff.hsCode!, description: e.target.value},
                                    })
                                }
                            />
                            <Input
                                type="number"
                                placeholder="Base Rate"
                                value={newTariff.baseRate || ""}
                                onChange={(e) =>
                                    setNewTariff({
                                        ...newTariff,
                                        baseRate: parseFloat(e.target.value),
                                    })
                                }
                            />
                            <Input
                                placeholder="Rate Type"
                                value={newTariff.rateType || ""}
                                onChange={(e) =>
                                    setNewTariff({...newTariff, rateType: e.target.value})
                                }
                            />
                            <Input
                                type="date"
                                value={newTariff.effectiveDate || ""}
                                onChange={(e) =>
                                    setNewTariff({...newTariff, effectiveDate: e.target.value})
                                }
                            />
                            <Input
                                type="date"
                                value={newTariff.expiryDate || ""}
                                onChange={(e) =>
                                    setNewTariff({...newTariff, expiryDate: e.target.value})
                                }
                            />
                            <Input
                                placeholder="Origins (comma-separated)"
                                className="col-span-3"
                                onChange={(e) =>
                                    setNewTariff({...newTariff, origins: e.target.value})
                                }
                            />
                            <Input
                                placeholder="Destinations (comma-separated)"
                                className="col-span-3"
                                onChange={(e) =>
                                    setNewTariff({...newTariff, destinations: e.target.value})
                                }
                            />
                            <Button className="col-span-6 mt-2" onClick={handleCreate}>
                                <Plus className="h-4 w-4 mr-1"/>
                                Add Tariff
                            </Button>
                        </div>

                        <div className="border rounded-md overflow-auto">
                            <table className="w-full text-xs">
                                <thead>
                                <tr className="bg-muted/50 text-muted-foreground uppercase text-[11px]">
                                    <th className="px-2 py-2 text-left">ID</th>
                                    <th className="px-2 py-2 text-left">HS</th>
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
                                {tariffs.map((t) =>
                                    editingId === t.tariffId ? (
                                        <tr key={t.tariffId} className="border-t bg-muted/30">
                                            <td className="px-2 py-1.5">{t.tariffId}</td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={editedTariff.hsCode?.hsCode || ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            hsCode: {
                                                                ...editedTariff.hsCode!,
                                                                hsCode: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={editedTariff.hsCode?.description || ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            hsCode: {
                                                                ...editedTariff.hsCode!,
                                                                description: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    type="number"
                                                    value={editedTariff.baseRate || ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            baseRate: parseFloat(e.target.value),
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={editedTariff.rateType || ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            rateType: e.target.value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    type="date"
                                                    value={editedTariff.effectiveDate?.split("T")[0] || ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            effectiveDate: e.target.value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    type="date"
                                                    value={editedTariff.expiryDate?.split("T")[0] || ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            expiryDate: e.target.value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={editedTariff.origins || ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            origins: e.target.value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={editedTariff.destinations || ""}
                                                    onChange={(e) =>
                                                        setEditedTariff({
                                                            ...editedTariff,
                                                            destinations: e.target.value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                                <div className="flex justify-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={handleSave}
                                                    >
                                                        <Save className="h-3 w-3"/>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        <X className="h-3 w-3"/>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr
                                            key={t.tariffId}
                                            className="border-t hover:bg-muted/40 transition"
                                        >
                                            <td className="px-2 py-1.5">{t.tariffId}</td>
                                            <td className="px-2 py-1.5 font-mono">
                                                {t.hsCode.hsCode}
                                            </td>
                                            <td className="px-2 py-1.5">{t.hsCode.description}</td>
                                            <td className="px-2 py-1.5">{t.baseRate}%</td>
                                            <td className="px-2 py-1.5">{t.rateType}</td>
                                            <td className="px-2 py-1.5">
                                                {formatDate(t.effectiveDate)}
                                            </td>
                                            <td className="px-2 py-1.5">
                                                {formatDate(t.expiryDate)}
                                            </td>
                                            <td className="px-2 py-1.5">
                                                {t.tariffOrigins?.map((o) => o.country.name).join(", ") || "—"}
                                            </td>
                                            <td className="px-2 py-1.5">
                                                {t.tariffDestinations?.map((d) => d.country.name).join(", ") || "—"}
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
                                                        <Edit2 className="h-3 w-3"/>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={() => void handleDelete(t.tariffId)}
                                                    >
                                                        <Trash2 className="h-3 w-3"/>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
