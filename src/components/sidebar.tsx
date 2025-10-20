"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calculator, Home, LogOut, LogIn } from "lucide-react";
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
];

export function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		// Check if user is logged in
		const token = localStorage.getItem("token");
		setIsLoggedIn(!!token);
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

	return (
		<div className="space-y-4 py-4 flex flex-col h-full bg-background border-r">
			<div className="px-3 py-2 flex-1">
				<Link href="/dashboard" className="flex items-center pl-3 mb-14">
					<h1 className="text-2xl font-bold">Tarrific</h1>
				</Link>
				<div className="space-y-1">
					{routes.map((route) => (
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
					))}
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
