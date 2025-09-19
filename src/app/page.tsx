"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold text-white">Tariffic</span>
          </div>
          <div className="space-x-6">
            <a
              href="/calculator"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Calculator
            </a>
            <a
              href="/admin"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Your end-to-end tariff calculation platform
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto font-light">
            Tariffic coordinates global trade compliance — empowering businesses
            to calculate duties, compare rates, and stay compliant with trade
            policies worldwide.
          </p>
          <a
            href="/calculator"
            className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Hero Image */}
        {/* <div className="mt-12 max-w-4xl mx-auto px-4">
          <div className="relative">
            <img
              src=""
              alt="Global trade and shipping containers"
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-blue-900 bg-opacity-20 rounded-lg"></div>
          </div>
        </div> */}
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Digitize tariff calculations for visibility and control
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 bg-gray-700/50 rounded-lg border border-gray-600/30">
              <div className="w-10 h-10 bg-blue-600 rounded-lg mb-3 flex items-center justify-center">
                {/* Calculator Icon */}
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 112 0v3a1 1 0 11-2 0v-3zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm4 0a1 1 0 100 2h.01a1 1 0 100-2h-.01zm-6-2a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm4 0a1 1 0 100 2h.01a1 1 0 100-2h-.01z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">
                Instant Rate Calculations
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Get accurate tariff rates and duty calculations in real-time
                across multiple countries and product codes.
              </p>
            </div>

            <div className="p-5 bg-gray-700/50 rounded-lg border border-gray-600/30">
              <div className="w-10 h-10 bg-green-600 rounded-lg mb-3 flex items-center justify-center">
                {/* Chart Bar Icon */}
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">
                Comprehensive Trade Data
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Access detailed tariff breakdowns, compare rates across
                countries, and leverage data to optimize import strategies.
              </p>
            </div>

            <div className="p-5 bg-gray-700/50 rounded-lg border border-gray-600/30">
              <div className="w-10 h-10 bg-purple-600 rounded-lg mb-3 flex items-center justify-center">
                {/* Cog Icon */}
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">
                Management Dashboard
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Manage tariff databases, user access, and system configurations
                with enterprise-grade administrative tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Put us to work as your global trade platform
          </h2>
          <p className="text-base mb-6 font-light opacity-90">
            Join hundreds of companies using Tariffic for their trade compliance
            calculations.
          </p>
          <a
            href="/calculator"
            className="inline-block bg-white text-blue-600 px-6 py-2.5 rounded-md text-base font-medium hover:bg-gray-50 transition-colors"
          >
            Start Calculating
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <span className="font-medium">Tariffic</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 Tariffic. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
