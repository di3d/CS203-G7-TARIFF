"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { Logo } from "./navbar/logo";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <VisuallyHidden>
            <SheetDescription>Navigation menu</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-8">
          <a
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors py-2"
          >
            Home
          </a>
          <a
            href="/calculator"
            className="text-sm font-medium hover:text-primary transition-colors py-2"
          >
            Calculator
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
