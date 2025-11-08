"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Cog, AlertCircle } from "lucide-react";

interface Tariff {
  tariffId?: number;
  hsCode: { hsCode: string; description: string };
  baseRate: number;
  rateType: string;
  effectiveDate: string;
  expiryDate: string | null;
  origins: string[];
  destinations: string[];
}

export default function TariffsManager() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTariff, setNewTariff] = useState<Partial<Tariff>>({
    hsCode: { hsCode: "", description: "" },
    baseRate: 0,
    rateType: "",
    effectiveDate: "",
    expiryDate: "",
    origins: [],
    destinations: [],
  });

  const API_URL = "http://localhost:8080/api/tariffs";

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch tariffs");
      const data = await res.json();
      setTariffs(data);
    } catch (err) {
      setError("Unable to load tariffs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTariff),
      });
      setNewTariff({
        hsCode: { hsCode: "", description: "" },
        baseRate: 0,
        rateType: "",
        effectiveDate: "",
        expiryDate: "",
        origins: [],
        destinations: [],
      });
      fetchTariffs();
    } catch {
      setError("Failed to create tariff");
    }
  };

  const handleUpdate = async (tariff: Tariff) => {
    if (!tariff.tariffId) return;
    try {
      await fetch(`${API_URL}/${tariff.tariffId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tariff),
      });
      setEditingId(null);
      fetchTariffs();
    } catch {
      setError("Failed to update tariff");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this tariff?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchTariffs();
    } catch {
      setError("Failed to delete tariff");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRate = (rate?: number) =>
    rate !== undefined && rate !== null ? `${rate.toFixed(2)}%` : "—";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cog className="h-5 w-5" />
          Manage Tariffs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading tariffs...
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive py-4">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Create Form */}
            <div className="grid grid-cols-6 gap-2">
              <Input
                placeholder="HS Code"
                value={newTariff.hsCode?.hsCode || ""}
                onChange={(e) =>
                  setNewTariff({
                    ...newTariff,
                    hsCode: { ...newTariff.hsCode!, hsCode: e.target.value },
                  })
                }
              />
              <Input
                placeholder="Description"
                value={newTariff.hsCode?.description || ""}
                onChange={(e) =>
                  setNewTariff({
                    ...newTariff,
                    hsCode: {
                      ...newTariff.hsCode!,
                      description: e.target.value,
                    },
                  })
                }
              />
              <Input
                type="number"
                placeholder="Base Rate (%)"
                value={newTariff.baseRate || ""}
                onChange={(e) =>
                  setNewTariff({
                    ...newTariff,
                    baseRate: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                placeholder="Rate Type"
                value={newTariff.rateType || ""}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, rateType: e.target.value })
                }
              />
              <Input
                type="date"
                value={newTariff.effectiveDate || ""}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, effectiveDate: e.target.value })
                }
              />
              <Input
                type="date"
                value={newTariff.expiryDate || ""}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, expiryDate: e.target.value })
                }
              />
              <Button className="col-span-6 mt-2" onClick={handleCreate}>
                Add Tariff
              </Button>
            </div>

            {/* Tariffs Table */}
            <div className="rounded-md border overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b text-[11px] text-muted-foreground uppercase tracking-wide">
                    <th className="px-2.5 py-2 text-left font-medium w-[35px]">
                      ID
                    </th>
                    <th className="px-2.5 py-2 text-left font-medium w-[60px]">
                      HS
                    </th>
                    <th className="px-2.5 py-2 text-left font-medium">
                      Description
                    </th>
                    <th className="px-2.5 py-2 text-left font-medium w-[55px]">
                      Rate
                    </th>
                    <th className="px-2.5 py-2 text-left font-medium w-[70px]">
                      Type
                    </th>
                    <th className="px-2.5 py-2 text-left font-medium w-[115px]">
                      Effective
                    </th>
                    <th className="px-2.5 py-2 text-left font-medium w-[70px]">
                      Expiry
                    </th>
                    <th className="px-2.5 py-2 text-left font-medium w-[80px]">
                      Origin
                    </th>
                    <th className="px-2.5 py-2 text-left font-medium w-[95px]">
                      Destination
                    </th>
                    <th className="px-2.5 py-2 text-center font-medium w-[80px]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tariffs.map((t) => (
                    <tr
                      key={t.tariffId}
                      className="border-b last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-2.5 py-1.5">{t.tariffId}</td>
                      <td className="px-2.5 py-1.5 font-mono text-[11px]">
                        {t.hsCode.hsCode}
                      </td>
                      <td className="px-2.5 py-1.5 leading-snug max-w-[200px]">
                        {t.hsCode.description}
                      </td>
                      <td className="px-2.5 py-1.5">
                        {formatRate(t.baseRate)}
                      </td>
                      <td className="px-2.5 py-1.5">{t.rateType}</td>
                      <td className="px-2.5 py-1.5 whitespace-nowrap">
                        {formatDate(t.effectiveDate)}
                      </td>
                      <td className="px-2.5 py-1.5 whitespace-nowrap">
                        {formatDate(t.expiryDate)}
                      </td>
                      <td className="px-2.5 py-1.5">
                        {Array.isArray(t.origins) && t.origins.length > 0
                          ? t.origins.join(", ")
                          : "—"}
                      </td>
                      <td className="px-2.5 py-1.5">
                        {Array.isArray(t.destinations) &&
                        t.destinations.length > 0
                          ? t.destinations.join(", ")
                          : "—"}
                      </td>
                      <td className="px-2.5 py-1.5 text-center align-middle">
                        <div className="flex justify-center items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-[11px]"
                            onClick={() => {
                              console.log("Editing ID:", t.tariffId);
                              if (t.tariffId) setEditingId(t.tariffId);
                              else
                                alert(
                                  "Tariff ID not found — check backend JSON field name."
                                );
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 px-2 text-[11px]"
                            onClick={() => {
                              console.log("Deleting ID:", t.tariffId);
                              if (t.tariffId) handleDelete(t.tariffId);
                              else alert("Tariff ID missing — cannot delete.");
                            }}
                          >
                            Del
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
