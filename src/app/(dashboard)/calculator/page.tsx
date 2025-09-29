"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// API data structure
interface HSCode {
  id: number;
  code: string;
  description: string;
}

interface Country {
  id: number;
  name: string;
  tariff_rate: number;
}

export default function CalculatorPage() {
  const router = useRouter();
  const [commodities, setCommodities] = useState<HSCode[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState({
    hsCode: "", // Changed from hsCode
    commodityDescription: "",
    shipmentValue: "1000",
    originCountry: "",
    importingCountry: "",
    transportMode: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hsCodesResponse, countriesResponse] = await Promise.all([
          axios.get("http://localhost:8080/hscodes"),
          axios.get("http://localhost:8080/countries"),
        ]);
        setCommodities(hsCodesResponse.data);
        setCountries(countriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "hsCode") {
      const commodity = commodities.find((item) => item.code === value);
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
      !formData.hsCode ||
      !formData.shipmentValue ||
      !formData.originCountry ||
      !formData.importingCountry ||
      !formData.transportMode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Navigate to results page with form params
    const queryParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    router.push(`/calculator/results?${queryParams.toString()}`);
  };

  // Custom style for dropdown arrow
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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HS Code */}
          <div className="md:col-span-2">
            <label
              htmlFor="hsCode"
              className="block text-base font-bold text-gray-800 mb-1"
            >
              HS Code
            </label>
            <input
              type="text"
              id="hsCode"
              name="hsCode"
              placeholder="8471.30"
              value={formData.hsCode}
              onChange={handleInputChange}
              list="hsCodes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <datalist id="hsCodes">
              {commodities.map((item) => (
                <option key={item.id} value={item.code}>
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

          {/* Shipment Value (USD) */}
          <div>
            <label
              htmlFor="shipmentValue"
              className="block text-base font-bold text-gray-800 mb-1"
            >
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

          {/* Mode of Transport */}
          <div>
            <label
              htmlFor="transportMode"
              className="block text-base font-bold text-gray-800 mb-1"
            >
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
              {["Air", "Sea", "Road", "Rail"].map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Country of Origin */}
          <div>
            <label
              htmlFor="originCountry"
              className="block text-base font-bold text-gray-800 mb-1"
            >
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
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Importing Country */}
          <div>
            <label
              htmlFor="importingCountry"
              className="block text-base font-bold text-gray-800 mb-1"
            >
              Importing Country
            </label>
            <select
              id="importingCountry"
              name="importingCountry"
              value={formData.importingCountry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              style={dropdownArrowStyle}
              required
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculate Button */}
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
