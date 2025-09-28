import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, BarChart3, Shield, FileText, Globe, Clock, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Smart Calculations",
    description: "Instantly calculate import duties with our comprehensive database of international tariff rates."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Advanced Analytics", 
    description: "Get detailed insights into your trade patterns and cost optimization opportunities."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Compliance Ready",
    description: "Stay up-to-date with changing regulations and ensure full compliance worldwide."
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Document Management",
    description: "Organize all your customs forms and compliance certificates in one secure place."
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Coverage",
    description: "Handle tariffs across 150+ countries with region-specific regulations."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-time Updates",
    description: "Receive instant notifications about tariff changes and policy updates."
  }
];

const FeatureShowcase = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            Complete Platform
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Tariff Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools for international tariff management and compliance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
