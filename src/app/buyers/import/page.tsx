"use client";

import { useState } from 'react';
import Header from '@/components/Header';

interface ImportResult {
  message?: string;
  error?: string;
  errors?: { row: number; errors: string[] }[];
}

export default function ImportBuyers() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('/api/buyers/import', {
        method: 'POST',
        body: formData,
      });

      const data: ImportResult = await response.json();

      setResult(data);
    } catch (err) {
      setResult({ error: 'Upload failed' });
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Import Buyers (CSV)</h1>
        <p className="text-gray-600 mb-6">
          Upload a CSV file with buyer data. Max 200 rows. Headers should be:
          fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
        </p>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Importing...' : 'Import CSV'}
          </button>
        </form>

        {result && (
          <div className="mt-6">
            {result.message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {result.message}
              </div>
            )}
            {result.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {result.error}
              </div>
            )}
            {result.errors && result.errors.length > 0 && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
                <h3 className="font-bold mb-2">Validation Errors:</h3>
                <ul className="list-disc pl-5">
                  {result.errors.map((err, i) => (
                    <li key={i}>
                      <strong>Row {err.row}:</strong> {err.errors.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
