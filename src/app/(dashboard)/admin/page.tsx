"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

const HS_CODES = [
  { code: "8471.30", desc: "Portable automatic data processing machines" },
  { code: "8517.12", desc: "Telephones for cellular networks" },
  { code: "8528.72", desc: "Monitors and projectors" },
  { code: "8542.31", desc: "Electronic integrated circuits" },
  { code: "9504.50", desc: "Video game consoles and machines" },
];

export default function AdminTariffDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  // 🔐 Check backend authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/verify`, {
          headers: { Authorization: token },
        });

        if (res.data.role === "Admin") {
          setIsAuthorized(true);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setCheckedAuth(true);
      }
    };
    checkAuth();
  }, [router]);

  // ---------------- Default Tariffs ----------------
  const [tariffs, setTariffs] = useState<Record<string, Record<string, number>>>(
    () =>
      Object.fromEntries(
        COUNTRIES.map((c) => [
          c,
          Object.fromEntries(HS_CODES.map((hs) => [hs.code, 0.0])),
        ])
      )
  );

  const [search, setSearch] = useState("");
  const [openCountry, setOpenCountry] = useState<string | null>(null);

  const updateTariff = (country: string, hsCode: string, rate: string) => {
    setTariffs((prev) => ({
      ...prev,
      [country]: { ...prev[country], [hsCode]: parseFloat(rate) || 0 },
    }));
  };

  // ---------------- Special Agreements ----------------
  const [agreements, setAgreements] = useState([
    { origin: "Singapore 🇸🇬", partner: "China 🇨🇳", rate: 1.0 },
  ]);

  const [newAgreement, setNewAgreement] = useState({
    origin: "",
    partner: "",
    rate: "",
  });

  const addAgreement = () => {
    if (!newAgreement.origin || !newAgreement.partner || !newAgreement.rate) {
      alert("Please fill all fields.");
      return;
    }
    setAgreements((prev) => [
      ...prev,
      {
        origin: newAgreement.origin,
        partner: newAgreement.partner,
        rate: parseFloat(newAgreement.rate),
      },
    ]);
    setNewAgreement({ origin: "", partner: "", rate: "" });
  };

  const deleteAgreement = (idx: number) => {
    if (window.confirm("Are you sure you want to delete this agreement?")) {
      setAgreements((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  // ---------------- Trade Unions ----------------
  const [unions, setUnions] = useState([
    {
      name: "ASEAN Union",
      countries: ["Singapore 🇸🇬", "Vietnam 🇻🇳", "Malaysia 🇲🇾"],
      tariff: 0.0,
    },
  ]);

  const [newUnion, setNewUnion] = useState({
    name: "",
    selectedCountries: [] as string[],
    tariff: "",
  });

  const toggleUnionCountry = (country: string) => {
    setNewUnion((prev) => ({
      ...prev,
      selectedCountries: prev.selectedCountries.includes(country)
        ? prev.selectedCountries.filter((c) => c !== country)
        : [...prev.selectedCountries, country],
    }));
  };

  const addUnion = () => {
    if (!newUnion.name || !newUnion.tariff || newUnion.selectedCountries.length < 2) {
      alert("Please enter a union name, tariff rate, and select at least 2 countries.");
      return;
    }
    setUnions((prev) => [
      ...prev,
      {
        name: newUnion.name,
        countries: newUnion.selectedCountries,
        tariff: parseFloat(newUnion.tariff),
      },
    ]);
    setNewUnion({ name: "", selectedCountries: [], tariff: "" });
  };

  const deleteUnion = (idx: number) => {
    if (window.confirm("Are you sure you want to delete this union?")) {
      setUnions((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  // ---------------- Auth Render Handling ----------------
  if (!checkedAuth) {
    return <p className="text-center mt-10">Logging in...</p>;
  }

  if (!isAuthorized) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: Tariff Dashboard</h1>

      {/* All existing dashboard UI stays the same below */}
      {/* ... keep all tariff/agreement/union sections unchanged ... */}
    </div>
  );
}
