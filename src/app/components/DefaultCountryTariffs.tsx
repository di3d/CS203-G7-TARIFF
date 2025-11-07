"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Globe2, AlertCircle } from "lucide-react";

interface Country {
  countryId?: number;
  name: string;
  isoCode: string;
  region: string;
}

export default function CountriesManager() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCountry, setNewCountry] = useState<Country>({
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

  const handleUpdate = async (country: Country) => {
    if (!country.countryId) return;
    try {
      await fetch(`${API_URL}/${country.countryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(country),
      });
      setEditingId(null);
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
                    <th className="text-left px-4 py-3 text-sm font-medium">
                      ID
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium">
                      ISO Code
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium">
                      Region
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((c) => (
                    <tr
                      key={c.countryId}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      {editingId === c.countryId ? (
                        <>
                          <td className="px-4 py-2">{c.countryId}</td>
                          <td className="px-4 py-2">
                            <Input
                              value={c.name}
                              onChange={(e) =>
                                setCountries((prev) =>
                                  prev.map((x) =>
                                    x.countryId === c.countryId
                                      ? { ...x, name: e.target.value }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              value={c.isoCode}
                              onChange={(e) =>
                                setCountries((prev) =>
                                  prev.map((x) =>
                                    x.countryId === c.countryId
                                      ? { ...x, isoCode: e.target.value }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              value={c.region}
                              onChange={(e) =>
                                setCountries((prev) =>
                                  prev.map((x) =>
                                    x.countryId === c.countryId
                                      ? { ...x, region: e.target.value }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2 flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdate(c)}
                              className="bg-green-600 hover:bg-green-700"
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
                          <td className="px-4 py-2 text-sm">{c.countryId}</td>
                          <td className="px-4 py-2 text-sm">{c.name}</td>
                          <td className="px-4 py-2 text-sm font-mono">
                            {c.isoCode}
                          </td>
                          <td className="px-4 py-2 text-sm">{c.region}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(c.countryId!)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(c.countryId)}
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
