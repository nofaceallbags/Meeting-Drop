import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetingDrop — AI Meeting Summaries for Startup Teams",
  description:
    "Automatically generate meeting summaries, action items, and follow-up emails from your Google Calendar meetings using AI.",
  openGraph: {
    title: "MeetingDrop",
    description: "AI-powered meeting summaries for startup teams",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#0a0f1e] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
