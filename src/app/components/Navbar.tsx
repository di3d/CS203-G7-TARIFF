"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const router = useRouter();

  // 🔍 Check login status and role from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white p-4 flex items-center justify-between">
      {/* Brand */}
      <div className="text-xl font-bold">
        <Link href="/">Tariffic</Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6">
        <Link href="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/calculator" className="hover:text-gray-300">
          Calculator
        </Link>

        {/* Only show Admin link if role is Admin */}
        {isLoggedIn && role === "Admin" && (
          <Link href="/admin" className="hover:text-gray-300">
            Admin
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="hidden md:flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <span className="text-sm">
              Hello, {role === "Admin" ? "Admin" : "User"}
            </span>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
            >
              Log Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
