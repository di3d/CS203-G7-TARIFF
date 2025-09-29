"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../(dashboard)/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white p-4 flex items-center justify-between">
      {/* Brand */}
      <div className="text-xl font-bold">
        <Link href="/">Tariffic</Link>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-6">
        <Link href="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/calculator" className="hover:text-gray-300">
          Calculator
        </Link>
        {isLoggedIn && (
          <Link href="/admin" className="hover:text-gray-300">
            Admin
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="hidden md:flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <span className="text-sm">Hello, Admin</span>
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
