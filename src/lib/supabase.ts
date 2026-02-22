import { createClient } from "@supabase/supabase-js";
import type { ScoreResult, LeaderboardEntry } from "./types";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

export async function getCachedScore(address: string): Promise<ScoreResult | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("address", address.toLowerCase())
    .single();

  if (error || !data) return null;

  const cachedAt = new Date(data.calculated_at).getTime();
  const oneHour = 60 * 60 * 1000;
  if (Date.now() - cachedAt > oneHour) return null;

  return {
    address: data.address,
    ensName: data.ens_name,
    totalScore: data.total_score,
    breakdown: {
      contractsDeployed: data.contracts_deployed,
      transactions: data.transactions,
      tokenActivity: data.token_activity,
      walletAge: data.wallet_age,
      verifiedContracts: data.verified_contracts,
    },
    grade: data.grade,
    tier: data.tier,
    calculatedAt: data.calculated_at,
  };
}

export async function saveScore(score: ScoreResult): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;

  const { error } = await supabase.from("scores").upsert(
    {
      address: score.address.toLowerCase(),
      ens_name: score.ensName,
      total_score: score.totalScore,
      contracts_deployed: score.breakdown.contractsDeployed,
      transactions: score.breakdown.transactions,
      token_activity: score.breakdown.tokenActivity,
      wallet_age: score.breakdown.walletAge,
      verified_contracts: score.breakdown.verifiedContracts,
      grade: score.grade,
      tier: score.tier,
      calculated_at: score.calculatedAt,
    },
    { onConflict: "address" }
  );

  if (error) {
    console.error("Failed to save score:", error);
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("scores")
    .select("address, ens_name, total_score, grade, tier, calculated_at")
    .order("total_score", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data as LeaderboardEntry[];
}
