"use client";
//npm run dev
import { useState } from "react";

const COUNTRIES = [
  "Singapore 🇸🇬",
  "United States 🇺🇸",
  "China 🇨🇳",
  "Germany 🇩🇪",
  "Japan 🇯🇵",
  "South Korea 🇰🇷",
  "Vietnam 🇻🇳",
  "Mexico 🇲🇽",
  "Canada 🇨🇦",
  "Taiwan 🇹🇼",
  "Malaysia 🇲🇾",
];

export default function AdminTariffDashboard() {
  // ---------------- Default Tariffs ----------------
  const [defaultTariffs, setDefaultTariffs] = useState<Record<string, number>>({
    "Singapore 🇸🇬": 3.0,
    "United States 🇺🇸": 5.0,
    "China 🇨🇳": 7.0,
  });

  const [newDefault, setNewDefault] = useState({ country: "", rate: "" });
  const [search, setSearch] = useState("");

  const addDefaultTariff = () => {
    if (!newDefault.country || !newDefault.rate) {
      alert("Please select a country and enter a rate.");
      return;
    }
    setDefaultTariffs((prev) => ({
      ...prev,
      [newDefault.country]: parseFloat(newDefault.rate),
    }));
    setNewDefault({ country: "", rate: "" });
  };

  const deleteDefaultTariff = (country: string) => {
    if (window.confirm(`Are you sure you want to delete tariff for ${country}?`)) {
      setDefaultTariffs((prev) => {
        const copy = { ...prev };
        delete copy[country];
        return copy;
      });
    }
  };

  // ---------------- Special Agreements ----------------
  const [agreements, setAgreements] = useState([
    { origin: "Singapore 🇸🇬", partner: "China 🇨🇳", rate: 1.0 },
  ]);

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

  // ---------------- Trade Unions ----------------
  const [unions, setUnions] = useState([
    {
      name: "ASEAN Union",
      countries: ["Singapore 🇸🇬", "Vietnam 🇻🇳", "Malaysia 🇲🇾"],
      tariff: 0.0,
    },
  ]);

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

  // ---------------- Render ----------------
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin: Tariff Dashboard</h1>

      {/* Default Tariffs */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Default Import Tariffs</h2>
        <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          {/* Search */}
          <input
            type="text"
            className="form-input mb-4"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table className="min-w-full border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Country</th>
                <th className="px-4 py-2 border">Rate (%)</th>
                <th className="px-4 py-2 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(defaultTariffs)
                .filter(([country]) =>
                  country.toLowerCase().includes(search.toLowerCase())
                )
                .map(([country, rate]) => (
                  <tr key={country}>
                    <td className="px-4 py-2 border">{country}</td>
                    <td className="px-4 py-2 border">{rate.toFixed(2)}%</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        onClick={() => deleteDefaultTariff(country)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Add Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <select
              className="form-dropdown"
              value={newDefault.country}
              onChange={(e) =>
                setNewDefault((prev) => ({ ...prev, country: e.target.value }))
              }
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-input"
              placeholder="Rate %"
              value={newDefault.rate}
              onChange={(e) =>
                setNewDefault((prev) => ({ ...prev, rate: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={addDefaultTariff}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Special Agreements */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Special Agreements</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <ul className="space-y-2 mb-4">
            {agreements.map((a, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {a.origin} ↔ {a.partner} :{" "}
                  <strong>{a.rate.toFixed(2)}%</strong>
                </span>
                <div className="flex justify-center">
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => deleteAgreement(idx)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Add Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <select
              className="form-dropdown"
              value={newAgreement.origin}
              onChange={(e) =>
                setNewAgreement((prev) => ({ ...prev, origin: e.target.value }))
              }
            >
              <option value="">Origin</option>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              className="form-dropdown"
              value={newAgreement.partner}
              onChange={(e) =>
                setNewAgreement((prev) => ({ ...prev, partner: e.target.value }))
              }
            >
              <option value="">Partner</option>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-input"
              placeholder="Rate %"
              value={newAgreement.rate}
              onChange={(e) =>
                setNewAgreement((prev) => ({ ...prev, rate: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={addAgreement}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Trade Unions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Trade Unions</h2>
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          {unions.map((u, idx) => (
            <div key={idx} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{u.name}</h3>
                  <p>Countries: {u.countries.join(", ")}</p>
                  <p>
                    Internal Tariff: <strong>{u.tariff.toFixed(2)}%</strong>
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => deleteUnion(idx)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Union */}
          <div className="border-t pt-4">
            <input
              type="text"
              className="form-input mb-2"
              placeholder="Union Name"
              value={newUnion.name}
              onChange={(e) =>
                setNewUnion((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
              {COUNTRIES.map((c) => (
                <label key={c} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newUnion.selectedCountries.includes(c)}
                    onChange={() => toggleUnionCountry(c)}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
            <input
              type="number"
              className="form-input mb-2"
              placeholder="Tariff %"
              value={newUnion.tariff}
              onChange={(e) =>
                setNewUnion((prev) => ({ ...prev, tariff: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={addUnion}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Add Union
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
