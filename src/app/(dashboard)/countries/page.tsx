// app/admin/countries/page.tsx
"use client";

import {useEffect, useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/select";
import {Trash2, Plus, Loader2} from "lucide-react";
import countries from "world-countries";

interface Country {
    id?: number;
    name: string;
    isoCode: string;
    region: string;
}

const PRESET_COUNTRIES = countries.map((c) => ({
    name: c.name.common,
    isoCode: c.cca2,        // two-letter ISO
    region: c.region,
}));


export default function CountriesAdmin() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Country | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/countries")
            .then((r) => r.json())
            .then(setCountries)
            .finally(() => setLoading(false));
    }, []);

    const addCountry = async () => {
        if (!selected) return;

        const res = await fetch("http://localhost:8080/api/countries", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(selected),
        });

        if (res.ok) {
            const created = await res.json();
            // Normalize backend naming
            const normalized = {
                id: created.id ?? created.countryId,
                name: created.name,
                isoCode: created.isoCode,
                region: created.region,
            };

            setCountries((prev) => [...prev, normalized]);
            setSelected(null);
        }
    };

    const deleteCountry = async (id: number) => {
        const res = await fetch(`http://localhost:8080/api/countries/${id}`, {method: "DELETE"});

        if (res.status === 409) {
            const msg = await res.text();
            alert(msg);
            return;
        }

        if (res.ok) setCountries((prev) => prev.filter((c) => c.id !== id));
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-60 text-muted-foreground">
                <Loader2 className="animate-spin mr-2"/> Loading countries...
            </div>
        );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Countries</CardTitle>
            </CardHeader>

            <CardContent>
                {/* Dropdown Add Country */}
                <div className="flex gap-2 mb-4 items-center">
                    <Select
                        value={selected?.isoCode ?? ""}
                        onValueChange={(v) => {
                            const c = PRESET_COUNTRIES.find((x) => x.isoCode === v);
                            if (c) setSelected(c);
                        }}
                    >
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select a country..."/>
                        </SelectTrigger>
                        <SelectContent>
                            {PRESET_COUNTRIES.map((c) => (
                                <SelectItem key={c.isoCode} value={c.isoCode}>
                                    {c.name} ({c.isoCode})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={addCountry} disabled={!selected}>
                        <Plus className="h-4 w-4 mr-1"/> Add
                    </Button>
                </div>

                {/* Countries Table */}
                <table className="w-full border text-sm">
                    <thead className="bg-muted/50">
                    <tr>
                        <th className="text-left px-4 py-2">ID</th>
                        <th className="text-left px-4 py-2">Name</th>
                        <th className="text-left px-4 py-2">ISO</th>
                        <th className="text-left px-4 py-2">Region</th>
                        <th className="text-left px-4 py-2">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {countries.map((c) => (
                        <tr key={c.id} className="border-b last:border-0">
                            <td className="px-4 py-2">{c.id}</td>
                            <td className="px-4 py-2">{c.name}</td>
                            <td className="px-4 py-2">{c.isoCode}</td>
                            <td className="px-4 py-2">{c.region}</td>
                            <td className="px-4 py-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteCountry(c.id!)}
                                >
                                    <Trash2 className="h-3 w-3"/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
