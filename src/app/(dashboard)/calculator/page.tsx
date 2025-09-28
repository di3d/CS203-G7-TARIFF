"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock data
const COMMODITIES = [
  {
    htsCode: "8471.30",
    description: "Portable automatic data processing machines",
  },
  { htsCode: "8517.12", description: "Telephones for cellular networks" },
  { htsCode: "8528.72", description: "Monitors and projectors" },
  { htsCode: "8542.31", description: "Electronic integrated circuits" },
  { htsCode: "9504.50", description: "Video game consoles and machines" },
];

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

const TRANSPORT_MODES = ["Air", "Sea", "Road", "Rail"];

export default function CalculatorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    htsCode: "",
    commodityDescription: "",
    shipmentValue: "1000",
    originCountry: "",
    exportCountry: "",
    transportMode: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "htsCode") {
      // Show commodity description for valid HTS code
      const commodity = COMMODITIES.find((item) => item.htsCode === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        commodityDescription: commodity ? commodity.description : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.htsCode ||
      !formData.shipmentValue ||
      !formData.originCountry ||
      !formData.exportCountry ||
      !formData.transportMode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Navigate to results page with form parameters
    const queryParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    router.push(`/calculator/results?${queryParams.toString()}`);
  };

  // Inline style for dropdown arrow
  const dropdownArrowStyle = {
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg fill='none' stroke='%23666' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1rem",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tariff Calculator</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HTS code */}
          <div className="md:col-span-2">
            <label htmlFor="htsCode" className="block text-base font-bold text-gray-800 mb-1">
              HTS Code
            </label>
            <input
              type="text"
              id="htsCode"
              name="htsCode"
              placeholder="8471.30"
              value={formData.htsCode}
              onChange={handleInputChange}
              list="htsCodes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <datalist id="htsCodes">
              {COMMODITIES.map((item) => (
                <option key={item.htsCode} value={item.htsCode}>
                  {item.description}
                </option>
              ))}
            </datalist>
            {formData.commodityDescription && (
              <p className="text-gray-700 mt-2">
                Commodity Description: {formData.commodityDescription}
              </p>
            )}
          </div>

          {/* Shipment value */}
          <div>
            <label htmlFor="shipmentValue" className="block text-base font-bold text-gray-800 mb-1">
              Shipment Value (USD)
            </label>
            <input
              type="number"
              id="shipmentValue"
              name="shipmentValue"
              value={formData.shipmentValue}
              onChange={handleInputChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Mode of transport */}
          <div>
            <label htmlFor="transportMode" className="block text-base font-bold text-gray-800 mb-1">
              Mode of Transport
            </label>
            <select
              id="transportMode"
              name="transportMode"
              value={formData.transportMode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              style={dropdownArrowStyle}
              required
            >
              <option value="">Select a mode</option>
              {TRANSPORT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Origin country */}
          <div>
            <label htmlFor="originCountry" className="block text-base font-bold text-gray-800 mb-1">
              Country of Origin
            </label>
            <select
              id="originCountry"
              name="originCountry"
              value={formData.originCountry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              style={dropdownArrowStyle}
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
            <label htmlFor="exportCountry" className="block text-base font-bold text-gray-800 mb-1">
              Country of Export
            </label>
            <select
              id="exportCountry"
              name="exportCountry"
              value={formData.exportCountry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              style={dropdownArrowStyle}
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
        </div>

        {/* Calculate */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Calculate
          </button>
        </div>
      </form>
    </div>
  );
}
