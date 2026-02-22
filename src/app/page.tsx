"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_SCORES = [
  {
    label: "Legend",
    score: 934,
    grade: "S",
    color: "#FFD700",
    addr: "0x1a2b...f3e4",
  },
  {
    label: "Builder",
    score: 621,
    grade: "A",
    color: "#0052FF",
    addr: "0x5c6d...a7b8",
  },
  {
    label: "Newcomer",
    score: 147,
    grade: "D",
    color: "#6B7280",
    addr: "0x9e0f...c1d2",
  },
];

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
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
          What&apos;s your Base
          <br />
          <span className="text-base-blue">Builder Score?</span>
        </h1>

        <p className="text-lg text-white/50 mb-10 max-w-lg mx-auto">
          Enter any wallet. We analyze on-chain activity, contracts deployed,
          and ecosystem contributions.
        </p>

        {/* Input */}
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
              className="w-full h-14 pl-5 pr-44 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-base focus:outline-none focus:border-base-blue/50 focus:ring-2 focus:ring-base-blue/20 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 h-10 px-5 rounded-xl bg-base-blue hover:bg-base-blue-dark text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Scoring
                </span>
              ) : (
                "Score this wallet"
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </form>

        <p className="mt-3 text-xs text-white/30">Free to check any wallet</p>

        {/* Example Score Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
          {EXAMPLE_SCORES.map((ex) => (
            <div
              key={ex.label}
              className="rounded-2xl border border-white/6 bg-white/[0.02] p-5 text-center"
            >
              <div
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2"
                style={{ borderColor: ex.color }}
              >
                <span className="text-2xl font-extrabold text-white">
                  {ex.score}
                </span>
              </div>
              <div
                className="text-xs font-bold uppercase tracking-wider mb-1"
                style={{ color: ex.color }}
              >
                {ex.label}
              </div>
              <div className="text-[11px] text-white/30 font-mono">
                {ex.addr}
              </div>
              <button className="mt-3 text-[11px] text-white/40 hover:text-white/60 transition-colors">
                Share on X &rarr;
              </button>
            </div>
          ))}
        </div>

        {/* Leaderboard teaser */}
        <div className="mt-12">
          <a
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-base-blue transition-colors"
          >
            Top builders on Base this week
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 text-sm text-white/20">
          by{" "}
          <a
            href="https://twitter.com/0xsonarbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            @0xsonarbot
          </a>{" "}
          on Base
        </div>
      </div>
    </div>
  );
}
