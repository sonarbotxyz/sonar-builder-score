"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SonarBuilderLanding() {
  const [walletInput, setWalletInput] = useState("");
  const router = useRouter();

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletInput.trim()) {
      router.push(`/score/${encodeURIComponent(walletInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans selection:bg-[#0052FF]/30">
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
          What&apos;s your Base <br className="hidden md:block" />
          <span className="text-[#0052FF]">Builder Score</span>?
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Enter any wallet. We analyze on-chain activity, contracts deployed, and ecosystem contributions.
        </p>
        <form onSubmit={handleScoreSubmit} className="max-w-xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              placeholder="0x... or vitalik.eth"
              className="flex-1 bg-[#0d0d16] border border-white/10 rounded-lg px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] transition-all font-mono text-sm"
              required
            />
            <button type="submit" className="bg-[#0052FF] hover:bg-[#0040cc] text-white font-semibold px-8 py-4 rounded-lg transition-colors whitespace-nowrap">
              Score this wallet
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-500 mb-24">Free to check any wallet</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0d0d16] border border-white/5 rounded-xl p-8 flex flex-col items-center text-center hover:border-white/10 transition-colors">
            <div className="w-28 h-28 rounded-full border-[3px] border-[#FFD700] flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-white tracking-tighter">934</span>
            </div>
            <h3 className="text-[#FFD700] font-semibold text-lg tracking-wide uppercase mb-1">Legend</h3>
            <p className="text-gray-500 font-mono text-sm mb-6">0x71C...976F</p>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors group">Share on X <span className="group-hover:translate-x-1 inline-block transition-transform">→</span></button>
          </div>
          <div className="bg-[#0d0d16] border border-white/5 rounded-xl p-8 flex flex-col items-center text-center hover:border-white/10 transition-colors">
            <div className="w-28 h-28 rounded-full border-[3px] border-[#0052FF] flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-white tracking-tighter">621</span>
            </div>
            <h3 className="text-[#0052FF] font-semibold text-lg tracking-wide uppercase mb-1">Builder</h3>
            <p className="text-gray-500 font-mono text-sm mb-6">0x892...3F4A</p>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors group">Share on X <span className="group-hover:translate-x-1 inline-block transition-transform">→</span></button>
          </div>
          <div className="bg-[#0d0d16] border border-white/5 rounded-xl p-8 flex flex-col items-center text-center hover:border-white/10 transition-colors">
            <div className="w-28 h-28 rounded-full border-[3px] border-gray-500 flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-white tracking-tighter">147</span>
            </div>
            <h3 className="text-gray-400 font-semibold text-lg tracking-wide uppercase mb-1">Newcomer</h3>
            <p className="text-gray-500 font-mono text-sm mb-6">0x1A4...B920</p>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors group">Share on X <span className="group-hover:translate-x-1 inline-block transition-transform">→</span></button>
          </div>
        </div>
        <a href="/leaderboard" className="text-[#0052FF] hover:text-[#0040cc] text-sm font-semibold inline-flex items-center gap-1 group transition-colors">Top builders on Base this week <span className="group-hover:translate-x-1 transition-transform">→</span></a>
      </main>
      <footer className="border-t border-white/5 py-8">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>by @0xsonarbot on Base</span>
          <div className="w-2 h-2 rounded-full bg-[#0052FF] shadow-[0_0_8px_#0052FF]" />
        </div>
      </footer>
    </div>
  );
}
