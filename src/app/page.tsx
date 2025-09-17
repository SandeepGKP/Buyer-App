"use client";

import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.355-1.963l-1.36-1.36A3 3 0 0021 16v-2a3 3 0 00-1.5-2.598l-1.36-1.36A3 3 0 0016 11.414V10a2 2 0 10-4 0v1.414a3 3 0 00-2.64 2.64l-1.36 1.36A3 3 0 006 14v2a3 3 0 001.5 2.598l1.36 1.36A3 3 0 0011 22v1a2 2 0 104 0v-1a3 3 0 002.64-2.64l1.36-1.36z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              LeadFlow
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your buyer lead management with powerful tools for capturing, organizing, and tracking potential clients.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM8 21a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Active Leads</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">150</div>
              <div className="text-sm text-gray-600">Converted</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m5.5-10A10.5 10.5 0 1111.5 3.493L8 16l4.5-10.5L21 16z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">2.5hrs</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Primary Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
                <p className="opacity-90">Get started with your lead management operations</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/buyers/new"
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all border border-green-200"
                  >
                    <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium text-green-800">Add Lead</span>
                  </Link>
                  <Link
                    href="/buyers"
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200"
                  >
                    <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="font-medium text-blue-800">View All</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Data Operations */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Data Operations</h3>
                <p className="opacity-90">Import, export, and manage your lead data</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/buyers/import"
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all border border-purple-200"
                  >
                    <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-purple-800">Import CSV</span>
                  </Link>
                  <Link
                    href="/buyers/export"
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all border border-orange-200"
                  >
                    <svg className="w-8 h-8 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-orange-800">Export CSV</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Quick Access</h3>
              <p className="text-gray-600">Search for a specific buyer by ID</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const id = (e.target as HTMLFormElement).elements.namedItem("buyerId") as HTMLInputElement;
                if (id && id.value) {
                  window.location.href = `/buyers/${id.value}`;
                }
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  name="buyerId"
                  placeholder="Enter Buyer ID..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                Find Buyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
