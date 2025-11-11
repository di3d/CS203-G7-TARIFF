"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/app/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList, CommandInput } from "@/app/components/ui/command";
import {Check, Earth, Plus, Search} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";

interface Country {
    name: string;
    countryId: number;
}

interface TradeAgreement {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    countries: string[]; // list of country names involved
}

export default function ManageTradeAgreements() {
    const [tradeAgreement, setTradeAgreement] = useState<TradeAgreement>({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        countries: [],
    });

    const [countries, setCountries] = useState<Country[]>([]);
    const [openCountrySelect, setOpenCountrySelect] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const countriesRes = await api.get("/countries");
                setCountries(countriesRes.data);
            } catch {
                toast.error("Failed to load countries.");
            }
        };
        fetchData();
    }, []);

    const toggleCountrySelection = (country: string): string[] => {
        return tradeAgreement.countries.includes(country)
            ? tradeAgreement.countries.filter((c) => c !== country)
            : [...tradeAgreement.countries, country];
    };

    const handleSaveTradeAgreement = async () => {
        // Validate the dates to ensure the expiry date is after the start date
        console.log(tradeAgreement);
        if (tradeAgreement.startDate > tradeAgreement.endDate) {
            toast.error("Expiry date cannot be earlier than start date.");
            return;
        }

        try {
            const payload = {
                ...tradeAgreement,
                countries: tradeAgreement.countries.map((country) => ({ name: country })), // Map countries to the expected format
            };

            if (tradeAgreement.name && tradeAgreement.startDate && tradeAgreement.endDate) {
                await api.post("/trade-agreements", payload); // Send the request to the backend
                toast.success("Trade Agreement created.");
                setTradeAgreement({
                    name: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    countries: [],
                });
            } else {
                toast.error("Please fill in all required fields.");
            }
        } catch (err) {
            toast.error("Failed to create Trade Agreement.");
        }
    };


    return (
            <Card className="p-6 shadow-lg rounded-lg">
                <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-10 w-10 text-primary" />
                        Add New Trade Agreement
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                    {/* Agreement Name */}
                    <div className="mb-4">
                        <Label>Agreement Name</Label>
                        <Input
                            type="text"
                            value={tradeAgreement.name}
                            onChange={(e) =>
                                setTradeAgreement({ ...tradeAgreement, name: e.target.value })
                            }
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Agreement Description */}
                    <div className="mb-4">
                        <Label>Description</Label>
                        <Input
                            type="text"
                            value={tradeAgreement.description}
                            onChange={(e) =>
                                setTradeAgreement({ ...tradeAgreement, description: e.target.value })
                            }
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="mb-4">
                        <Label>Start Date</Label>
                        <Input
                            type="date"
                            value={tradeAgreement.startDate}
                            onChange={(e) =>
                                setTradeAgreement({ ...tradeAgreement, startDate: e.target.value })
                            }
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* End Date */}
                    <div className="mb-4">
                        <Label>End Date</Label>
                        <Input
                            type="date"
                            value={tradeAgreement.endDate}
                            onChange={(e) =>
                                setTradeAgreement({ ...tradeAgreement, endDate: e.target.value })
                            }
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Select Countries */}
                    <div className="mb-4">
                        <Label>Countries Involved</Label>
                        <Popover open={openCountrySelect} onOpenChange={setOpenCountrySelect}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-left px-4 py-2 flex justify-between items-center">
                                    {tradeAgreement.countries.length
                                        ? tradeAgreement.countries.join(", ")
                                        : "Select Countries"}
                                    <Search className="ml-2 h-5 w-5 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[420px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search countries..." className="py-2 px-4 border-b" />
                                    <CommandList>
                                        {countries.map((c) => (
                                            <CommandItem
                                                key={c.name}
                                                onSelect={() =>
                                                    setTradeAgreement({
                                                        ...tradeAgreement,
                                                        countries: toggleCountrySelection(c.name),
                                                    })
                                                }
                                                className="p-4 hover:bg-gray-100"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        tradeAgreement.countries.includes(c.name) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {c.name}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Save Trade Agreement Button */}
                    <div className="flex justify-end">
                        <Button size="lg" className="px-8 py-3 bg-blue-500 text-white hover:bg-blue-600" onClick={handleSaveTradeAgreement}>
                            <Plus className="h-5 w-5 mr-2" /> Save Trade Agreement
                        </Button>
                    </div>
                </CardContent>
            </Card>
    );
}
