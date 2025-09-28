import { Calculator, FileText, BarChart3 } from "lucide-react";

const FeaturesMinimal = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-slate-100 to-blue-50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-950 mb-6">
            HOW IT WORKS
          </h2>
          <div className="w-24 h-1 bg-slate-950 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three simple steps to navigate international trade with confidence.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {[
            {
              icon: Calculator,
              number: "01",
              title: "CALCULATE",
              description: "Enter product details and destination country to get precise tariff calculations with real-time rates."
            },
            {
              icon: FileText,
              number: "02", 
              title: "COMPLY",
              description: "Ensure your imports meet all regulatory requirements with comprehensive documentation standards."
            },
            {
              icon: BarChart3,
              number: "03",
              title: "ANALYZE", 
              description: "Track trade data patterns and identify cost-saving opportunities across different regions."
            }
          ].map((feature, index) => (
            <div key={index} className="group h-full">
              <div className="border-2 border-slate-950 bg-white p-8 hover:bg-slate-950 transition-all duration-500 hover:scale-[1.02] shadow-lg hover:shadow-xl h-full flex flex-col">
                <div className="space-y-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-6xl font-black text-slate-200 group-hover:text-slate-700 transition-colors duration-500">
                      {feature.number}
                    </span>
                    <feature.icon className="h-8 w-8 text-slate-950 group-hover:text-white transition-colors duration-500" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-black tracking-wider text-slate-950 group-hover:text-white mb-4 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 group-hover:text-slate-200 leading-relaxed transition-colors duration-500 flex-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesMinimal;
