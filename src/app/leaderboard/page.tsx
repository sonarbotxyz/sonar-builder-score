"use client";

import { useEffect, useState } from "react";
import { getGradeColor } from "@/lib/types";
import type { LeaderboardEntry } from "@/lib/types";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Builder Leaderboard
          </h1>
          <p className="text-white/40">Top 20 builders on Base</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 animate-pulse"
              >
                <div className="h-6 w-full bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-white/50 text-lg mb-2">No scores yet</p>
            <p className="text-white/30 text-sm mb-6">
              Be the first to check your Base Builder Score!
            </p>
            <a
              href="/"
              className="inline-flex h-10 px-6 rounded-xl bg-base-blue hover:bg-base-blue-dark text-white font-medium text-sm items-center transition-all"
            >
              Check Your Score
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const shortAddr = `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`;
              const rankBg =
                i === 0
                  ? "bg-yellow-500/10 border-yellow-500/20"
                  : i === 1
                    ? "bg-gray-300/10 border-gray-300/20"
                    : i === 2
                      ? "bg-orange-500/10 border-orange-500/20"
                      : "bg-white/[0.02] border-white/5";

              return (
                <a
                  key={entry.address}
                  href={`/score/${entry.address}`}
                  className={`block glass-card rounded-2xl p-4 sm:p-5 hover:bg-white/[0.04] transition-all border ${rankBg}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center">
                      <span
                        className={`text-lg font-bold ${
                          i < 3 ? "text-white" : "text-white/30"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {entry.ens_name ? (
                          <>
                            <span className="font-semibold text-white truncate">
                              {entry.ens_name}
                            </span>
                            <span className="text-xs font-mono text-white/30">
                              {shortAddr}
                            </span>
                          </>
                        ) : (
                          <span className="font-mono text-sm text-white/80">
                            {shortAddr}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">{entry.tier}</div>
                    </div>

                    <span
                      className="text-2xl font-black"
                      style={{ color: getGradeColor(entry.grade) }}
                    >
                      {entry.grade}
                    </span>

                    <div className="text-right">
                      <span className="text-lg font-bold text-white">
                        {entry.total_score}
                      </span>
                      <span className="text-xs text-white/30 ml-0.5">/1000</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
