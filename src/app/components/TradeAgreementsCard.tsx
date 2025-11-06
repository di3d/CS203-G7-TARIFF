"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

interface TradeAgreement {
  agreementId: number;
  name: string;
  description: string;
  effectiveDate: string;
  expiryDate: string | null;
}

export default function TradeAgreementsCard() {
  const [agreements, setAgreements] = useState<TradeAgreement[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/trade-agreements");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAgreements(data);
      } catch {
        setError("Failed to fetch trade agreements");
      } finally {
        setLoading(false);
      }
    };
    fetchAgreements();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Trade Agreements</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading trade agreements...
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive py-4">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Effective Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {agreements.map((a) => (
                  <tr
                    key={a.agreementId}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">{a.agreementId}</td>
                    <td className="px-4 py-3 text-sm font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {a.description}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(a.effectiveDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {a.expiryDate
                        ? new Date(a.expiryDate).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
                {agreements.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 text-sm text-muted-foreground"
                    >
                      No trade agreements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
