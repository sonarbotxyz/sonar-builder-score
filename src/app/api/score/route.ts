import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { calculateScore } from "@/lib/score";
import { resolveENS, isValidAddress, isValidENS } from "@/lib/ens";
import { getCachedScore, saveScore } from "@/lib/supabase";

const payTo = (process.env.X402_PAYTO_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

async function handler(request: NextRequest): Promise<NextResponse> {
  const address = request.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    let resolvedAddress = address;
    let ensName: string | null = null;

    if (isValidENS(address)) {
      const resolved = await resolveENS(address);
      resolvedAddress = resolved.address;
      ensName = resolved.ensName;
    } else if (isValidAddress(address)) {
      const resolved = await resolveENS(address);
      resolvedAddress = resolved.address;
      ensName = resolved.ensName;
    } else {
      return NextResponse.json(
        { error: "Invalid address or ENS name" },
        { status: 400 }
      );
    }

    const cached = await getCachedScore(resolvedAddress);
    if (cached) {
      return NextResponse.json(cached);
    }

    const score = await calculateScore(resolvedAddress);
    score.ensName = ensName;

    saveScore(score).catch(console.error);

    return NextResponse.json(score);
  } catch (err) {
    console.error("Score calculation error:", err);
    const message = err instanceof Error ? err.message : "Failed to calculate score";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = withX402(
  handler,
  payTo,
  {
    price: "$0.10",
    network: "base",
    config: { description: "Builder Score Lookup" },
  },
  { url: "https://x402.org/facilitator" }
);
