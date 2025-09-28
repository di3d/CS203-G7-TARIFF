"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const NavMenu = () => {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="flex space-x-4">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/"
            className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/calculator"
            className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Calculator
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
