"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Country {
  id?: number;
  name: string;
  tariffRate: number;
}

const CountriesCRUD: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCountry, setNewCountry] = useState<Country>({
    name: "",
    tariffRate: 0,
  });

  const API_URL = "http://localhost:8080/countries";

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    axios
      .get<Country[]>(API_URL)
      .then((res) => setCountries(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreate = () => {
    axios
      .post(API_URL, newCountry)
      .then(() => {
        setNewCountry({ name: "", tariffRate: 0 });
        fetchCountries();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdate = (country: Country) => {
    if (!country.id) return;
    axios
      .put(`${API_URL}/${country.id}`, country)
      .then(() => {
        setEditingId(null);
        fetchCountries();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => fetchCountries())
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading countries...</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Create Form */}
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          placeholder="Country name"
          value={newCountry.name}
          onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="number"
          placeholder="Tariff Rate"
          value={newCountry.tariffRate}
          onChange={(e) =>
            setNewCountry({ ...newCountry, tariffRate: parseFloat(e.target.value) })
          }
          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={handleCreate}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Country
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-900">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Tariff Rate (%)</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr key={c.id}>
              {editingId === c.id ? (
                <>
                  <td className="border px-4 py-2">{c.id}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) =>
                        setCountries((prev) =>
                          prev.map((row) =>
                            row.id === c.id ? { ...row, name: e.target.value } : row
                          )
                        )
                      }
                      className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={c.tariffRate}
                      onChange={(e) =>
                        setCountries((prev) =>
                          prev.map((row) =>
                            row.id === c.id
                              ? { ...row, tariffRate: parseFloat(e.target.value) }
                              : row
                          )
                        )
                      }
                      className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleUpdate(c)}
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
                  <td className="border px-4 py-2">{c.id}</td>
                  <td className="border px-4 py-2">{c.name}</td>
                  <td className="border px-4 py-2">{c.tariffRate}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => setEditingId(c.id!)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
  );
};

export default CountriesCRUD;
