"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CountryDetails from "@/app/components/DefaultCountryTariffs";
import TariffsCRUD from "@/app/components/TariffsCRUD";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedIdToken = localStorage.getItem("token"); // idToken saved as "token"
    const storedRole = localStorage.getItem("role");

    console.log("DEBUG token:", storedIdToken ? "exists ✅" : "missing ❌");
    console.log("DEBUG role:", storedRole);

    if (!storedIdToken || storedRole !== "Admin") {
      router.replace("/"); // redirect if not logged in or not admin
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking authorization...</p>
      </div>
    );
  }

  // ✅ Only renders once authorized
  return (
    <div>
      <CountryDetails />
      <TariffsCRUD />
    </div>
  );
}
