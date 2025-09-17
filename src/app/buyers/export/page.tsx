"use client";

import Header from '@/components/Header';

export default function ExportBuyers() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] p-8">
        <h1 className="text-3xl font-bold mb-4">Export Buyers (CSV)</h1>
      <p className="text-lg text-gray-600 mb-6">
        Export your buyers data to a CSV file. The export includes all buyers owned by you, without any filters.
      </p>
      {/* <div className="text-sm text-gray-500 mb-6">
        Note: To export filtered results, apply filters on the Buyers List page and use an export button there (future enhancement).
      </div> */}
      <button
        onClick={() => window.open('/api/buyers/export', '_blank')}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Download CSV
      </button>
      </div>
    </div>
  );
}
