"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminTariffDashboard() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }
            try {
                const res = await api.get("/users/verify", {
                    headers: { Authorization: token },
                });
                if (res.data.role === "Admin") setIsAuthorized(true);
                else router.push("/login");
            } catch {
                router.push("/login");
            } finally {
                setCheckedAuth(true);
            }
        };
        checkAuth();
    }, [router]);

    const [tariffs, setTariffs] = useState<Record<string, Record<string, number>>>({});
    const [search, setSearch] = useState("");
    const [openCountry, setOpenCountry] = useState<string | null>(null);

    const updateTariff = (country: string, hsCode: string, rate: string) => {
        setTariffs((prev) => ({
            ...prev,
            [country]: { ...prev[country], [hsCode]: parseFloat(rate) || 0 },
        }));
    };

    const [agreements, setAgreements] = useState<
        { origin: string; partner: string; rate: number }[]
    >([]);
    const [newAgreement, setNewAgreement] = useState({
        origin: "",
        partner: "",
        rate: "",
    });

    const addAgreement = () => {
        if (!newAgreement.origin || !newAgreement.partner || !newAgreement.rate) {
            alert("Please fill all fields.");
            return;
        }
        setAgreements((prev) => [
            ...prev,
            {
                origin: newAgreement.origin,
                partner: newAgreement.partner,
                rate: parseFloat(newAgreement.rate),
            },
        ]);
        setNewAgreement({ origin: "", partner: "", rate: "" });
    };

    const deleteAgreement = (idx: number) => {
        if (window.confirm("Are you sure you want to delete this agreement?")) {
            setAgreements((prev) => prev.filter((_, i) => i !== idx));
        }
    };

    const [unions, setUnions] = useState<
        { name: string; countries: string[]; tariff: number }[]
    >([]);
    const [newUnion, setNewUnion] = useState({
        name: "",
        selectedCountries: [] as string[],
        tariff: "",
    });

    const toggleUnionCountry = (country: string) => {
        setNewUnion((prev) => ({
            ...prev,
            selectedCountries: prev.selectedCountries.includes(country)
                ? prev.selectedCountries.filter((c) => c !== country)
                : [...prev.selectedCountries, country],
        }));
    };

    const addUnion = () => {
        if (!newUnion.name || !newUnion.tariff || newUnion.selectedCountries.length < 2) {
            alert("Please enter a union name, tariff rate, and select at least 2 countries.");
            return;
        }
        setUnions((prev) => [
            ...prev,
            {
                name: newUnion.name,
                countries: newUnion.selectedCountries,
                tariff: parseFloat(newUnion.tariff),
            },
        ]);
        setNewUnion({ name: "", selectedCountries: [], tariff: "" });
    };

    const deleteUnion = (idx: number) => {
        if (window.confirm("Are you sure you want to delete this union?")) {
            setUnions((prev) => prev.filter((_, i) => i !== idx));
        }
    };

    if (!checkedAuth) return <p className="text-center mt-10">Logging in...</p>;
    if (!isAuthorized) return <p className="text-center mt-10">Redirecting to login...</p>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Admin: Tariff Dashboard</h1>
        </div>
    );
}
