"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
    Loader2,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Cog,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {api} from "@/lib/api";

interface HsCode {
    hsCode: string;
    description: string;
}

export default function ManageHsCodes() {
    const [codes, setCodes] = useState<HsCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState<string | null>(null);
    const [edited, setEdited] = useState<Partial<HsCode>>({});
    const [newCode, setNewCode] = useState<HsCode>({
        hsCode: "",
        description: "",
    });

    const fetchHsCodes = async (): Promise<void> => {
        try {
            setLoading(true);
            const { data } = await api.get<HsCode[]>("/hscodes");
            setCodes(data);
        } catch {
            setError("Unable to load HS Codes.");
            toast.error("Failed to fetch HS Codes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchHsCodes();
    }, []);

    const handleCreate = async (): Promise<void> => {
        if (!newCode.hsCode.trim() || !newCode.description.trim()) {
            toast.error("Please fill both HS code and description.");
            return;
        }
        try {
            await api.post("/hscodes", newCode);
            toast.success("HS Code added successfully.");
            setNewCode({ hsCode: "", description: "" });
            await fetchHsCodes();
        } catch {
            toast.error("Unable to create HS Code.");
        }
    };

    const handleSave = async (): Promise<void> => {
        if (!editing) return;
        try {
            await api.put(`/hscodes/${editing}`, edited);
            toast.success("HS Code updated.");
            setEditing(null);
            await fetchHsCodes();
        } catch {
            toast.error("Unable to update HS Code.");
        }
    };

    const handleDelete = async (code: string): Promise<void> => {
        if (!confirm(`Delete HS Code ${code}?`)) return;
        try {
            await api.delete(`/hscodes/${code}`);
            toast.success("HS Code deleted.");
            await fetchHsCodes();
        } catch {
            toast.error("Unable to delete HS Code.");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5" />
                    Manage HS Codes
                </CardTitle>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-10 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading HS Codes...
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 text-destructive py-4">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="HS Code"
                                value={newCode.hsCode}
                                onChange={(e) =>
                                    setNewCode({ ...newCode, hsCode: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Description"
                                value={newCode.description}
                                onChange={(e) =>
                                    setNewCode({ ...newCode, description: e.target.value })
                                }
                            />
                            <Button onClick={handleCreate}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>

                        <div className="border rounded-md overflow-auto">
                            <table className="w-full text-xs">
                                <thead>
                                <tr className="bg-muted/50 text-muted-foreground uppercase text-[11px]">
                                    <th className="px-2 py-2 text-left">HS Code</th>
                                    <th className="px-2 py-2 text-left">Description</th>
                                    <th className="px-2 py-2 text-center">Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {codes.map((c) =>
                                    editing === c.hsCode ? (
                                        <tr
                                            key={c.hsCode}
                                            className="border-t bg-muted/30 transition"
                                        >
                                            <td className="px-2 py-1.5 font-mono">{c.hsCode}</td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={edited.description || ""}
                                                    onChange={(e) =>
                                                        setEdited({
                                                            ...edited,
                                                            description: e.target.value,
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
                                                        <Save className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={() => setEditing(null)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr
                                            key={c.hsCode}
                                            className="border-t hover:bg-muted/40 transition"
                                        >
                                            <td className="px-2 py-1.5 font-mono">{c.hsCode}</td>
                                            <td className="px-2 py-1.5">{c.description}</td>
                                            <td className="px-2 py-1.5 text-center">
                                                <div className="flex justify-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={() => {
                                                            setEditing(c.hsCode);
                                                            setEdited({ ...c });
                                                        }}
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="h-6 px-2 text-[11px]"
                                                        onClick={() => void handleDelete(c.hsCode)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
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
