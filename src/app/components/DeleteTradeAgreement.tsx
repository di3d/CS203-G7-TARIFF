"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {Cross} from "lucide-react";

export default function DeleteTradeAgreement() {
    const [tradeAgreements, setTradeAgreements] = useState([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch trade agreements on component mount
    useEffect(() => {
        const fetchTradeAgreements = async () => {
            try {
                const response = await api.get("/trade-agreements");
                setTradeAgreements(response.data);
            } catch (err) {
                setError("Failed to load trade agreements.");
            }
        };

        fetchTradeAgreements();
    }, []);

    // Delete trade agreement
    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/trade-agreements/${id}`);
            setTradeAgreements(tradeAgreements.filter((ta: { agreementId: number }) => ta.agreementId !== id));
            toast.success("Trade Agreement deleted successfully.");
        } catch (err) {
            setError("Failed to delete trade agreement.");
            toast.error("Failed to delete trade agreement.");
        }
    };

    return (
        <Card className="p-6 shadow-lg rounded-lg">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Cross className="h-10 w-10 text-primary" />
                    Delete Trade Agreement
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
                {error && <div className="mb-4 text-red-500">{error}</div>}

                <div className="space-y-4">
                    {tradeAgreements.length === 0 ? (
                        <div>No trade agreements found.</div>
                    ) : (
                        tradeAgreements.map((ta: { agreementId: number; name: string }) => (
                            <div key={ta.agreementId} className="flex justify-between items-center border-b py-2">
                                <span>{ta.name}</span>
                                <Button
                                    onClick={() => handleDelete(ta.agreementId)}
                                    variant="outline"
                                    className="h-8 px-4 text-red-600 border-red-600 hover:bg-red-100"
                                >
                                    Delete
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
