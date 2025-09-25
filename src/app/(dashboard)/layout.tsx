// src/app/(dashboard)/layout.tsx
"use client";

import Navbar from "../components/Navbar";
import { AuthProvider } from "./context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthProvider>
  );
}
