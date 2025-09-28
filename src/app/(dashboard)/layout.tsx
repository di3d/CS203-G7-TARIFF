import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tariffic - Professional Tariff Calculator",
  description:
    "Calculate import duties and tariffs for international trade. Real-time calculations for 60+ countries worldwide.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
