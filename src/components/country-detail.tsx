"use client";

import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TradeAgreement {
  countryA: string;
  countryB: string;
  hsCode: string;
  rate: number;
  tariffType: string;
  agreementName: string;
}

interface CountryDetailProps {
  countryName: string;
  tariffRate: number;
  agreements: TradeAgreement[];
  onClose: () => void;
}

export function CountryDetail({
  countryName,
  tariffRate,
  agreements,
  onClose,
}: CountryDetailProps) {
  // Group agreements by partner country
  const groupedAgreements = agreements.reduce((acc, agreement) => {
    const partner =
      agreement.countryA.toLowerCase() === countryName.toLowerCase()
        ? agreement.countryB
        : agreement.countryA;

    if (!acc[partner]) {
      acc[partner] = [];
    }
    acc[partner].push(agreement);
    return acc;
  }, {} as { [key: string]: TradeAgreement[] });

  const sortedPartners = Object.entries(groupedAgreements).sort(
    (a, b) => b[1].length - a[1].length
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-2xl">{countryName}</CardTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Base Tariff Rate</h3>
            <p className="text-3xl font-bold text-primary">
              {tariffRate != null ? `${tariffRate.toFixed(1)}%` : "N/A"}
            </p>
          </div>

          {agreements.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Trade Agreements ({sortedPartners.length}{" "}
                {sortedPartners.length === 1 ? "partner" : "partners"})
              </h3>

              <div className="space-y-6">
                {sortedPartners.map(([partner, partnerAgreements]) => {
                  const avgRate = (
                    partnerAgreements.reduce((sum, a) => sum + a.rate, 0) /
                    partnerAgreements.length
                  ).toFixed(1);

                  // Group by HS code for better organization
                  const byHsCode = partnerAgreements.reduce(
                    (acc, agreement) => {
                      if (!acc[agreement.hsCode]) {
                        acc[agreement.hsCode] = [];
                      }
                      acc[agreement.hsCode].push(agreement);
                      return acc;
                    },
                    {} as { [key: string]: TradeAgreement[] }
                  );

                  return (
                    <div
                      key={partner}
                      className="border rounded-lg p-4 bg-card"
                    >
                      <div className="flex items-baseline justify-between mb-3">
                        <h4 className="text-base font-semibold">{partner}</h4>
                        <span className="text-sm text-muted-foreground">
                          {partnerAgreements.length}{" "}
                          {partnerAgreements.length === 1
                            ? "agreement"
                            : "agreements"}{" "}
                          • Avg: {avgRate}%
                        </span>
                      </div>

                      <div className="space-y-2">
                        {Object.entries(byHsCode).map(
                          ([hsCode, agreements]) => (
                            <div
                              key={hsCode}
                              className="pl-4 border-l-2 border-primary/30"
                            >
                              <div className="font-medium text-sm mb-1">
                                {hsCode}
                              </div>
                              <div className="space-y-1">
                                {agreements.map((agreement, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm text-muted-foreground"
                                  >
                                    <div className="flex items-center justify-between">
                                      {agreement.agreementName ||
                                        "Unknown Agreement"}{" "}
                                      • {agreement.tariffType}
                                      <span className="font-medium text-foreground">
                                        {agreement.rate.toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No active trade agreements
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
