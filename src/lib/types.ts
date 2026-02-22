export interface ScoreBreakdown {
  contractsDeployed: number;
  transactions: number;
  tokenActivity: number;
  walletAge: number;
  verifiedContracts: number;
}

export interface ScoreResult {
  address: string;
  ensName: string | null;
  totalScore: number;
  breakdown: ScoreBreakdown;
  grade: string;
  tier: string;
  calculatedAt: string;
}

export interface LeaderboardEntry {
  address: string;
  ens_name: string | null;
  total_score: number;
  grade: string;
  tier: string;
  calculated_at: string;
}

export function getGrade(score: number): string {
  if (score >= 900) return "S";
  if (score >= 750) return "A";
  if (score >= 500) return "B";
  if (score >= 300) return "C";
  return "D";
}

export function getTier(score: number): string {
  if (score >= 900) return "Legend";
  if (score >= 600) return "Builder";
  if (score >= 300) return "Apprentice";
  return "Newcomer";
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case "S":
      return "#FFD700";
    case "A":
      return "#0052FF";
    case "B":
      return "#3373FF";
    case "C":
      return "#7AA3FF";
    case "D":
      return "#6B7280";
    default:
      return "#6B7280";
  }
}
