"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calculator, Home, Globe, LogOut, LogIn, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const routes = [
	{
		label: "Dashboard",
		icon: Home,
		href: "/dashboard",
	},
	{
		label: "Calculator",
		icon: Calculator,
		href: "/calculator",
	},
	{
		label: "Tariff Map",
		icon: Globe,
		href: "/map",
	},
];

export function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [role, setRole] = useState<string | null>(null);

	useEffect(() => {
		// Check if user is logged in and read role from localStorage.
		// Support multiple shapes: `role` string, `user` JSON, or derive role from JWTs.
		const token = localStorage.getItem("token");
		setIsLoggedIn(!!token);

		let storedRole = localStorage.getItem("role");

		if (!storedRole) {
			const userJson = localStorage.getItem("user");
			if (userJson) {
				try {
					const userObj = JSON.parse(userJson);
					if (userObj && userObj.role) storedRole = String(userObj.role);
				} catch (e) {
					// ignore
				}
			}
		}

		// If still no role, try to extract from idToken/accessToken (JWT)
		if (!storedRole) {
			const idToken = localStorage.getItem("idToken") || localStorage.getItem("accessToken");
			if (idToken) {
				try {
					const payloadBase64 = idToken.split(".")[1];
					if (payloadBase64) {
						const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
						const pad = base64.length % 4;
						const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
						const json = atob(padded);
						const claims = JSON.parse(json);

						const groups = claims["cognito:groups"] || claims["groups"];
						const scope = claims["scope"] || "";
						const roleClaim = claims["role"] || null;
						const realmRoles = claims["realm_access"]?.roles;

						if (Array.isArray(groups) && groups.map(String).some((g) => g.toLowerCase() === "admin")) {
							storedRole = "Admin";
						} else if (Array.isArray(realmRoles) && realmRoles.map(String).some((r) => r.toLowerCase() === "admin")) {
							storedRole = "Admin";
						} else if (typeof scope === "string" && scope.toLowerCase().includes("admin")) {
							storedRole = "Admin";
						} else if (roleClaim && String(roleClaim).toLowerCase() === "admin") {
							storedRole = "Admin";
						}
					}
				} catch (e) {
					// ignore parse errors
				}
			}
		}

		setRole(storedRole ? storedRole : null);
	}, [pathname]);

	const handleAuthAction = () => {
		if (isLoggedIn) {
			// Logout
			localStorage.removeItem("token");
			localStorage.removeItem("role");
			localStorage.removeItem("userId");
			setIsLoggedIn(false);
			router.push("/login");
		} else {
			// Login
			router.push("/login");
		}
	};

	// If an Admin logs in, redirect them to the dashboard when they complete login.
	useEffect(() => {
		if (
			isLoggedIn &&
			role &&
			String(role).toLowerCase() === "admin" &&
			(pathname === "/login" || pathname === "/")
		) {
			router.push("/dashboard");
		}
	}, [isLoggedIn, role, pathname, router]);

	return (
		<div className="space-y-4 py-4 flex flex-col h-full bg-background border-r">
			<div className="px-3 py-2 flex-1">
				<Link href="/dashboard" className="flex items-center pl-3 mb-14">
					<h1 className="text-2xl font-bold">Tarrific</h1>
				</Link>
				<div className="space-y-1">
					{(() => {
						const navRoutes = [...routes];
						if (isLoggedIn && role && String(role).toLowerCase() === "admin") {
							navRoutes.push({ label: "Admin", icon: User, href: "/admin2" });
						}
						return navRoutes.map((route) => (
							<Link
								key={route.href}
								href={route.href}
								className={cn(
									"text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
									pathname === route.href
										? "text-primary bg-primary/10"
										: "text-muted-foreground"
								)}
							>
								<div className="flex items-center flex-1">
									<route.icon className="h-5 w-5 mr-3" />
									{route.label}
								</div>
							</Link>
						));
					})()}
				</div>
			</div>
			<div className="px-3 py-2 space-y-2">
				<div className="flex items-center justify-between px-3">
					<span className="text-sm text-muted-foreground">Theme</span>
					<ThemeToggle />
				</div>
				<Button
					onClick={handleAuthAction}
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
		</div>
	);
}
