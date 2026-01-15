'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SIMPLE_STORAGE_ADDRESS } from '@/src/contracts/address';

// 👉 ABI SIMPLE STORAGE
const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default function Page() {
  // ==============================
  // MOUNT STATE
  // ==============================
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ==============================
  // WALLET STATE
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // ==============================
  // LOCAL STATE
  // ==============================
  const [inputValue, setInputValue] = useState('');
  const [transactions, setTransactions] = useState<
    { value: string; status: 'pending' | 'success' | 'error'; hash?: string }[]
  >([]);

  // ==============================
  // READ CONTRACT
  // ==============================
  const { data: value, isLoading: isReading, refetch } = useReadContract({
    address: SIMPLE_STORAGE_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  // ==============================
  // WRITE CONTRACT
  // ==============================
  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleSetValue = async () => {
    if (!inputValue) return;

    const newTx = { value: inputValue, status: 'pending' as const };
    setTransactions((prev) => [newTx, ...prev]);

    try {
      await writeContract({
        address: SIMPLE_STORAGE_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [BigInt(inputValue)],
      });

      setTransactions((prev) =>
        prev.map((t) =>
          t === newTx ? { ...t, status: 'success' } : t
        )
      );

      refetch();
      setInputValue('');
    } catch (err) {
      setTransactions((prev) =>
        prev.map((t) => (t === newTx ? { ...t, status: 'error' } : t))
      );
    }
  };

  const shortenAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

  // ==============================
  // TUNGGU MOUNT
  // ==============================
  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col items-center justify-start p-8">
      {/* HEADER */}
      <div className="w-full max-w-6xl mb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Web3 dApp
          </h1>
          <p className="text-slate-400 text-lg">Simple Storage Contract on Avalanche Testnet</p>
        </div>
      </div>

      {/* MAIN CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-8">

        {/* WALLET CONNECT CARD */}
        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-blue-500/20">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-xl">👛</span>
              </div>
              <h2 className="text-2xl font-bold">Wallet</h2>
            </div>

            {!isConnected ? (
              <button
                onClick={() => connect({ connector: injected() })}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isConnecting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Connecting...
                  </span>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Connected Address</p>
                  <p className="font-mono text-lg font-semibold text-blue-400">{shortenAddress(address)}</p>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="w-full text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg border border-red-500/30 transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {/* READ CONTRACT CARD */}
        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-green-500/20">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold">Value</h2>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 mb-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Current Value</p>
              {isReading ? (
                <p className="text-4xl font-black text-green-400 animate-pulse">Loading…</p>
              ) : (
                <p className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {value?.toString()}
                </p>
              )}
            </div>

            <button
              onClick={() => refetch()}
              className="w-full bg-green-600/20 hover:bg-green-600/40 text-green-400 py-3 rounded-lg text-sm font-semibold border border-green-500/30 transition-all duration-300 hover:scale-105"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* WRITE CONTRACT CARD */}
        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-purple-500/20">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <span className="text-xl">✏️</span>
              </div>
              <h2 className="text-2xl font-bold">Update</h2>
            </div>

            <input
              type="number"
              placeholder="Enter new value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 mb-4"
            />
            <button
              onClick={handleSetValue}
              disabled={isWriting || !inputValue}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                isWriting
                  ? 'bg-slate-600 cursor-not-allowed scale-100'
                  : !inputValue
                  ? 'bg-slate-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-105'
              }`}
            >
              {isWriting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Updating…
                </span>
              ) : (
                '💾 Set Value'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="w-full max-w-6xl">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <span className="ml-auto bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-semibold">
              {transactions.length}
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">✨ No transactions yet</p>
              <p className="text-slate-500 text-sm mt-2">Send your first transaction to see it appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 border transition-all duration-300 ${
                    tx.status === 'pending'
                      ? 'bg-yellow-500/10 border-yellow-500/50 animate-pulse'
                      : tx.status === 'success'
                      ? 'bg-green-500/10 border-green-500/50'
                      : 'bg-red-500/10 border-red-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xl ${
                          tx.status === 'pending' ? '⏳' :
                          tx.status === 'success' ? '✅' :
                          '❌'
                        }`}></span>
                        <p className="font-mono text-sm font-semibold">Value: <span className="text-blue-400">{tx.value}</span></p>
                      </div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${
                        tx.status === 'pending' ? 'text-yellow-400' :
                        tx.status === 'success' ? 'text-green-400' :
                        'text-red-400'
                      }`}>
                        {tx.status === 'pending' && '🔄 '}
                        {tx.status.toUpperCase()}
                      </p>
                    </div>
                    {tx.hash && (
                      <a
                        href={`https://testnet.snowtrace.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-semibold rounded border border-blue-500/30 transition-all duration-300"
                      >
                        🔗 View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}