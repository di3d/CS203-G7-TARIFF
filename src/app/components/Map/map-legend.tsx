"use client";

export function MapLegend() {
  const legendItems = [
    { color: "#10B981", label: "0% - No Tariffs" },
    { color: "#34D399", label: "< 5% - Low Tariffs" },
    { color: "#FBBF24", label: "5-10% - Medium Tariffs" },
    { color: "#FB923C", label: "10-15% - High Tariffs" },
    { color: "#EF4444", label: "> 15% - Very High Tariffs" },
    { color: "#E5E7EB", label: "No Data" },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Base Tariff Rates</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
