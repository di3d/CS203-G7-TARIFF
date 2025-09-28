"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Package,
  DollarSign,
  Globe,
  Truck,
  FileText,
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-12 w-12 text-slate-950" />
            <h1 className="text-5xl font-black tracking-tighter text-slate-950">
              TARIFF CALCULATOR
            </h1>
          </div>
          <div className="w-24 h-1 bg-slate-950 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Calculate import duties and tariffs for your international
            shipments. Enter your shipment details below to get accurate tariff
            estimates.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-slate-950 shadow-xl"
        >
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* HTS Code - Full Width */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <label
                    htmlFor="htsCode"
                    className="text-sm font-bold text-slate-950 uppercase tracking-wide"
                  >
                    HTS Code *
                  </label>
                </div>
                <input
                  type="text"
                  id="htsCode"
                  name="htsCode"
                  placeholder="Enter HTS Code (e.g., 8471.30)"
                  value={formData.htsCode}
                  onChange={handleInputChange}
                  list="htsCodes"
                  className="w-full px-4 py-3 border-2 border-slate-300 focus:border-slate-950 focus:outline-none text-slate-950 font-medium transition-colors bg-white"
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
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200">
                    <p className="text-sm font-medium text-slate-700">
                      <span className="font-bold">Commodity Description:</span>{" "}
                      {formData.commodityDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Shipment Value */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-slate-600" />
                  <label
                    htmlFor="shipmentValue"
                    className="text-sm font-bold text-slate-950 uppercase tracking-wide"
                  >
                    Shipment Value (USD) *
                  </label>
                </div>
                <input
                  type="number"
                  id="shipmentValue"
                  name="shipmentValue"
                  value={formData.shipmentValue}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border-2 border-slate-300 focus:border-slate-950 focus:outline-none text-slate-950 font-medium transition-colors bg-white"
                  required
                />
              </div>

              {/* Transport Mode */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-slate-600" />
                  <label
                    htmlFor="transportMode"
                    className="text-sm font-bold text-slate-950 uppercase tracking-wide"
                  >
                    Mode of Transport *
                  </label>
                </div>
                <select
                  id="transportMode"
                  name="transportMode"
                  value={formData.transportMode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-300 focus:border-slate-950 focus:outline-none text-slate-950 font-medium transition-colors bg-white"
                  required
                >
                  <option value="">Select transport mode</option>
                  {TRANSPORT_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Origin Country */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-slate-600" />
                  <label
                    htmlFor="originCountry"
                    className="text-sm font-bold text-slate-950 uppercase tracking-wide"
                  >
                    Country of Origin *
                  </label>
                </div>
                <select
                  id="originCountry"
                  name="originCountry"
                  value={formData.originCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-300 focus:border-slate-950 focus:outline-none text-slate-950 font-medium transition-colors bg-white"
                  required
                >
                  <option value="">Select origin country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Country */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-slate-600" />
                  <label
                    htmlFor="exportCountry"
                    className="text-sm font-bold text-slate-950 uppercase tracking-wide"
                  >
                    Country of Export *
                  </label>
                </div>
                <select
                  id="exportCountry"
                  name="exportCountry"
                  value={formData.exportCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-300 focus:border-slate-950 focus:outline-none text-slate-950 font-medium transition-colors bg-white"
                  required
                >
                  <option value="">Select export country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-8 bg-slate-50 border-t-2 border-slate-200 text-center">
            <Button
              type="submit"
              className="bg-slate-950 hover:bg-slate-900 text-white font-semibold tracking-wide uppercase px-12 py-4 text-base rounded-none transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Tariff
            </Button>
            <p className="text-sm text-slate-500 mt-4">
              * Required fields - All calculations are estimates based on
              standard rates
            </p>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-black tracking-tighter text-slate-950 mb-4">
            NEED HELP?
          </h2>
          <p className="text-slate-600 mb-4">
            Not sure about your HTS code? Our system will suggest commodity
            descriptions as you type.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: FileText,
                title: "HTS CODES",
                desc: "Harmonized Tariff Schedule classification codes",
              },
              {
                icon: Globe,
                title: "COUNTRIES",
                desc: "Select from major trading partners worldwide",
              },
              {
                icon: Calculator,
                title: "ESTIMATES",
                desc: "Real-time calculations based on current rates",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white border border-slate-200 p-6">
                <item.icon className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <h3 className="font-black text-slate-950 text-sm uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
