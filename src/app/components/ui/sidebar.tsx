"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Calculator,
    Home,
    Globe,
    LogOut,
    LogIn,
    User,
    FileSearch,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Button } from "./button";
import { ThemeToggle } from "../Map/theme-toggle";
import { cn } from "@/lib/utils";

const baseRoutes = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Calculator", icon: Calculator, href: "/calculator" },
    { label: "Tariff Map", icon: Globe, href: "/map"},
    { label: "HS Codes", icon: FileSearch, href: "/hscodes" },
];

// Define types for nav routes with SVG icons
interface NavRoute {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // for SVG components
    href: string;
    isAdmin?: boolean; // Optional property for admin routes
}

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(Boolean(token));
        let foundRole = localStorage.getItem("role");

        if (!foundRole) {
            const userJson = localStorage.getItem("user");
            if (userJson) {
                try {
                    const user = JSON.parse(userJson);
                    if (user?.role) foundRole = String(user.role);
                } catch {}
            }
        }

        if (!foundRole) {
            const jwt = localStorage.getItem("idToken") || localStorage.getItem("accessToken");
            if (jwt) {
                try {
                    const [, payloadBase64] = jwt.split(".");
                    const base64 = payloadBase64?.replace(/-/g, "+").replace(/_/g, "/") ?? "";
                    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
                    const claims = JSON.parse(atob(padded));
                    const groups = claims["cognito:groups"] || claims["groups"] || [];
                    const scope = claims["scope"] || "";
                    const roleClaim = claims["role"];
                    const realmRoles = claims["realm_access"]?.roles || [];
                    const allRoles = [
                        ...(Array.isArray(groups) ? groups : []),
                        ...(Array.isArray(realmRoles) ? realmRoles : []),
                        ...(typeof scope === "string" ? [scope] : []),
                        roleClaim ? [roleClaim] : [],
                    ].map((r) => String(r).toLowerCase());
                    if (allRoles.some((r) => r.includes("admin"))) foundRole = "Admin";
                } catch {}
            }
        }

        setRole(foundRole ?? null);
    }, [pathname]);

    const handleAuth = () => {
        if (isLoggedIn) {
            localStorage.clear();
            setIsLoggedIn(false);
            router.push("/login");
        } else {
            router.push("/login");
        }
    };

    useEffect(() => {
        if (
            isLoggedIn &&
            role?.toLowerCase() === "admin" &&
            (pathname === "/login" || pathname === "/")
        ) {
            router.push("/dashboard");
        }
    }, [isLoggedIn, role, pathname, router]);

    const navRoutes: NavRoute[] = [
        ...baseRoutes,
        ...(isLoggedIn && role?.toLowerCase() === "admin"
            ? [
                { label: "Admin", icon: User, href: "#", isAdmin: true }, // Admin itself is now the dropdown toggle
            ]
            : []),
    ];

    const adminSubsections = [
        { label: "Manage Tariffs", href: "/admin2/tariffs" },
        { label: "Manage HS Codes", href: "/admin2/hscodes" },
        { label: "Manage Countries", href: "/admin2/countries" },
    ];

    return (
        <aside className="flex flex-col h-full bg-background border-r border-border/30 shadow-md">
            <div className="px-3 py-4">
                <Link href="/dashboard" className="flex items-center pl-3 mb-10">
                    <h1 className="text-2xl font-bold text-primary">Tarrific</h1>
                </Link>
            </div>
            <nav className="flex-1 space-y-1 px-3">
                {navRoutes.map(({ label, icon: Icon, href, isAdmin }) => {
                    const active = pathname === href;
                    return (
                        <div key={href}>
                            {/* Admin link as a dropdown toggle */}
                            {isAdmin ? (
                                <div>
                                    <Button
                                        onClick={() => setIsAdminOpen(!isAdminOpen)}
                                        variant="ghost"
                                        className={cn(
                                            "group flex items-center p-3 rounded-lg font-medium text-sm transition",
                                            active
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        )}
                                    >
                                        <Icon className="h-5 w-5 mr-3 shrink-0" />
                                        {label}
                                        <ChevronDown
                                            className={cn(
                                                "ml-auto h-5 w-5 transition-transform",
                                                isAdminOpen && "rotate-180"
                                            )}
                                        />
                                    </Button>

                                    {/* Admin Subsections */}
                                    {isAdminOpen &&
                                        adminSubsections.map(({ label, href }) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                className={cn(
                                                    "group pl-8 flex items-center p-3 rounded-lg font-medium text-sm transition",
                                                    pathname === href
                                                        ? "bg-primary/20 text-primary"
                                                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                )}
                                            >
                                                {label}
                                            </Link>
                                        ))}
                                </div>
                            ) : (
                                <Link
                                    href={href}
                                    className={cn(
                                        "group flex items-center p-3 rounded-lg font-medium text-sm transition",
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    )}
                                >
                                    <Icon className="h-5 w-5 mr-3 shrink-0" />
                                    {label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
            <div className="border-t border-border/50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                </div>
                <Button
                    onClick={handleAuth}
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-primary"
                >
                    {isLoggedIn ? (
                        <>
                            <LogOut className="h-5 w-5 mr-3" />
                            Logout
                        </>
                    ) : (
                        <>
                            <LogIn className="h-5 w-5 mr-3" />
                            Login
                        </>
                    )}
                </Button>
            </div>
        </aside>
    );
}
