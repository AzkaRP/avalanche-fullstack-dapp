import { getBlockchainValue, getBlockchainEvents } from "../src/services/blockchain.service";

export default async function HomePage() {
  try {
    // Mencoba mengambil data dari backend
    const value = await getBlockchainValue();
    const events = await getBlockchainEvents();

    // Jika berhasil, tampilkan data ini
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-xl font-bold">Blockchain Data</h1>

        <section>
          <h2 className="font-semibold">Latest Value</h2>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(value, null, 2)}</pre>
        </section>

        <section>
          <h2 className="font-semibold">Events</h2>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(events, null, 2)}</pre>
        </section>
      </main>
    );
  } catch (error) {
    
    return (
      <div className="p-6 text-red-500">
        <h1 className="text-xl font-bold">Error</h1>
        <p>Gagal memuat data dari Blockchain. Pastikan Backend di Railway sudah Aktif.</p>
      </div>
    );
  }
}