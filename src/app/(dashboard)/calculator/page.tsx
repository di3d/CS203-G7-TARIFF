"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/app/components/ui/command";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/app/components/ui/popover";
import { Calculator, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface HSCode {
    hsCode: string;
    description: string;
}

interface Country {
    id: number;
    name: string;
}

const CURRENCIES = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "SGD", name: "Singapore Dollar" },
];

export default function CalculatorPage() {
    const router = useRouter();
    const [commodities, setCommodities] = useState<HSCode[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [openHS, setOpenHS] = useState(false);
    const [openCurrency, setOpenCurrency] = useState(false);
    const [openOrigin, setOpenOrigin] = useState(false);
    const [openImporting, setOpenImporting] = useState(false);

    const [formData, setFormData] = useState({
        hsCode: "",
        commodityDescription: "",
        shipmentValue: "1000",
        originCountry: "",
        importingCountry: "",
        date: new Date().toISOString().split("T")[0],
        currency: "USD",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hsCodesRes, countriesRes] = await Promise.all([
                    api.get("/hscodes"),
                    api.get("/countries"),
                ]);
                setCommodities(hsCodesRes.data);
                setCountries(countriesRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleSelectChange = (name: string, value: string) => {
        if (name === "hsCode") {
            const commodity = commodities.find((c) => c.hsCode === value);
            setFormData((prev) => ({
                ...prev,
                hsCode: value,
                commodityDescription: commodity ? commodity.description : "",
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {
            hsCode,
            shipmentValue,
            originCountry,
            importingCountry,
            date,
            currency,
        } = formData;

        if (
            !hsCode ||
            !shipmentValue ||
            !originCountry ||
            !importingCountry ||
            !date ||
            !currency
        ) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            const res = await api.post("/calculate", {
                hsCode,
                commodityDescription: formData.commodityDescription,
                shipmentValue: parseFloat(shipmentValue),
                originCountry,
                importingCountry,
                date,
                currency,
            });

            sessionStorage.setItem("calculationResult", JSON.stringify(res.data));
            router.push("/calculator/results");
        } catch (err) {
            console.error("Error calculating tariff:", err);
            alert("Failed to calculate tariff. Please try again.");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Calculator</h1>
                <p className="text-muted-foreground">
                    Calculate tariffs and import duties
                </p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Calculator className="h-5 w-5 text-primary" />
                        Calculate Tariff
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* HS Code Searchable Combobox */}
                        <div>
                            <Label htmlFor="hsCode">HS Code</Label>
                            <Popover open={openHS} onOpenChange={setOpenHS}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "bg-transparent",
                                            "hover:bg-transparent",
                                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                            "w-full justify-between h-11 text-left font-normal",
                                            !formData.hsCode
                                                ? "text-muted-foreground hover:text-muted-foreground"
                                                : "text-foreground hover:text-foreground"
                                        )}
                                    >
                                        {formData.hsCode || "Select HS Code"}
                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[420px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search HS codes..." />
                                        <CommandList>
                                            <CommandEmpty>No HS codes found.</CommandEmpty>
                                            <CommandGroup>
                                                {commodities.map((item) => (
                                                    <CommandItem
                                                        key={item.hsCode}
                                                        value={item.hsCode}
                                                        onSelect={() => {
                                                            handleSelectChange("hsCode", item.hsCode);
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
                            <div className="min-h-[20px] pl-1">
                                <p className="text-sm text-muted-foreground">
                                    {formData.commodityDescription}
                                </p>
                            </div>
                        </div>

                        {/* Two-column grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipment Value */}
                            <div className="space-y-2">
                                <Label htmlFor="shipmentValue">Shipment Value</Label>
                                <Input
                                    type="number"
                                    id="shipmentValue"
                                    name="shipmentValue"
                                    value={formData.shipmentValue}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="h-11"
                                    required
                                />
                            </div>

                            {/* Currency */}
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "bg-transparent",
                                                "hover:bg-transparent",
                                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                                "w-full justify-between h-11 text-left font-normal",
                                                !formData.currency
                                                    ? "text-muted-foreground hover:text-muted-foreground"
                                                    : "text-foreground hover:text-foreground"
                                            )}
                                        >
                                            {formData.currency
                                                ? CURRENCIES.find((c) => c.code === formData.currency)
                                                    ?.code || "Select currency"
                                                : "Select currency"}
                                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[420px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search currencies..." />
                                            <CommandList>
                                                <CommandEmpty>No currencies found.</CommandEmpty>
                                                <CommandGroup>
                                                    {CURRENCIES.map((curr) => (
                                                        <CommandItem
                                                            key={curr.code}
                                                            value={curr.code}
                                                            onSelect={() => {
                                                                handleSelectChange("currency", curr.code);
                                                                setOpenCurrency(false);
                                                            }}
                                                        >
                                                            <div className="flex flex-col text-left">
                                                                <span className="font-medium">{curr.code}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {curr.name}
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

                            {/* Origin Country */}
                            <div className="space-y-2">
                                <Label htmlFor="originCountry">Country of Origin</Label>
                                <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "bg-transparent",
                                                "hover:bg-transparent",
                                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                                "w-full justify-between h-11 text-left font-normal",
                                                !formData.originCountry
                                                    ? "text-muted-foreground hover:text-muted-foreground"
                                                    : "text-foreground hover:text-foreground"
                                            )}
                                        >
                                            {formData.originCountry || "Select country"}
                                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[420px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search countries..." />
                                            <CommandList>
                                                <CommandEmpty>No countries found.</CommandEmpty>
                                                <CommandGroup>
                                                    {countries.map((country) => (
                                                        <CommandItem
                                                            key={country.id}
                                                            value={country.name}
                                                            onSelect={() => {
                                                                handleSelectChange(
                                                                    "originCountry",
                                                                    country.name
                                                                );
                                                                setOpenOrigin(false);
                                                            }}
                                                        >
                                                            {country.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Importing Country */}
                            <div className="space-y-2">
                                <Label htmlFor="importingCountry">Importing Country</Label>
                                <Popover open={openImporting} onOpenChange={setOpenImporting}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "bg-transparent",
                                                "hover:bg-transparent",
                                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                                "w-full justify-between h-11 text-left font-normal",
                                                !formData.importingCountry
                                                    ? "text-muted-foreground hover:text-muted-foreground"
                                                    : "text-foreground hover:text-foreground"
                                            )}
                                        >
                                            {formData.importingCountry || "Select country"}
                                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[420px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search countries..." />
                                            <CommandList>
                                                <CommandEmpty>No countries found.</CommandEmpty>
                                                <CommandGroup>
                                                    {countries.map((country) => (
                                                        <CommandItem
                                                            key={country.id}
                                                            value={country.name}
                                                            onSelect={() => {
                                                                handleSelectChange(
                                                                    "importingCountry",
                                                                    country.name
                                                                );
                                                                setOpenImporting(false);
                                                            }}
                                                        >
                                                            {country.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button size="lg" className="px-8">
                                Calculate Tariff
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
