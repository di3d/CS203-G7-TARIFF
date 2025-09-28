"use client";

// This component is no longer used since we moved navigation to the right side
// Keeping it for potential future use but it's not imported in navbar.tsx

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const NavMenu = ({ className }: { className?: string }) => {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="flex space-x-4">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/calculator"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors"
          >
            Calculator
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
