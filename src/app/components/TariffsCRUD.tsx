"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Tariff {
  id?: number;
  countryA: string;
  countryB: string;
  hsCode: string;
  description: string;
  rate: number;
  tariffType: string;
  startDate: string;
  endDate: string;
}

const TariffsCRUD: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTariff, setNewTariff] = useState<Tariff>({
    countryA: "",
    countryB: "",
    hsCode: "",
    description: "",
    rate: 0,
    tariffType: "",
    startDate: "",
    endDate: "",
  });

  const API_URL = "http://localhost:8080/tariffs";

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = () => {
    axios
      .get<Tariff[]>(API_URL)
      .then((res) => setTariffs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreate = () => {
    axios
      .post(API_URL, newTariff)
      .then(() => {
        setNewTariff({
          countryA: "",
          countryB: "",
          hsCode: "",
          description: "",
          rate: 0,
          tariffType: "",
          startDate: "",
          endDate: "",
        });
        fetchTariffs();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdate = (tariff: Tariff) => {
    if (!tariff.id) return;
    axios
      .put(`${API_URL}/${tariff.id}`, tariff)
      .then(() => {
        setEditingId(null);
        fetchTariffs();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => fetchTariffs())
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading tariffs...</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Create Form */}
      <div className="grid grid-cols-4 gap-2">
        <input
          type="text"
          placeholder="Country A"
          value={newTariff.countryA}
          onChange={(e) => setNewTariff({ ...newTariff, countryA: e.target.value })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Country B"
          value={newTariff.countryB}
          onChange={(e) => setNewTariff({ ...newTariff, countryB: e.target.value })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="HS Code"
          value={newTariff.hsCode}
          onChange={(e) => setNewTariff({ ...newTariff, hsCode: e.target.value })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTariff.description}
          onChange={(e) => setNewTariff({ ...newTariff, description: e.target.value })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="number"
          placeholder="Rate"
          value={newTariff.rate}
          onChange={(e) => setNewTariff({ ...newTariff, rate: parseFloat(e.target.value) })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Tariff Type"
          value={newTariff.tariffType}
          onChange={(e) => setNewTariff({ ...newTariff, tariffType: e.target.value })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={newTariff.startDate}
          onChange={(e) => setNewTariff({ ...newTariff, startDate: e.target.value })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="date"
          placeholder="End Date"
          value={newTariff.endDate}
          onChange={(e) => setNewTariff({ ...newTariff, endDate: e.target.value })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={handleCreate}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 col-span-4"
        >
          Add Tariff
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Country A</th>
              <th className="border px-4 py-2">Country B</th>
              <th className="border px-4 py-2">HS Code</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Rate (%)</th>
              <th className="border px-4 py-2">Tariff Type</th>
              <th className="border px-4 py-2">Start Date</th>
              <th className="border px-4 py-2">End Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((t) => (
              <tr key={`${t.countryA}-${t.countryB}-${t.hsCode}`}>
                {editingId === t.id ? (
                  <>
                    <td className="border px-4 py-2">{t.id}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={t.countryA}
                        onChange={(e) =>
                          setTariffs((prev) =>
                            prev.map((row) =>
                              row.id === t.id ? { ...row, countryA: e.target.value } : row
                            )
                          )
                        }
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={t.countryB}
                        onChange={(e) =>
                          setTariffs((prev) =>
                            prev.map((row) =>
                              row.id === t.id ? { ...row, countryB: e.target.value } : row
                            )
                          )
                        }
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={t.hsCode}
                        onChange={(e) =>
                          setTariffs((prev) =>
                            prev.map((row) =>
                              row.id === t.id ? { ...row, hsCode: e.target.value } : row
                            )
                          )
                        }
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={t.description}
                        onChange={(e) =>
                          setTariffs((prev) =>
                            prev.map((row) =>
                              row.id === t.id ? { ...row, description: e.target.value } : row
                            )
                          )
                        }
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={t.rate}
                        onChange={(e) =>
                          setTariffs((prev) =>
                            prev.map((row) =>
                              row.id === t.id ? { ...row, rate: parseFloat(e.target.value) } : row
                            )
                          )
                        }
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={t.tariffType}
                        onChange={(e) =>
                          setTariffs((prev) =>
                            prev.map((row) =>
                              row.id === t.id ? { ...row, tariffType: e.target.value } : row
                            )
                          )
                        }
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="date"
                        value={t.startDate}
                        onChange={(e) =>
                          setTariffs((prev) =>
                            prev.map((row) =>
                              row.id === t.id ? { ...row, startDate: e.target.value } : row
                            )
                          )
                        }
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="date"
                        value={t.endDate}
                        onChange={(e) =>
                          setTariffs((prev) =>
                            prev.map((row) =>
                              row.id === t.id ? { ...row, endDate: e.target.value } : row
                            )
                          )
                        }
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleUpdate(t)}
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2">{t.id}</td>
                    <td className="border px-4 py-2">{t.countryA}</td>
                    <td className="border px-4 py-2">{t.countryB}</td>
                    <td className="border px-4 py-2">{t.hsCode}</td>
                    <td className="border px-4 py-2">{t.description}</td>
                    <td className="border px-4 py-2">{t.rate}</td>
                    <td className="border px-4 py-2">{t.tariffType}</td>
                    <td className="border px-4 py-2">{t.startDate}</td>
                    <td className="border px-4 py-2">{t.endDate}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => setEditingId(t.id!)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TariffsCRUD;
