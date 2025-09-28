import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BarChart3, Shield, FileText, Globe, Clock } from "lucide-react";

const features = [
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Automated Tariff Calculations",
    description: "Instantly calculate import duties and taxes with our comprehensive database of international tariff rates and trade agreements."
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Document Management", 
    description: "Organize and track all your import/export documentation, customs forms, and compliance certificates in one secure place."
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Multi-Country Support",
    description: "Handle tariffs for imports and exports across 150+ countries with region-specific regulations and requirements."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Advanced Analytics",
    description: "Get detailed insights into your trade patterns, cost optimization opportunities, and comprehensive compliance reporting."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Compliance Monitoring", 
    description: "Stay up-to-date with changing trade regulations and ensure your operations remain fully compliant worldwide."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-Time Updates",
    description: "Receive instant notifications about tariff changes, policy updates, and important deadline reminders."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-blue-900" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-800 text-blue-100 border-blue-700">
            Key Features
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-6">
            Everything You Need for Tariff Management
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive tools designed to streamline your international trade operations and ensure regulatory compliance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border border-blue-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
