"use client";

export function MapLegend() {
    const legendItems = [
        { color: "#1D4ED8", label: "10+ Agreements" },
        { color: "#3B82F6", label: "6–9 Agreements" },
        { color: "#60A5FA", label: "3–5 Agreements" },
        { color: "#93C5FD", label: "1–2 Agreements" },
        { color: "#E5E7EB", label: "No Agreements / No Data" },
    ];

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium">Trade Agreement Activity</h3>
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
