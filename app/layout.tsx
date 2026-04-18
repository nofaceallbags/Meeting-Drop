import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0f1e] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
