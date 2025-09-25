"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  // ... add up to 30 countries
];

const HS_CODES = [
  { code: "8471.30", desc: "Portable automatic data processing machines" },
  { code: "8517.12", desc: "Telephones for cellular networks" },
  { code: "8528.72", desc: "Monitors and projectors" },
  { code: "8542.31", desc: "Electronic integrated circuits" },
  { code: "9504.50", desc: "Video game consoles and machines" },
];

export default function AdminTariffDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAdmin");
    if (loggedIn === "true") {
      setIsAuthorized(true);
    } else {
      router.push("/login");
    }
    setCheckedAuth(true);
  }, [router]);

  // ---------------- Default Tariffs ----------------
  const [tariffs, setTariffs] = useState<Record<string, Record<string, number>>>(
    () =>
      Object.fromEntries(
        COUNTRIES.map((c) => [
          c,
          Object.fromEntries(HS_CODES.map((hs) => [hs.code, 0.0])),
        ])
      )
  );

  const [search, setSearch] = useState("");
  const [openCountry, setOpenCountry] = useState<string | null>(null);

  const updateTariff = (country: string, hsCode: string, rate: string) => {
    setTariffs((prev) => ({
      ...prev,
      [country]: { ...prev[country], [hsCode]: parseFloat(rate) || 0 },
    }));
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

  // ---------------- Auth Render Handling ----------------
  if (!checkedAuth) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if (!isAuthorized) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: Tariff Dashboard</h1>

      {/* Default Tariffs with HS Codes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Default Import Tariffs</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search country..."
          className="form-input w-full mb-6 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Accordion Country List */}
<div className="space-y-4">
  {COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  )
    .slice(0, openCountry === "ALL" ? COUNTRIES.length : 5)
    .map((country) => (
      <div
        key={country}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        {/* Country Header */}
        <button
          className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() =>
            setOpenCountry(openCountry === country ? null : country)
          }
        >
          {country}
          <span>{openCountry === country ? "▲" : "▼"}</span>
        </button>

        {/* HS Codes Table */}
        {openCountry === country && (
          <div className="p-4">
            <table className="min-w-full border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                    HS Code
                  </th>
                  <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                    Description
                  </th>
                  <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">
                    Tariff Rate (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {HS_CODES.map((hs) => (
                  <tr
                    key={hs.code}
                    className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-700"
                  >
                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                      {hs.code}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                      {hs.desc}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">
                      <input
                        type="number"
                        value={tariffs[country][hs.code]}
                        onChange={(e) =>
                          updateTariff(country, hs.code, e.target.value)
                        }
                        className="w-24 text-center form-input bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    ))}

  {/* Show More / Show Less Button */}
  {COUNTRIES.length > 5 && (
    <div className="text-center mt-4">
      <button
        onClick={() =>
          setOpenCountry(openCountry === "ALL" ? null : "ALL")
        }
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {openCountry === "ALL" ? "Show Less" : "Show More"}
      </button>
    </div>
  )}
</div>

      </section>

      {/* Special Agreements */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Special Agreements</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <ul className="space-y-2 mb-4">
            {agreements.map((a, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-2"
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
              className="form-dropdown bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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
              className="form-dropdown bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={newAgreement.partner}
              onChange={(e) =>
                setNewAgreement((prev) => ({
                  ...prev,
                  partner: e.target.value,
                }))
              }
            >
              <option value="">Partner</option>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-input bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
          {unions.map((u, idx) => (
            <div
              key={idx}
              className="border border-gray-300 dark:border-gray-600 p-4 rounded"
            >
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
          <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
            <input
              type="text"
              className="form-input mb-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              placeholder="Union Name"
              value={newUnion.name}
              onChange={(e) =>
                setNewUnion((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
              {COUNTRIES.map((c) => (
                <label
                  key={c}
                  className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-1 rounded"
                >
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
              className="form-input mb-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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
