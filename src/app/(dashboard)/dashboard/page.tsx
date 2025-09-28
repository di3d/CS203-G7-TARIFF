// src/app/(dashboard)/dashboard/page.tsx
"use client"
import { useEffect, useState } from "react";

type Tariff = {
  id: number;
  hsCode: string;
  description: string;
  rate: number;
};

export default function DashboardPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/tariffs")
      .then(res => res.json())
      .then(data => setTariffs(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/*yan's testing random sql stuff here, DONT DELETE*/}
      <div className="bg-black rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold">Tariffs in Effect</h1>
        <table className="min-w-full border  dark:border-gray-700 overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left border-b  dark:border-gray-700 text-gray-700 dark:text-gray-200">
                HS Code
              </th>
              <th className="px-4 py-2 text-left border-b  dark:border-gray-700 text-gray-700 dark:text-gray-200">
                Description
              </th>
              <th className="px-4 py-2 text-left border-b  dark:border-gray-700 text-gray-700 dark:text-gray-200">
                Rate (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-2 border-b  dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {t.hsCode}
                </td>
                <td className="px-4 py-2 border-b  dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {t.description}
                </td>
                <td className="px-4 py-2 border-b  dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {t.rate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
