"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Buyer } from "@/lib/schema";
import Header from "@/components/Header";

const statuses = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'];
const cities = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'];
const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'];
const timelines = ['0-3m', '3-6m', '>6m', 'Exploring'];

interface BuyersResponse {
  buyers: Buyer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function BuyersList() {
  const [data, setData] = useState<BuyersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentParams = new URLSearchParams(searchParams.toString());
  const city = currentParams.get('city') || '';
  const propertyType = currentParams.get('propertyType') || '';
  const status = currentParams.get('status') || '';
  const timeline = currentParams.get('timeline') || '';
  const search = currentParams.get('search') || '';

  useEffect(() => {
    async function fetchBuyers() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (city) query.set('city', city);
        if (propertyType) query.set('propertyType', propertyType);
        if (status) query.set('status', status);
        if (timeline) query.set('timeline', timeline);
        if (search) query.set('search', search);
        if (currentParams.get('page')) query.set('page', currentParams.get('page')!);

        const response = await fetch(`/api/buyers?${query}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching buyers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBuyers();
  }, [searchParams]);

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to page 1
    router.push(`?${newParams.toString()}`);
  };

  const handleStatusChange = async (buyerId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/buyers/${buyerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        // Refresh the list
        window.location.reload();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading buyers...</p>
      </div>
    );
  }

  const buyers = data?.buyers || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-4 sm:p-8 pt-6">
        <h1 className="text-3xl font-bold mb-6 text text-blue-600">Buyers List</h1>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-200 to-blue-300 px-6 py-4 border-b border-blue-400">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900">Search & Filter</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-1 text-sm font-medium text-blue-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => updateSearchParams('search', e.target.value)}
                placeholder="Name, phone, email, notes..."
                className="w-full px-3 py-2 border text-black border-blue-500 rounded-md focus:ring-2 focus:ring-blue-700 focus:border-blue-700 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-1 text-sm font-medium text-blue-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>City</span>
              </label>
              <select
                value={city}
                onChange={(e) => updateSearchParams('city', e.target.value)}
                className="w-full px-3 py-2  text-black border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-700 focus:border-blue-700 shadow-sm"
              >
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-1 text-sm font-medium text-blue-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Property</span>
              </label>
              <select
                value={propertyType}
                onChange={(e) => updateSearchParams('propertyType', e.target.value)}
                className="w-full px-3 py-2 text-black border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-700 focus:border-blue-700 shadow-sm"
              >
                <option value="">All Types</option>
                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-1 text-sm font-medium text-blue-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Status</span>
              </label>
              <select
                value={status}
                onChange={(e) => updateSearchParams('status', e.target.value)}
                className="w-full px-3 py-2 text-black border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-700 focus:border-blue-700 shadow-sm"
              >
                <option value="">All Status</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-1 text-sm font-medium text-blue-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m5.5-10A10.5 10.5 0 1111.5 3.493L8 16l4.5-10.5L21 16z" />
                </svg>
                <span>Timeline</span>
              </label>
              <select
                value={timeline}
                onChange={(e) => updateSearchParams('timeline', e.target.value)}
                className="w-full px-3 py-2 text-black border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-700 focus:border-blue-700 shadow-sm"
              >
                <option value="">All Timelines</option>
                {timelines.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-blue-200">
            <Link
              href="/buyers/export"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </Link>
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-all"
              onClick={() => {
                updateSearchParams('search', '');
                updateSearchParams('city', '');
                updateSearchParams('propertyType', '');
                updateSearchParams('status', '');
                updateSearchParams('timeline', '');
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {buyers.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-lg text-gray-600">No buyers found.</p>
          <Link href="/buyers/new" className="text-blue-600 hover:underline">Create your first buyer</Link>
        </div>
      ) : (
        <>
          <div className="bg-white text-black shadow rounded overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="py-3 px-4 text-blue-800">Name</th>
                  <th className="py-3 px-4 text-blue-800">Phone</th>
                  <th className="py-3 px-4 text-blue-800">City</th>
                  <th className="py-3 px-4 text-blue-800">Property</th>
                  <th className="py-3 px-4 text-blue-800">Budget</th>
                  <th className="py-3 px-4 text-blue-800">Timeline</th>
                  <th className="py-3 px-4 text-blue-800">Status</th>
                  <th className="py-3 px-4 text-blue-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer) => {
                  const isOwner = buyer.ownerId === 'user-demo-1'; // In real app, this would be from user context

                  return (
                    <tr key={buyer.id} className={`border-t hover:bg-blue-50 ${!isOwner ? 'opacity-60' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {buyer.fullName}
                          {isOwner && (
                            <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                              ★ Yours
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{buyer.phone}</td>
                      <td className="py-3 px-4">{buyer.city}</td>
                      <td className="py-3 px-4">{buyer.propertyType}</td>
                      <td className="py-3 px-4">
                        {buyer.budgetMin || buyer.budgetMax
                          ? `${buyer.budgetMin || 0} - ${buyer.budgetMax || 0}`
                          : 'N/A'
                        }
                      </td>
                      <td className="py-3 px-4">{buyer.timeline}</td>
                      <td className="py-3 px-4">
                        {isOwner ? (
                          <div className="flex items-center gap-2">
                            <span>{buyer.status}</span>
                            <select
                              value={buyer.status}
                              onChange={async (e) => {
                                try {
                                  const response = await fetch(`/api/buyers/${buyer.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: e.target.value }),
                                  });
                                  if (response.ok) {
                                    window.location.reload();
                                  }
                                } catch (err) {
                                  console.error('Error updating status:', err);
                                }
                              }}
                              className="text-xs border rounded px-2 py-1"
                            >
                              {statuses.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="text-gray-400">{buyer.status}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isOwner ? (
                          <Link href={`/buyers/${buyer.id}`} className="text-blue-600 hover:underline">
                            Edit
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Read-only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams.toString());
                      newParams.set('page', page.toString());
                      router.push(`?${newParams.toString()}`);
                    }}
                    className={`px-3 py-2 rounded ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
