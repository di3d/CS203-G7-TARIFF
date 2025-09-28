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
import { Logo } from "./logo";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-700 hover:text-slate-950 hover:bg-slate-100">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-white border-slate-200">
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
            href="/calculator"
            className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors py-2"
          >
            Calculator
          </a>
          <a
            href="/admin"
            className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors py-2"
          >
            Admin
          </a>
          <Button 
            className="bg-slate-950 hover:bg-slate-900 text-white font-medium text-sm px-6 py-2 mt-4"
          >
            Get Started
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
