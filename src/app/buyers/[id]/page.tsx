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

    const isStale = buyer.updatedAt !== Date.now();
    if (isStale) {
      setError("Record changed, please refresh.");
      return;
    }
    try {
      const response = await fetch(`/api/buyers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buyer),
      });
      if (!response.ok) {
        throw new Error("Failed to save changes.");
      }
      router.push("/buyers");
    } catch (err: any) {
      console.error("Error saving buyer:", err);
      setError("Failed to save changes.");
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
          <label className="block text-sm font-medium text-gray-900">Full Name:</label>
          <input
            type="text"
            value={buyer.fullName}
            onChange={(e) => setBuyer({ ...buyer, fullName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Phone:</label>
          <input
            type="text"
            value={buyer.phone}
            onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        {/* Add other fields similarly */}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
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
