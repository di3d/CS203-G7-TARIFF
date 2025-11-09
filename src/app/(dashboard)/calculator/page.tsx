"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/Map/ui/card";
import { Input } from "@/app/components/Map/ui/input";
import { Label } from "@/app/components/Map/ui/label";
import { Button } from "@/app/components/Map/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/Map/ui/select";
import { Calculator } from "lucide-react";

interface HSCode {
    hsCode: string;
    description: string;
}

interface Country {
    id: number;
    name: string;
    isoCode?: string;
    region?: string;
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
        const { hsCode, shipmentValue, originCountry, importingCountry, date, currency } =
            formData;

        if (!hsCode || !shipmentValue || !originCountry || !importingCountry || !date || !currency) {
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
                        {/* HS Code */}
                        <div className="space-y-2">
                            <Label htmlFor="hsCode">HS Code</Label>
                            <Select
                                value={formData.hsCode}
                                onValueChange={(value) => handleSelectChange("hsCode", value)}
                            >
                                <SelectTrigger className="h-11 justify-between">
                                    <SelectValue
                                        placeholder="Select an HS Code"
                                        className="text-left"
                                    />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {commodities.map((item) => (
                                        <SelectItem key={item.hsCode} value={item.hsCode}>
                                            <div className="flex flex-col text-left">
                                                <span className="font-medium">{item.hsCode}</span>
                                                <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formData.commodityDescription && (
                                <p className="text-sm text-muted-foreground pl-1">
                                    {formData.commodityDescription}
                                </p>
                            )}
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
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) => handleSelectChange("currency", value)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CURRENCIES.map((curr) => (
                                            <SelectItem key={curr.code} value={curr.code}>
                                                {curr.code} — {curr.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Origin Country */}
                            <div className="space-y-2">
                                <Label htmlFor="originCountry">Country of Origin</Label>
                                <Select
                                    value={formData.originCountry}
                                    onValueChange={(value) =>
                                        handleSelectChange("originCountry", value)
                                    }
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.name}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Importing Country */}
                            <div className="space-y-2">
                                <Label htmlFor="importingCountry">Importing Country</Label>
                                <Select
                                    value={formData.importingCountry}
                                    onValueChange={(value) =>
                                        handleSelectChange("importingCountry", value)
                                    }
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.name}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
