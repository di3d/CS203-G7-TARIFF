"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/app/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList, CommandInput } from "@/app/components/ui/command";
import {Check, Cog, Plus, Search} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";

interface Country {
    name: string;
}

interface HsCode {
    hsCode: string;
    description: string;
}

export default function AddTariff() {
    const [newTariff, setNewTariff] = useState({
        hsCode: { hsCode: "", description: "" },
        baseRate: 0,
        rateType: "Ad Valorem",
        effectiveDate: "",
        expiryDate: "",
        origins: [] as string[],
        destinations: [] as string[],
    });

    const [hsCodes, setHsCodes] = useState<HsCode[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [openHS, setOpenHS] = useState(false);
    const [openOrigin, setOpenOrigin] = useState(false);
    const [openDest, setOpenDest] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hsCodesRes, countriesRes] = await Promise.all([
                    api.get("/hscodes"),
                    api.get("/countries"),
                ]);
                setHsCodes(hsCodesRes.data);
                setCountries(countriesRes.data);
            } catch {
                toast.error("Failed to load data.");
            }
        };
        fetchData();
    }, []);

    const toggleSelection = (list: string[], value: string): string[] =>
        list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

    const handleCreate = async () => {
        const overlap = newTariff.origins.some((o) => newTariff.destinations.includes(o));
        if (overlap) {
            toast.error("Origin and destination cannot be the same country.");
            return;
        }

        try {
            const payload = {
                ...newTariff,
                tariffOrigins: newTariff.origins.map((name) => ({ country: { name } })),
                tariffDestinations: newTariff.destinations.map((name) => ({ country: { name } })),
            };

            await api.post("/tariffs", payload);
            toast.success("Tariff created.");
            setNewTariff({
                hsCode: { hsCode: "", description: "" },
                baseRate: 0,
                rateType: "Ad Valorem",
                effectiveDate: "",
                expiryDate: "",
                origins: [],
                destinations: [],
            });
        } catch (err) {
            toast.error("Failed to create tariff.");
        }
    };

    return (

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-10 w-10 text-primary" />
                        Add New Tariff
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                    {/* HS CODE SELECT */}
                    <div className="mb-4">
                        <Label>HS Code</Label>
                        <Popover open={openHS} onOpenChange={setOpenHS}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-left px-4 py-2 flex justify-between items-center">
                                    {newTariff.hsCode.hsCode ? `${newTariff.hsCode.hsCode} - ${newTariff.hsCode.description}` : "Select HS Code"}
                                    <Search className="ml-2 h-5 w-5 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[420px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search HS codes..." className="py-2 px-4 border-b" />
                                    <CommandList>
                                        {hsCodes.map((item) => (
                                            <CommandItem
                                                key={item.hsCode}
                                                onSelect={() => {
                                                    setNewTariff({ ...newTariff, hsCode: item });
                                                    setOpenHS(false);
                                                }}
                                                className="p-4 hover:bg-gray-100"
                                            >
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium">{item.hsCode}</span>
                                                    <span className="text-xs text-gray-500">{item.description}</span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Rate Type */}
                    <div className="mb-4">
                        <Label>Rate Type</Label>
                        <select
                            value={newTariff.rateType}
                            onChange={(e) => setNewTariff({ ...newTariff, rateType: e.target.value })}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="Ad Valorem">Ad Valorem</option>
                            <option value="Specific">Specific</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>

                    {/* Other Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mb-4">
                            <Label>Base Rate (%)</Label>
                            <Input
                                type="number"
                                value={newTariff.baseRate}
                                onChange={(e) => setNewTariff({ ...newTariff, baseRate: parseFloat(e.target.value) })}
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <Label>Effective Date</Label>
                            <Input
                                type="date"
                                value={newTariff.effectiveDate}
                                onChange={(e) => setNewTariff({ ...newTariff, effectiveDate: e.target.value })}
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <Label>Expiry Date</Label>
                            <Input
                                type="date"
                                value={newTariff.expiryDate}
                                onChange={(e) => setNewTariff({ ...newTariff, expiryDate: e.target.value })}
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Origins and Destinations */}
                    <div className="mb-4">
                        <Label>Origin Countries</Label>
                        <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between h-11 text-left">
                                    {newTariff.origins.length ? newTariff.origins.join(", ") : "Select Origins"}
                                    <Search className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    {countries.map((c) => (
                                        <CommandItem
                                            key={c.name}
                                            onSelect={() =>
                                                setNewTariff({
                                                    ...newTariff,
                                                    origins: toggleSelection(newTariff.origins, c.name),
                                                })
                                            }
                                            className="p-4 hover:bg-gray-100"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    newTariff.origins.includes(c.name) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {c.name}
                                        </CommandItem>
                                    ))}
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="mb-4">
                        <Label>Destination Countries</Label>
                        <Popover open={openDest} onOpenChange={setOpenDest}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between h-11 text-left">
                                    {newTariff.destinations.length ? newTariff.destinations.join(", ") : "Select Destinations"}
                                    <Search className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    {countries.map((c) => (
                                        <CommandItem
                                            key={c.name}
                                            onSelect={() =>
                                                setNewTariff({
                                                    ...newTariff,
                                                    destinations: toggleSelection(newTariff.destinations, c.name),
                                                })
                                            }
                                            className="p-4 hover:bg-gray-100"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    newTariff.destinations.includes(c.name) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {c.name}
                                        </CommandItem>
                                    ))}
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Add Tariff Button */}
                    <div className="flex justify-end">
                        <Button size="lg" className="px-8 py-3 bg-blue-500 text-white hover:bg-blue-600" onClick={handleCreate}>
                            <Plus className="h-5 w-5 mr-2" /> Add Tariff
                        </Button>
                    </div>
                </CardContent>
            </Card>
    );
}
