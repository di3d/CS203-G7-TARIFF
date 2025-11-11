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

    if (!checkedAuth) return <p className="text-center mt-10">Logging in...</p>;
    if (!isAuthorized) return <p className="text-center mt-10">Redirecting to login...</p>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Admin: Tariff Dashboard</h1>
        </div>
    );
}

