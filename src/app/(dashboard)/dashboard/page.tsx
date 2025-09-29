// src/app/(dashboard)/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";

type Tariff = {
  id: number;
  countryA: string;
  countryB: string;
  hsCode: string;
  rate: number;
  tariffType: string;
  startDate: string;
  endDate: string;
};

export default function DashboardPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/tariffs")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTariffs(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching tariffs:", err);
        setError("Failed to load tariffs. Please check backend connection.");
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="bg-black rounded-lg shadow-md p-6 mt-4">
        <h1 className="text-xl font-bold text-white">Tariffs in Effect</h1>

        {error ? (
          <p className="text-red-500 mt-2">{error}</p>
        ) : (
          <table className="min-w-full border dark:border-gray-700 overflow-hidden mt-4">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 border-b dark:border-gray-700 text-gray-200">
                  Country A
                </th>
                <th className="px-4 py-2 border-b dark:border-gray-700 text-gray-200">
                  Country B
                </th>
                <th className="px-4 py-2 border-b dark:border-gray-700 text-gray-200">
                  HS Code
                </th>
                <th className="px-4 py-2 border-b dark:border-gray-700 text-gray-200">
                  Rate (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((t, index) => (
                <tr
                  key={`${t.countryA}-${t.countryB}-${t.hsCode}-${index}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-2 border-b dark:border-gray-700 text-gray-100">
                    {t.countryA}
                  </td>
                  <td className="px-4 py-2 border-b dark:border-gray-700 text-gray-100">
                    {t.countryB}
                  </td>
                  <td className="px-4 py-2 border-b dark:border-gray-700 text-gray-100">
                    {t.hsCode}
                  </td>
                  <td className="px-4 py-2 border-b dark:border-gray-700 text-gray-100">
                    {t.rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
