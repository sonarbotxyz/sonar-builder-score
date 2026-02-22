import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Builder Score | Sonar",
  description:
    "Discover your on-chain builder reputation on Base. Score your wallet activity, contract deployments, and more.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Base Builder Score | Sonar",
    description: "Discover your on-chain builder reputation on Base.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Builder Score | Sonar",
    description: "Discover your on-chain builder reputation on Base.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen gradient-bg">
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <span className="w-8 h-8 rounded-lg bg-base-blue flex items-center justify-center text-white text-sm font-black">
                S
              </span>
              <span className="text-white">
                Sonar <span className="text-white/50 font-normal">Builder Score</span>
              </span>
            </a>
            <div className="flex items-center gap-6">
              <a
                href="/leaderboard"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Leaderboard
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
