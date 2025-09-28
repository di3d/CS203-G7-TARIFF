"use client";

import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const searchParams = useSearchParams();

  // Extract data from query parameters
  const htsCode = searchParams.get("htsCode");
  const commodityDescription = searchParams.get("commodityDescription");
  const shipmentValue = searchParams.get("shipmentValue");
  const originCountry = searchParams.get("originCountry");
  const exportCountry = searchParams.get("exportCountry");
  const transportMode = searchParams.get("transportMode");

  // Mock tariff rate
  const tariffRate = 5.5; // 5.5%
  const tariffAmount = (parseFloat(shipmentValue || "0") * tariffRate / 100).toFixed(2);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Results</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="block text-base font-bold text-gray-800 mb-1">HTS Code</h2>
            <p className="text-gray-700">{htsCode}</p>
          </div>
          <div>
            <h2 className="block text-base font-bold text-gray-800 mb-1">Commodity Description</h2>
            <p className="text-gray-700">{commodityDescription}</p>
          </div>
          <div>
            <h2 className="block text-base font-bold text-gray-800 mb-1">Transport Mode</h2>
            <p className="text-gray-700">{transportMode}</p>
          </div>
          <div>
            <h2 className="block text-base font-bold text-gray-800 mb-1">Shipment Value</h2>
            <p className="text-gray-700">${shipmentValue}</p>
          </div>
          <div>
            <h2 className="block text-base font-bold text-gray-800 mb-1">Origin Country</h2>
            <p className="text-gray-700">{originCountry}</p>
          </div>
          <div>
            <h2 className="block text-base font-bold text-gray-800 mb-1">Export Country</h2>
            <p className="text-gray-700">{exportCountry}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="block text-base font-bold text-gray-800 mb-1">Applicable Tariff Rate:</p>
              <p className="block text-base font-bold text-red-700 text-2xl">{tariffRate}%</p>
            </div>
            <div>
              <p className="block text-base font-bold text-gray-800 mb-1">Tariff Amount:</p>
              <p className="block text-base font-bold text-red-700 text-2xl">${tariffAmount}</p>
            </div>
          </div>
        </div>

        {/* Recalculate */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Recalculate
          </button>
        </div>
      </div>
    </div>
  );
}
