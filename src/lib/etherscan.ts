const BASE_API = process.env.NEXT_PUBLIC_ETHERSCAN_BASE_API || "https://api.basescan.org/api";
const API_KEY = process.env.ETHERSCAN_API_KEY || "";

interface EtherscanResponse {
  status: string;
  message: string;
  result: unknown;
}

async function fetchBasescan(params: Record<string, string>): Promise<EtherscanResponse> {
  const url = new URL(BASE_API);
  Object.entries({ ...params, apikey: API_KEY }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  );
  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Basescan API error: ${res.status}`);
  return res.json();
}

export async function getTransactionList(
  address: string
): Promise<Array<{ hash: string; from: string; to: string; value: string; timeStamp: string; isError: string }>> {
  const data = await fetchBasescan({
    module: "account",
    action: "txlist",
    address,
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: "1000",
    sort: "asc",
  });
  if (data.status === "0") return [];
  return data.result as Array<{ hash: string; from: string; to: string; value: string; timeStamp: string; isError: string }>;
}

export async function getERC20Transfers(
  address: string
): Promise<Array<{ contractAddress: string; tokenSymbol: string; value: string; tokenDecimal: string }>> {
  const data = await fetchBasescan({
    module: "account",
    action: "tokentx",
    address,
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: "500",
    sort: "asc",
  });
  if (data.status === "0") return [];
  return data.result as Array<{ contractAddress: string; tokenSymbol: string; value: string; tokenDecimal: string }>;
}

export async function getBalance(address: string): Promise<string> {
  const data = await fetchBasescan({
    module: "account",
    action: "balance",
    address,
    tag: "latest",
  });
  return data.result as string;
}
