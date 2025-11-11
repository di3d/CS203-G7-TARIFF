"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/app/components/ui/card";
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
import { api } from "@/lib/api";

interface Section {
    id: number;
    code: string;
    name: string;
}

interface HsCode {
    hsCode: string;
    description: string;
    parent?: string;
    level?: string;
    section?: Section | null;
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
        parent: "",
        level: "",
        section: null,
    });

    // === Fetch all HS codes ===
    const fetchHsCodes = async () => {
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

    // === Create ===
    const handleCreate = async () => {
        if (!newCode.hsCode.trim() || !newCode.description.trim()) {
            toast.error("HS Code and description are required.");
            return;
        }
        try {
            await api.post("/api/hscodes", newCode);
            toast.success("HS Code added.");
            setNewCode({
                hsCode: "",
                description: "",
                parent: "",
                level: "",
                section: null,
            });
            await fetchHsCodes();
        } catch {
            toast.error("Unable to create HS Code.");
        }
    };

    // === Update ===
    const handleSave = async () => {
        if (!editing) return;
        try {
            await api.put(`/api/hscodes/${editing}`, edited);
            toast.success("HS Code updated.");
            setEditing(null);
            await fetchHsCodes();
        } catch {
            toast.error("Unable to update HS Code.");
        }
    };

    // === Delete ===
    const handleDelete = async (code: string) => {
        if (!confirm(`Delete HS Code ${code}?`)) return;
        try {
            await api.delete(`/api/hscodes/${code}`);
            toast.success("HS Code deleted.");
            await fetchHsCodes();
        } catch {
            toast.error("Unable to delete HS Code.");
        }
    };

    // === Render ===
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cog className="h-10 w-10 text-primary" />
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
                        {/* Add new HS code */}
                        <div className="flex flex-wrap gap-2">
                            <Input
                                placeholder="HS Code"
                                className="w-24"
                                value={newCode.hsCode}
                                onChange={(e) =>
                                    setNewCode({ ...newCode, hsCode: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Description"
                                className="flex-1 min-w-[200px]"
                                value={newCode.description}
                                onChange={(e) =>
                                    setNewCode({ ...newCode, description: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Parent (optional)"
                                className="w-24"
                                value={newCode.parent ?? ""}
                                onChange={(e) =>
                                    setNewCode({ ...newCode, parent: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Level (2/4/6)"
                                className="w-20"
                                value={newCode.level ?? ""}
                                onChange={(e) =>
                                    setNewCode({ ...newCode, level: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Section code (e.g. XVI)"
                                className="w-24"
                                value={
                                    newCode.section?.code ??
                                    (typeof newCode.section === "string"
                                        ? newCode.section
                                        : "")
                                }
                                onChange={(e) =>
                                    setNewCode({
                                        ...newCode,
                                        section: { id: 0, code: e.target.value, name: "" },
                                    })
                                }
                            />
                            <Button onClick={handleCreate}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="border rounded-md overflow-auto">
                            <table className="w-full text-xs">
                                <thead>
                                <tr className="bg-muted/50 text-muted-foreground uppercase text-[11px]">
                                    <th className="px-2 py-2 text-left">HS Code</th>
                                    <th className="px-2 py-2 text-left">Description</th>
                                    <th className="px-2 py-2 text-left">Section</th>
                                    <th className="px-2 py-2 text-left">Parent</th>
                                    <th className="px-2 py-2 text-left">Level</th>
                                    <th className="px-2 py-2 text-center">Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {codes.map((c) =>
                                    editing === c.hsCode ? (
                                        <tr key={c.hsCode} className="border-t bg-muted/30">
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
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={
                                                        !edited.section
                                                            ? ""
                                                            : typeof edited.section === "object"
                                                                ? edited.section.code ?? ""
                                                                : edited.section
                                                    }
                                                    onChange={(e) => {
                                                        const code = e.target.value;
                                                        setEdited({
                                                            ...edited,
                                                            section: code
                                                                ? { id: 0, code, name: "" }
                                                                : null,
                                                        });
                                                    }}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={edited.parent ?? ""}
                                                    onChange={(e) =>
                                                        setEdited({ ...edited, parent: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Input
                                                    value={edited.level ?? ""}
                                                    onChange={(e) =>
                                                        setEdited({ ...edited, level: e.target.value })
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
                                            <td className="px-2 py-1.5">
                                                {c.section
                                                    ? `${c.section.code} — ${c.section.name}`
                                                    : "—"}
                                            </td>
                                            <td className="px-2 py-1.5">{c.parent ?? "—"}</td>
                                            <td className="px-2 py-1.5">{c.level ?? "—"}</td>
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
