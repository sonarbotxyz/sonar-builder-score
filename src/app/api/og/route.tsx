import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const score = searchParams.get("score") || "0";
  const grade = searchParams.get("grade") || "D";
  const tier = searchParams.get("tier") || "Newcomer";
  const address = searchParams.get("address") || "";

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const gradeColors: Record<string, string> = {
    S: "#FFD700",
    A: "#0052FF",
    B: "#3373FF",
    C: "#7AA3FF",
    D: "#6B7280",
  };
  const gradeColor = gradeColors[grade] || "#6B7280";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(ellipse at top, rgba(0,82,255,0.2) 0%, transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#0052FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 900,
            }}
          >
            S
          </div>
          <div style={{ color: "white", fontSize: "28px", fontWeight: 700 }}>
            Sonar Builder Score
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            border: `4px solid ${gradeColor}`,
            backgroundColor: "rgba(255,255,255,0.03)",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.4)",
              marginTop: "4px",
            }}
          >
            / 1000
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: gradeColor,
            }}
          >
            {grade}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.6)",
              fontWeight: 600,
            }}
          >
            {tier}
          </div>
        </div>

        {shortAddr && (
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "monospace",
            }}
          >
            {shortAddr}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
