"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Globe2, AlertCircle } from "lucide-react";

interface Country {
  id: number;
  name: string;
  isoCode: string;
  region: string;
  tariffRate?: number;
}

export default function CountriesManager() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Country | null>(null);
  const [newCountry, setNewCountry] = useState({
    name: "",
    isoCode: "",
    region: "",
  });

  const API_URL = "http://localhost:8080/api/countries";

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      setError("Unable to load countries");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCountry),
      });
      setNewCountry({ name: "", isoCode: "", region: "" });
      fetchCountries();
    } catch {
      setError("Failed to create country");
    }
  };

  const handleEdit = (c: Country) => {
    setEditingId(c.id);
    setEditDraft({ ...c }); // take snapshot
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const handleUpdate = async () => {
    if (!editDraft) return;
    try {
      await fetch(`${API_URL}/${editDraft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });
      setEditingId(null);
      setEditDraft(null);
      fetchCountries();
    } catch {
      setError("Failed to update country");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchCountries();
    } catch {
      setError("Failed to delete country");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe2 className="h-5 w-5" />
          Manage Countries
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading countries...
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive py-4">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Create form */}
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                placeholder="Country name"
                value={newCountry.name}
                onChange={(e) =>
                  setNewCountry({ ...newCountry, name: e.target.value })
                }
                className="max-w-[200px]"
              />
              <Input
                placeholder="ISO code (e.g. SG)"
                value={newCountry.isoCode}
                onChange={(e) =>
                  setNewCountry({ ...newCountry, isoCode: e.target.value })
                }
                className="max-w-[150px]"
              />
              <Input
                placeholder="Region (e.g. Asia)"
                value={newCountry.region}
                onChange={(e) =>
                  setNewCountry({ ...newCountry, region: e.target.value })
                }
                className="max-w-[200px]"
              />
              <Button onClick={handleCreate}>Add Country</Button>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-4 py-3 text-sm font-medium">ID</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">ISO Code</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Region</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      {editingId === c.id ? (
                        <>
                          <td className="px-4 py-2">{c.id}</td>
                          <td className="px-4 py-2">
                            <Input
                              value={editDraft?.name || ""}
                              onChange={(e) =>
                                setEditDraft((prev) =>
                                  prev ? { ...prev, name: e.target.value } : prev
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              value={editDraft?.isoCode || ""}
                              onChange={(e) =>
                                setEditDraft((prev) =>
                                  prev
                                    ? { ...prev, isoCode: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              value={editDraft?.region || ""}
                              onChange={(e) =>
                                setEditDraft((prev) =>
                                  prev ? { ...prev, region: e.target.value } : prev
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2 flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={handleUpdate}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 text-sm">{c.id}</td>
                          <td className="px-4 py-2 text-sm">{c.name}</td>
                          <td className="px-4 py-2 text-sm font-mono">{c.isoCode}</td>
                          <td className="px-4 py-2 text-sm">{c.region}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(c)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(c.id)}
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
