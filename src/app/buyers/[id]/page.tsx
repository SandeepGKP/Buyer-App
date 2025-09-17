"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Buyer } from "@/lib/schema";
import { updateBuyerSchema } from "@/lib/zod";
import Header from "@/components/Header";

export default function BuyerDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching buyer with ID:", id);
        const response = await fetch(`/api/buyers/${id}`);
        const data = await response.json();
        if (response.ok) {
          setBuyer(data.buyer as Buyer);
          setHistory(data.history);
        } else {
          setError(data.error || "Failed to load buyer details.");
        }
      } catch (err: any) {
        console.error("Error fetching buyer:", err);
        setError("Failed to load buyer details.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!buyer) return;

    setError(null); // Clear any previous errors

    try {
      const { updatedAt, ...buyerToSave } = buyer; // Exclude updatedAt from the payload
      const response = await fetch(`/api/buyers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buyerToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save changes.");
      }

      // If successful, clear error and navigate
      setError(null);
      router.push("/buyers");
    } catch (err: any) {
      console.error("Error saving buyer:", err);
      setError(err.message || "Failed to save changes.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Header />
        <div className="text-center mt-4">
          <p className="text-lg text-gray-600">Loading buyer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600">No buyer found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Edit Buyer</h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={buyer.fullName}
            onChange={(e) => setBuyer({ ...buyer, fullName: e.target.value })}
            className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email:</label>
          <input
            type="email"
            id="email"
            value={buyer.email || ''}
            onChange={(e) => setBuyer({ ...buyer, email: e.target.value || undefined })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-900">Phone:</label>
          <input
            type="text"
            id="phone"
            value={buyer.phone}
            onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-900">City:</label>
          <select
            id="city"
            value={buyer.city}
            onChange={(e) => setBuyer({ ...buyer, city: e.target.value })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          >
            {['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-900">Property Type:</label>
          <select
            id="propertyType"
            value={buyer.propertyType}
            onChange={(e) => setBuyer({ ...buyer, propertyType: e.target.value, bhk: undefined })} // Clear BHK if property type changes
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          >
            {['Apartment', 'Villa', 'Plot', 'Office', 'Retail'].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        {['Apartment', 'Villa'].includes(buyer.propertyType) && (
          <div>
            <label htmlFor="bhk" className="block text-sm font-medium text-gray-900">BHK:</label>
            <select
              id="bhk"
              value={buyer.bhk || ''}
              onChange={(e) => setBuyer({ ...buyer, bhk: e.target.value || undefined })}
              className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
            >
              <option value="">Select BHK</option>
              {['1', '2', '3', '4', 'Studio'].map((bhk) => (
                <option key={bhk} value={bhk}>{bhk}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-900">Purpose:</label>
          <select
            id="purpose"
            value={buyer.purpose}
            onChange={(e) => setBuyer({ ...buyer, purpose: e.target.value })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          >
            {['Buy', 'Rent'].map((purpose) => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-900">Min Budget:</label>
          <input
            type="number"
            id="budgetMin"
            value={buyer.budgetMin || ''}
            onChange={(e) => setBuyer({ ...buyer, budgetMin: e.target.value ? parseInt(e.target.value) : undefined })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-900">Max Budget:</label>
          <input
            type="number"
            id="budgetMax"
            value={buyer.budgetMax || ''}
            onChange={(e) => setBuyer({ ...buyer, budgetMax: e.target.value ? parseInt(e.target.value) : undefined })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-900">Timeline:</label>
          <select
            id="timeline"
            value={buyer.timeline}
            onChange={(e) => setBuyer({ ...buyer, timeline: e.target.value })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          >
            {['0-3m', '3-6m', '>6m', 'Exploring'].map((timeline) => (
              <option key={timeline} value={timeline}>{timeline}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-900">Source:</label>
          <select
            id="source"
            value={buyer.source}
            onChange={(e) => setBuyer({ ...buyer, source: e.target.value })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          >
            {['Website', 'Referral', 'Walk-in', 'Call', 'Other'].map((source) => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-900">Status:</label>
          <select
            id="status"
            value={buyer.status}
            onChange={(e) => setBuyer({ ...buyer, status: e.target.value })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          >
            {['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-900">Notes:</label>
          <textarea
            id="notes"
            value={buyer.notes || ''}
            onChange={(e) => setBuyer({ ...buyer, notes: e.target.value || undefined })}
            rows={3}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          ></textarea>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-900">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            value={buyer.tags ? buyer.tags.join(', ') : ''}
            onChange={(e) => setBuyer({ ...buyer, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) })}
            className="mt-1 block w-full p-3  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this buyer?")) {
                try {
                  const response = await fetch(`/api/buyers/${id}`, {
                    method: "DELETE",
                  });
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to delete buyer.");
                  }
                  router.push("/buyers");
                } catch (err: any) {
                  console.error("Error deleting buyer:", err);
                  setError(err.message || "Failed to delete buyer.");
                }
              }
            }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </form>
      <h2 className="text-xl font-semibold mt-6 text-gray-900">History</h2>
      <ul className="mt-4 space-y-2">
        {history.slice(0, 5).map((entry, index) => (
          <li
            key={index}
            className="p-4 bg-gray-100 rounded-md shadow-sm border border-gray-200"
          >
            <p className="text-sm">
              <span className="font-medium">{entry.field}</span>: {entry.oldValue} → {entry.newValue}
            </p>
            <p className="text-xs text-gray-500">
              Changed by {entry.changedBy} at {new Date(entry.changedAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
