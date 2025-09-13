// src/app/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
        <Link href="/settings" className="hover:text-gray-300">
          Settings
        </Link>
      </div>

      {/* User profile (placeholder) */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-sm">Hello, User</span>
        <button className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
          U
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-white text-xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 flex flex-col gap-4 p-4 md:hidden">
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
          <Link href="/tariffs" onClick={() => setIsOpen(false)}>
            Tariffs
          </Link>
          <Link href="/settings" onClick={() => setIsOpen(false)}>
            Settings
          </Link>
          <button
            className="mt-2 text-left text-red-400"
            onClick={() => alert("Logging out…")}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
  