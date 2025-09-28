"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Globe,
  DollarSign,
  Package,
  Truck,
} from "lucide-react";

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
  const tariffAmount = (
    (parseFloat(shipmentValue || "0") * tariffRate) /
    100
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-slate-950 mb-4">
            TARIFF RESULTS
          </h1>
          <div className="w-24 h-1 bg-slate-950 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600">
            Your calculated import duties and tariff information
          </p>
        </div>

        {/* Results Card */}
        <div className="bg-white border-2 border-slate-950 shadow-xl">
          {/* Input Details Section */}
          <div className="p-8 border-b-2 border-slate-200">
            <h2 className="text-2xl font-black tracking-wider text-slate-950 mb-6 uppercase">
              Shipment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    HTS Code
                  </label>
                </div>
                <p className="text-lg font-medium text-slate-950 bg-slate-50 p-3 border border-slate-200">
                  {htsCode}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-slate-600" />
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Commodity Description
                  </label>
                </div>
                <p className="text-lg font-medium text-slate-950 bg-slate-50 p-3 border border-slate-200">
                  {commodityDescription}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-slate-600" />
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Transport Mode
                  </label>
                </div>
                <p className="text-lg font-medium text-slate-950 bg-slate-50 p-3 border border-slate-200">
                  {transportMode}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-slate-600" />
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Shipment Value
                  </label>
                </div>
                <p className="text-lg font-medium text-slate-950 bg-slate-50 p-3 border border-slate-200">
                  ${shipmentValue}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-slate-600" />
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Origin Country
                  </label>
                </div>
                <p className="text-lg font-medium text-slate-950 bg-slate-50 p-3 border border-slate-200">
                  {originCountry}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-slate-600" />
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Export Country
                  </label>
                </div>
                <p className="text-lg font-medium text-slate-950 bg-slate-50 p-3 border border-slate-200">
                  {exportCountry}
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="p-8 bg-gradient-to-r from-slate-50 to-blue-50">
            <h2 className="text-2xl font-black tracking-wider text-slate-950 mb-8 uppercase text-center">
              Calculated Tariff
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-white border-2 border-slate-950 p-6">
                  <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Applicable Tariff Rate
                  </p>
                  <p className="text-4xl font-black text-blue-700 tracking-tight">
                    {tariffRate}%
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white border-2 border-slate-950 p-6">
                  <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Tariff Amount
                  </p>
                  <p className="text-4xl font-black text-blue-700 tracking-tight">
                    ${tariffAmount}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Cost Summary */}
            <div className="mt-8 bg-slate-950 text-white p-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide mb-2">
                Total Import Cost
              </p>
              <p className="text-3xl font-black">
                $
                {(
                  parseFloat(shipmentValue || "0") + parseFloat(tariffAmount)
                ).toFixed(2)}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                (Shipment Value + Tariff Amount)
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-8 text-center border-t-2 border-slate-200">
            <Button
              onClick={() => window.history.back()}
              className="bg-slate-950 hover:bg-slate-900 text-white font-semibold tracking-wide uppercase px-10 py-4 text-base rounded-none transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Recalculate
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            * These calculations are estimates based on standard tariff rates.
            Actual duties may vary based on specific circumstances and current
            trade agreements.
          </p>
        </div>
      </div>
    </div>
  );
}
