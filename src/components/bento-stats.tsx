"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, Shield, Clock, Users, BarChart3 } from "lucide-react";

const StatCard = ({ value, label, icon: Icon, trend }: {
  value: string;
  label: string;
  icon: any;
  trend?: string;
}) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          {trend && (
            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
              {trend}
            </Badge>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600 font-medium">{label}</div>
      </CardContent>
    </Card>
  );
};

const BentoStats = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            Trusted Globally
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powering International Trade
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses streamlining their tariff management worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value="150+"
            label="Countries Supported"
            icon={Globe}
            trend="+12 this year"
          />
          <StatCard
            value="$2.1T"
            label="Trade Volume"
            icon={TrendingUp}
            trend="+23% YoY"
          />
          <StatCard
            value="99.9%"
            label="Accuracy Rate"
            icon={Shield}
          />
          <StatCard
            value="24/7"
            label="Support Available"
            icon={Clock}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">10,000+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
              </div>
              <p className="text-gray-600">
                Trusted by importers, exporters, and trade professionals across the globe for accurate tariff calculations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50M+</div>
                  <div className="text-gray-600">Calculations Done</div>
                </div>
              </div>
              <p className="text-gray-600">
                Our advanced algorithms have processed millions of tariff calculations, saving businesses countless hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BentoStats;
