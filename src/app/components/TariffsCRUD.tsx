"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Globe2, AlertCircle } from "lucide-react";

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
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchTariffs();
    } catch {
      setError("Failed to delete tariff");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe2 className="h-5 w-5" />
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
                    hsCode: { ...newTariff.hsCode!, description: e.target.value },
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
              <Button
                className="col-span-6 mt-2"
                onClick={handleCreate}
              >
                Add Tariff
              </Button>
            </div>

            {/* Tariffs Table */}
            <div className="rounded-md border overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">HS Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Rate (%)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Effective</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Expiry</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Origins</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Destinations</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tariffs.map((t) => (
                    <tr
                      key={t.tariffId}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      {editingId === t.tariffId ? (
                        <>
                          <td className="px-4 py-2">-</td>
                          <td className="px-4 py-2">
                            <Input
                              value={t.hsCode.hsCode}
                              onChange={(e) =>
                                setTariffs((prev) =>
                                  prev.map((x) =>
                                    x.tariffId === t.tariffId
                                      ? {
                                          ...x,
                                          hsCode: {
                                            ...x.hsCode,
                                            hsCode: e.target.value,
                                          },
                                        }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              value={t.hsCode.description}
                              onChange={(e) =>
                                setTariffs((prev) =>
                                  prev.map((x) =>
                                    x.tariffId === t.tariffId
                                      ? {
                                          ...x,
                                          hsCode: {
                                            ...x.hsCode,
                                            description: e.target.value,
                                          },
                                        }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={t.baseRate}
                              onChange={(e) =>
                                setTariffs((prev) =>
                                  prev.map((x) =>
                                    x.tariffId === t.tariffId
                                      ? {
                                          ...x,
                                          baseRate: parseFloat(e.target.value),
                                        }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              value={t.rateType}
                              onChange={(e) =>
                                setTariffs((prev) =>
                                  prev.map((x) =>
                                    x.tariffId === t.tariffId
                                      ? { ...x, rateType: e.target.value }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="date"
                              value={t.effectiveDate}
                              onChange={(e) =>
                                setTariffs((prev) =>
                                  prev.map((x) =>
                                    x.tariffId === t.tariffId
                                      ? { ...x, effectiveDate: e.target.value }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="date"
                              value={t.expiryDate || ""}
                              onChange={(e) =>
                                setTariffs((prev) =>
                                  prev.map((x) =>
                                    x.tariffId === t.tariffId
                                      ? { ...x, expiryDate: e.target.value }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {t.origins.join(", ")}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {t.destinations.join(", ")}
                          </td>
                          <td className="px-4 py-2 flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleUpdate(t)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 text-sm">{t.tariffId}</td>
                          <td className="px-4 py-2 text-sm font-mono">{t.hsCode.hsCode}</td>
                          <td className="px-4 py-2 text-sm">{t.hsCode.description}</td>
                          <td className="px-4 py-2 text-sm">{t.baseRate}</td>
                          <td className="px-4 py-2 text-sm">{t.rateType}</td>
                          <td className="px-4 py-2 text-sm">{t.effectiveDate}</td>
                          <td className="px-4 py-2 text-sm">{t.expiryDate || "—"}</td>
                          <td className="px-4 py-2 text-sm">
                            -
                          </td>
                          <td className="px-4 py-2 text-sm">
                            -
                          </td>
                          <td className="px-4 py-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(t.tariffId!)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(t.tariffId)}
                            >
                              Delete
                            </Button>
                          </td>
                        </>
                      )}
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
