"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, Award, Clock } from "lucide-react";

const StatItem = ({ end, label, prefix = "", suffix = "", icon: Icon }: {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon: any;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => {
        const increment = Math.ceil(end / 50);
        if (prevCount < end) {
          return Math.min(prevCount + increment, end);
        }
        return end;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-8 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {prefix}{count.toLocaleString()}{suffix}
        </div>
        <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </div>
      </CardContent>
    </Card>
  );
};

const StatsSection = () => {
  return (
    <div className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Trusted by Importers Worldwide
          </h2>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Join thousands of businesses who trust Tariffic for their international trade needs
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem 
            end={150} 
            label="Countries Supported" 
            suffix="+" 
            icon={Globe}
          />
          <StatItem 
            end={10000} 
            label="Tariff Codes" 
            suffix="+" 
            icon={Users}
          />
          <StatItem 
            end={99} 
            label="Accuracy Rate" 
            suffix="%" 
            icon={Award}
          />
          <StatItem 
            end={24} 
            label="Support Hours" 
            suffix="/7" 
            icon={Clock}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
