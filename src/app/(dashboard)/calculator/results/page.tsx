"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

// API data structure
interface Country {
  id: number;
  name: string;
  tariffRate: number;
}

interface Tariff {
  id: number;
  country_a_id: number;
  country_b_id: number;
  hscode_id: number;
  rate: number;
  tariff_type: "MFN" | "AHS" | "BND";
  start_date: string;
  end_date: string;
}

interface CalculationResult {
  baseTariff: number;
  totalDuty: number;
  effectiveRate: number;
  applicableTariff: Tariff | null;
  defaultRate: number;
}

interface TariffDTO {
  countryA: string;
  countryB: string;
  hsCode: string;
  description: string;
  rate: number;
  tariffType: string;
  startDate: string;
  endDate: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const calculateTariff = async () => {
      try {
        setLoading(true);
        setError(null);

        const originCountry = searchParams.get("originCountry");
        const importingCountry = searchParams.get("importingCountry");
        const hsCode = searchParams.get("hsCode");
        const shipmentValue = parseFloat(
          searchParams.get("shipmentValue") || "0"
        );

        if (
          !originCountry ||
          !importingCountry ||
          !hsCode ||
          isNaN(shipmentValue)
        ) {
          throw new Error("Missing or invalid parameters");
        }

        // Get data
        const [countriesResponse, tariffsResponse] = await Promise.all([
          axios.get<Country[]>("http://localhost:8080/countries"),
          axios.get<TariffDTO[]>("http://localhost:8080/tariffs"),
        ]);

        // Find countries and rates
        const origin = countriesResponse.data.find(
          (c) => c.name === originCountry
        );
        const importing = countriesResponse.data.find(
          (c) => c.name === importingCountry
        );

        if (!origin || !importing) {
          throw new Error("Invalid country");
        }

        // Default rate is tariffRate of the importing country (country B)
        const defaultRate = Number(importing.tariffRate) || 0;

        // Check for tariff agreement
        const specificTariff = tariffsResponse.data.find(
          (t) =>
            t.countryA === originCountry &&
            t.countryB === importingCountry &&
            t.hsCode === hsCode &&
            new Date(t.startDate) <= new Date() &&
            new Date(t.endDate) >= new Date()
        );

        // Use specific tariff rate if exists, otherwise use default country rate
        const rate = specificTariff ? Number(specificTariff.rate) : defaultRate;
        const totalDuty = (shipmentValue * rate) / 100;

        setResult({
          baseTariff: rate,
          totalDuty: totalDuty,
          effectiveRate: (totalDuty / shipmentValue) * 100,
          applicableTariff: specificTariff
            ? {
                id: 0,
                country_a_id: origin.id,
                country_b_id: importing.id,
                hscode_id: 0,
                rate: Number(specificTariff.rate),
                tariff_type: specificTariff.tariffType as "MFN" | "AHS" | "BND",
                start_date: specificTariff.startDate,
                end_date: specificTariff.endDate,
              }
            : null,
          defaultRate: defaultRate,
        });
      } catch (err) {
        console.error("Error calculating tariff:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to calculate tariff. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    calculateTariff();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Early return if no result
  if (!result) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold text-gray-700 text-gray-600 mb-4">
          No Results
        </h2>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">Results</h1>

      <div className="space-y-6">
        {/* Input Parameters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Input Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-gray-700">
                <span className="font-medium text-gray-700">HS Code:</span>{" "}
                {searchParams.get("hsCode")}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-medium text-gray-700">
                  Shipment Value:
                </span>{" "}
                $
                {parseFloat(
                  searchParams.get("shipmentValue") || "0"
                ).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-700">
                  Mode of Transport:
                </span>{" "}
                {searchParams.get("transportMode")}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-medium text-gray-700">
                  Country of Origin:
                </span>{" "}
                {searchParams.get("originCountry")}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-700">
                  Importing Country:
                </span>{" "}
                {searchParams.get("importingCountry")}
              </p>
            </div>
          </div>
        </div>

        {/* Tariff Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Tariff Details
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-medium text-gray-700">Rate Type:</span>{" "}
              {result.applicableTariff
                ? result.applicableTariff.tariff_type
                : "Default Country Rate"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-700">Base Rate:</span>{" "}
              {(result.baseTariff || 0).toFixed(1)}%
              {result.applicableTariff && (
                <span className="text-gray-700 ml-2">
                  (Default: {(result.defaultRate || 0).toFixed(1)}%)
                </span>
              )}
            </p>
            <p className="font-bold text-2xl text-gray-800">
              <span>Effective Rate:</span>{" "}
              <span className="text-red-600">
                {(result.effectiveRate || 0).toFixed(1)}%
              </span>
            </p>
            <p className="font-bold text-2xl text-gray-800">
              <span>Total Duty:</span>{" "}
              <span className="text-red-600">
                $
                {(result.totalDuty || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
            {result.applicableTariff && (
              <p className="text-gray-700">
                Special agreement valid from{" "}
                {new Date(
                  result.applicableTariff.start_date
                ).toLocaleDateString()}{" "}
                to{" "}
                {new Date(
                  result.applicableTariff.end_date
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Return Button */}
        <div className="flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
}
