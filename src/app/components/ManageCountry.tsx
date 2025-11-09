"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/Map/ui/card";
import { Button } from "@/app/components/Map/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/app/components/Map/ui/select";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import countries from "world-countries";
import axios from "axios";

interface Country {
    id?: number;
    countryId?: number;
    name: string;
    isoCode: string;
    region: string;
}

const PRESET_COUNTRIES = countries.map((c) => ({
    name: c.name.common,
    isoCode: c.cca2,
    region: c.region,
}));

export function ManageCountry() {
    const [countriesData, setCountriesData] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Country | null>(null);

    useEffect(() => {
        void fetchCountries();
    }, []);

    const fetchCountries = async (): Promise<void> => {
        try {
            const { data } = await api.get<Country[]>("/countries");
            setCountriesData(data);
        } finally {
            setLoading(false);
        }
    };

    const addCountry = async (): Promise<void> => {
        if (!selected) return;

        const { data } = await api.post<Country>("/countries", selected);

        const normalized = {
            id: data.id ?? data.countryId,
            name: data.name,
            isoCode: data.isoCode,
            region: data.region,
        };

        setCountriesData((prev) => [...prev, normalized]);
        setSelected(null);
    };

    const deleteCountry = async (id: number): Promise<void> => {
        try {
            await api.delete(`/countries/${id}`);
            setCountriesData((prev) => prev.filter((c) => c.id !== id));
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                alert(err.response.data);
            }
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-60 text-muted-foreground">
                <Loader2 className="animate-spin mr-2" /> Loading countries...
            </div>
        );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Countries</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex gap-2 mb-4 items-center">
                    <Select
                        value={selected?.isoCode ?? ""}
                        onValueChange={(v) => {
                            const c = PRESET_COUNTRIES.find((x) => x.isoCode === v);
                            if (c) setSelected(c);
                        }}
                    >
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select a country..." />
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
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                </div>

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
                    {countriesData.map((c) => (
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
                                    <Trash2 className="h-3 w-3" />
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
