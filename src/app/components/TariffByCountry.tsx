'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Country {
  id: number;
  name: string;
  tariffRate: number;
}

const CountriesTable: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<Country[]>('http://localhost:8080/countries')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading countries...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Countries</h2>
      <table className="min-w-full border border-gray-800">
        <thead>
          <tr className="bg-gray-800">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Default Tariff Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {countries.map(country => (
            <tr key={country.id}>
              <td className="border px-4 py-2">{country.id}</td>
              <td className="border px-4 py-2">{country.name}</td>
              <td className="border px-4 py-2">{country.tariffRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountriesTable;
