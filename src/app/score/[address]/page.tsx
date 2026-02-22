"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ScoreResult } from "@/lib/types";
import { getGradeColor } from "@/lib/types";

const CATEGORY_CONFIG = [
  { key: "contractsDeployed" as const, label: "Contracts Deployed", max: 40, icon: "{ }" },
  { key: "transactions" as const, label: "Transactions", max: 20, icon: "Tx" },
  { key: "tokenActivity" as const, label: "ETH/USDC Volume", max: 15, icon: "$" },
  { key: "walletAge" as const, label: "Wallet Age", max: 10, icon: "~" },
  { key: "verifiedContracts" as const, label: "Verified Contracts", max: 15, icon: "V" },
];

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const pct = (score / 1000) * 100;
  const gradeColor = getGradeColor(grade);
  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
        <circle
          cx="128"
          cy="128"
          r="120"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        <circle
          cx="128"
          cy="128"
          r="120"
          fill="none"
          stroke={gradeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-bold text-white animate-score-count">{score}</span>
        <span className="text-white/30 text-sm mt-1">/ 1000</span>
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full progress-bar-fill"
        style={
          {
            "--fill-width": `${pct}%`,
            backgroundColor: color,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default function ScorePage() {
  const params = useParams();
  const address = decodeURIComponent(params.address as string);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchScore() {
      try {
        const res = await fetch(`/api/score?address=${encodeURIComponent(address)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to calculate score");
          return;
        }
        setScore(data);
      } catch {
        setError("Failed to fetch score. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchScore();
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-4 border-base-blue/20 border-t-base-blue animate-spin mx-auto mb-6" />
          <p className="text-white/60 text-lg">Analyzing on-chain activity...</p>
          <p className="text-white/30 text-sm mt-2 font-mono">
            {address.length > 20 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <p className="text-white/80 text-lg mb-2">Something went wrong</p>
          <p className="text-white/40 text-sm mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex h-10 px-6 rounded-xl bg-base-blue hover:bg-base-blue-dark text-white font-medium text-sm items-center transition-all"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  if (!score) return null;

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const ogUrl = `${appUrl}/api/og?score=${score.totalScore}&grade=${score.grade}&tier=${encodeURIComponent(score.tier)}&address=${score.address}`;
  const shareUrl = `${appUrl}/score/${score.address}`;
  const shareText = `My Base Builder Score is ${score.totalScore}/1000 — ${score.tier} tier\n\nCheck yours: ${shareUrl}\n\nvia @0xsonarbot`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* OG meta tags via next/head would go in metadata for server components,
            but since this is client, the OG image is linked via the API route */}

        {/* Address header */}
        <div className="text-center mb-8 animate-fade-in">
          {score.ensName && (
            <p className="text-xl font-semibold text-white mb-1">{score.ensName}</p>
          )}
          <p className="text-sm font-mono text-white/40">
            {score.address.slice(0, 6)}...{score.address.slice(-4)}
          </p>
        </div>

        {/* Score display */}
        <div className="glass-card rounded-3xl p-8 mb-6">
          <ScoreRing score={score.totalScore} grade={score.grade} />

          <div className="flex items-center justify-center gap-4 mt-6">
            <span
              className="text-5xl font-black"
              style={{ color: getGradeColor(score.grade) }}
            >
              {score.grade}
            </span>
            <div className="text-left">
              <div className="text-lg font-semibold text-white">{score.tier}</div>
              <div className="text-sm text-white/40">Builder Tier</div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5">
            Score Breakdown
          </h2>
          <div className="space-y-5">
            {CATEGORY_CONFIG.map((cat) => {
              const value = score.breakdown[cat.key];
              return (
                <div key={cat.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-base-blue/10 flex items-center justify-center text-base-blue text-xs font-mono font-bold">
                        {cat.icon}
                      </span>
                      <span className="text-sm text-white/80">{cat.label}</span>
                    </div>
                    <span className="text-sm font-mono text-white/60">
                      {value} / {cat.max}
                    </span>
                  </div>
                  <ProgressBar
                    value={value}
                    max={cat.max}
                    color="#0052FF"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Share */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl bg-base-blue hover:bg-base-blue-dark text-white font-semibold text-sm transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
          <a
            href="/"
            className="flex-1 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 font-medium text-sm border border-white/10 transition-all"
          >
            Score Another Wallet
          </a>
        </div>
      </div>
    </div>
  );
}
