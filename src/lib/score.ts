import {
  getTransactionList,
  getERC20Transfers,
} from "./etherscan";
import type { ScoreBreakdown, ScoreResult } from "./types";
import { getGrade, getTier } from "./types";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913".toLowerCase();

export async function calculateScore(address: string): Promise<ScoreResult> {
  const normalizedAddress = address.toLowerCase();

  const [txList, erc20Transfers] = await Promise.all([
    getTransactionList(address),
    getERC20Transfers(address),
  ]);

  // 1. Contracts deployed: +20 pts each, max 40
  const deployTxs = txList.filter(
    (tx) =>
      tx.from.toLowerCase() === normalizedAddress &&
      (tx.to === "" || tx.to === null || tx.to === "0x") &&
      tx.isError === "0"
  );
  const contractCount = deployTxs.length;
  const contractsScore = Math.min(contractCount * 20, 40);

  // 2. Transactions: +1 pt per 10 txns, max 20
  const txCount = txList.filter(
    (tx) => tx.from.toLowerCase() === normalizedAddress && tx.isError === "0"
  ).length;
  const transactionsScore = Math.min(Math.floor(txCount / 10), 20);

  // 3. ETH/USDC activity: volume score, max 15
  const ethVolume = txList.reduce((sum, tx) => {
    return sum + parseFloat(tx.value) / 1e18;
  }, 0);

  const usdcTransfers = erc20Transfers.filter(
    (tx) => tx.contractAddress.toLowerCase() === USDC_BASE
  );
  const usdcVolume = usdcTransfers.reduce((sum, tx) => {
    const decimals = parseInt(tx.tokenDecimal) || 6;
    return sum + parseFloat(tx.value) / Math.pow(10, decimals);
  }, 0);

  const estimatedVolume = ethVolume * 2500 + usdcVolume;
  let tokenActivityScore = 0;
  if (estimatedVolume > 100000) tokenActivityScore = 15;
  else if (estimatedVolume > 50000) tokenActivityScore = 12;
  else if (estimatedVolume > 10000) tokenActivityScore = 10;
  else if (estimatedVolume > 5000) tokenActivityScore = 8;
  else if (estimatedVolume > 1000) tokenActivityScore = 5;
  else if (estimatedVolume > 100) tokenActivityScore = 3;
  else if (estimatedVolume > 0) tokenActivityScore = 1;

  // 4. Wallet age bonus, max 10
  let walletAgeScore = 0;
  if (txList.length > 0) {
    const firstTxTimestamp = parseInt(txList[0].timeStamp) * 1000;
    const ageInDays = (Date.now() - firstTxTimestamp) / (1000 * 60 * 60 * 24);
    if (ageInDays > 365) walletAgeScore = 10;
    else if (ageInDays > 180) walletAgeScore = 7;
    else if (ageInDays > 90) walletAgeScore = 5;
    else if (ageInDays > 30) walletAgeScore = 3;
    else if (ageInDays > 7) walletAgeScore = 1;
  }

  // 5. Verified contracts bonus: partial credit for deployers, max 15
  const verifiedContractsScore = contractCount > 0
    ? Math.min(contractCount * 3, 15)
    : 0;

  const breakdown: ScoreBreakdown = {
    contractsDeployed: contractsScore,
    transactions: transactionsScore,
    tokenActivity: tokenActivityScore,
    walletAge: walletAgeScore,
    verifiedContracts: verifiedContractsScore,
  };

  const rawTotal =
    contractsScore + transactionsScore + tokenActivityScore + walletAgeScore + verifiedContractsScore;
  const totalScore = Math.min(Math.round((rawTotal / 100) * 1000), 1000);

  return {
    address,
    ensName: null,
    totalScore,
    breakdown,
    grade: getGrade(totalScore),
    tier: getTier(totalScore),
    calculatedAt: new Date().toISOString(),
  };
}
