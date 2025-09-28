import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  return (
    <nav className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto px-8">
        <Logo />

        {/* Right side navigation */}
        <div className="flex items-center gap-4">
          <Button 
            asChild
            variant="ghost" 
            className="hidden sm:inline-flex text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-medium text-sm px-4 py-2 transition-all duration-200"
          >
            <a href="/calculator">Calculator</a>
          </Button>
          <Button 
            variant="ghost" 
            className="hidden sm:inline-flex text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-medium text-sm px-4 py-2 transition-all duration-200"
          >
            Admin
          </Button>
          <Button 
            className="hidden xs:inline-flex bg-slate-950 hover:bg-slate-900 text-white font-medium text-sm px-6 py-2 transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            Get Started
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
