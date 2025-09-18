"use client";

import { useSearchParams } from 'next/navigation';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  
  // Extract data from query parameters
  const htsCode = searchParams.get('htsCode');
  const commodityDescription = searchParams.get('commodityDescription');
  const shipmentValue = searchParams.get('shipmentValue');
  const originCountry = searchParams.get('originCountry');
  const exportCountry = searchParams.get('exportCountry');
  const transportMode = searchParams.get('transportMode');
  
  // Mock tariff rate
  const tariffRate = 5.5; // 5.5%
  const tariffAmount = (parseFloat(shipmentValue || '0') * tariffRate / 100).toFixed(2);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="form-label">HTS Code</h2>
            <p className="form-text">{htsCode}</p>
          </div>
          <div>
            <h2 className="form-label">Commodity Description</h2>
            <p className="form-text">{commodityDescription}</p>
          </div>
          <div>
            <h2 className="form-label">Transport Mode</h2>
            <p className="form-text">{transportMode}</p>
          </div>
          <div>
            <h2 className="form-label">Shipment Value</h2>
            <p className="form-text">${shipmentValue}</p>
          </div>
          <div>
            <h2 className="form-label">Origin Country</h2>
            <p className="form-text">{originCountry}</p>
          </div>
          <div>
            <h2 className="form-label">Export Country</h2>
            <p className="form-text">{exportCountry}</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="form-label">Applicable Tariff Rate:</p>
              <p className="form-label text-red-700 text-2xl font-bold">{tariffRate}%</p>
            </div>
            <div>
              <p className="form-label">Tariff Amount:</p>
              <p className="form-label text-red-700 text-2xl font-bold">${tariffAmount}</p>
            </div>
          </div>
        </div>
        
        {/* Recalculate */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Recalculate
          </button>
        </div>
      </div>
    </div>
  );
}