import { NextRequest, NextResponse } from "next/server";
import { calculateScore } from "@/lib/score";
import { resolveENS, isValidAddress, isValidENS } from "@/lib/ens";
import { getCachedScore, saveScore } from "@/lib/supabase";

export async function GET(request: NextRequest) {
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
