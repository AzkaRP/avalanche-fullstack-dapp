"use client"; // Tambahkan ini di baris paling atas

import { useEffect, useState } from "react";
import { getBlockchainValue, getBlockchainEvents } from "../src/services/blockchain.service";

export default function HomePage() {
  const [data, setData] = useState<{value: any, events: any} | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const val = await getBlockchainValue();
        const ev = await getBlockchainEvents();
        setData({ value: val, events: ev });
      } catch (err) {
        console.error(err);
        setError(true);
      }
    }
    loadData();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="text-xl font-bold">Error</h1>
        <p>Gagal memuat data. Cek tab Network di Inspect Element.</p>
      </div>
    );
  }

  if (!data) return <div className="p-6">Loading data dari blockchain...</div>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Blockchain Data</h1>
      <section>
        <h2 className="font-semibold">Latest Value</h2>
        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(data.value, null, 2)}</pre>
      </section>
      <section>
        <h2 className="font-semibold">Events</h2>
        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(data.events, null, 2)}</pre>
      </section>
    </main>
  );
}