import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calculator, BarChart3, Shield } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-blue-900 dark:bg-blue-950 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <Badge className="mb-6 bg-blue-800 text-blue-100 border-blue-700 hover:bg-blue-700">
              CS203 Project - Tariffic
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Streamline Your
              <span className="block text-blue-300 mt-2">Tariff Management</span>
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Efficiently manage import tariffs, calculate duties, and ensure compliance with our comprehensive tariff management system. Built for accuracy and ease of use.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium"
              >
                <a href="/calculator">
                  Start Calculating <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-400 text-blue-200 hover:bg-blue-800 px-8 py-3 rounded-lg font-medium"
              >
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span>Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-400" />
                <span>99.9% Accurate</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span>Real-time Data</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm border border-blue-700 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Automated Calculations</h3>
                    <p className="text-sm text-blue-200">Calculate tariffs automatically with up-to-date rates</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-blue-700 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Analytics Dashboard</h3>
                    <p className="text-sm text-blue-200">Track and analyze your tariff data with reports</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-blue-700 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Compliance Ready</h3>
                    <p className="text-sm text-blue-200">Stay compliant with international regulations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
