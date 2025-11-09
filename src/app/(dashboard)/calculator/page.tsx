"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "hsCode") {
            const commodity = commodities.find((item) => item.hsCode === value);
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                commodityDescription: commodity ? commodity.description : "",
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.hsCode ||
            !formData.shipmentValue ||
            !formData.originCountry ||
            !formData.importingCountry ||
            !formData.date ||
            !formData.currency
        ) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            const res = await api.post("/calculate", {
                hsCode: formData.hsCode,
                commodityDescription: formData.commodityDescription,
                shipmentValue: parseFloat(formData.shipmentValue),
                originCountry: formData.originCountry,
                importingCountry: formData.importingCountry,
                date: formData.date,
                currency: formData.currency,
            });

            sessionStorage.setItem("calculationResult", JSON.stringify(res.data));
            router.push("/calculator/results");
        } catch (err) {
            console.error("Error calculating tariff:", err);
            alert("Failed to calculate tariff. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Calculator</h1>
                <p className="text-muted-foreground">
                    Calculate tariffs and import duties
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Calculate Tariff
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* HS Code */}
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="hsCode">HS Code</Label>
                                <Input
                                    type="text"
                                    id="hsCode"
                                    name="hsCode"
                                    placeholder="8471.30"
                                    value={formData.hsCode}
                                    onChange={handleInputChange}
                                    list="hsCodes"
                                    required
                                />
                                <datalist id="hsCodes">
                                    {commodities.map((item) => (
                                        <option key={item.hsCode} value={item.hsCode}>
                                            {item.description}
                                        </option>
                                    ))}
                                </datalist>
                                {formData.commodityDescription && (
                                    <p className="text-sm text-muted-foreground">
                                        {formData.commodityDescription}
                                    </p>
                                )}
                            </div>

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
                                    step="1"
                                    required
                                />
                            </div>

                            {/* Currency */}
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) =>
                                        handleSelectChange("currency", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CURRENCIES.map((curr) => (
                                            <SelectItem key={curr.code} value={curr.code}>
                                                {curr.code} - {curr.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Country of Origin */}
                            <div className="space-y-2">
                                <Label htmlFor="originCountry">Country of Origin</Label>
                                <Select
                                    value={formData.originCountry}
                                    onValueChange={(value) =>
                                        handleSelectChange("originCountry", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.name}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date */}
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button variant="default" size="lg">
                                Calculate Tariff
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
