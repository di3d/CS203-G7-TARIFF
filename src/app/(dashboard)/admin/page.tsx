"use client";

import { useState } from "react";

// Mock country list (same as calculator page)
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

export default function AdminTariffPage() {
  const [formData, setFormData] = useState({
    originCountry: "",
    exportCountry: "",
    tariffRate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.originCountry || !formData.exportCountry || !formData.tariffRate) {
      alert("Please fill in all required fields");
      return;
    }

    // TODO: Replace this with API call to save new tariff
    console.log("Updated tariff:", formData);
    alert(
      `Tariff updated:\n${formData.originCountry} → ${formData.exportCountry} = ${formData.tariffRate}%`
    );

    // Reset form
    setFormData({ originCountry: "", exportCountry: "", tariffRate: "" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin: Adjust Tariff Rates</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin country */}
          <div>
            <label htmlFor="originCountry" className="form-label">
              Country of Origin
            </label>
            <select
              id="originCountry"
              name="originCountry"
              value={formData.originCountry}
              onChange={handleInputChange}
              className="form-dropdown"
              required
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Export country */}
          <div>
            <label htmlFor="exportCountry" className="form-label">
              Country of Export
            </label>
            <select
              id="exportCountry"
              name="exportCountry"
              value={formData.exportCountry}
              onChange={handleInputChange}
              className="form-dropdown"
              required
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Tariff rate */}
          <div className="md:col-span-2">
            <label htmlFor="tariffRate" className="form-label">
              Tariff Rate (%)
            </label>
            <input
              type="number"
              id="tariffRate"
              name="tariffRate"
              value={formData.tariffRate}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="e.g., 5.50"
              className="form-input"
              required
            />
            <p className="form-text mt-2">
              Enter the tariff percentage (e.g., 5.50 for 5.5%)
            </p>
          </div>
        </div>

        {/* Save */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Save Tariff
          </button>
        </div>
      </form>
    </div>
  );
}
