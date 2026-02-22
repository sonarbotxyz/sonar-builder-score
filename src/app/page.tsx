"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(trimmed);
    const isENS = trimmed.endsWith(".eth");
    if (!isAddress && !isENS) {
      setError("Enter a valid wallet address (0x...) or ENS name (.eth)");
      return;
    }

    setError("");
    setLoading(true);
    router.push(`/score/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-blue/10 border border-base-blue/20 text-base-blue text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-base-blue animate-pulse" />
            Powered by Base
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
          What&apos;s your Base
          <br />
          <span className="text-base-blue">Builder Score?</span>
        </h1>

        <p className="text-lg text-white/50 mb-12 max-w-md mx-auto">
          Measure your on-chain builder reputation. Deploy contracts, transact, and build on Base to
          increase your score.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder="0x... or vitalik.eth"
              className="w-full h-14 pl-5 pr-28 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-base focus:outline-none focus:border-base-blue/50 focus:ring-2 focus:ring-base-blue/20 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 h-10 px-6 rounded-xl bg-base-blue hover:bg-base-blue-dark text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Scoring
                </span>
              ) : (
                "Score"
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </form>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-lg mx-auto">
          {[
            { label: "Contracts", icon: "{ }", max: 40 },
            { label: "Transactions", icon: "Tx", max: 20 },
            { label: "Volume", icon: "$", max: 15 },
            { label: "Wallet Age", icon: "~", max: 10 },
            { label: "Verified", icon: "V", max: 15 },
          ].map((cat) => (
            <div
              key={cat.label}
              className="glass-card rounded-xl p-3 text-center"
            >
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-base-blue/10 flex items-center justify-center text-base-blue text-xs font-mono font-bold">
                {cat.icon}
              </div>
              <div className="text-xs text-white/40">{cat.label}</div>
              <div className="text-xs text-white/20 mt-0.5">max {cat.max}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
