"use client";

import Link from "next/link";

const features = [
  {
    icon: "📅",
    title: "Google Calendar Sync",
    desc: "Connect once and pull all your meetings automatically — past and upcoming.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Summaries",
    desc: "Claude AI reads your transcript and distills it into a crisp 2-3 sentence summary.",
  },
  {
    icon: "✅",
    title: "Action Items + Owners",
    desc: "Every commitment captured with a name attached — no more 'who was supposed to do that?'",
  },
  {
    icon: "📧",
    title: "Follow-up Email Draft",
    desc: "A ready-to-send professional follow-up email, generated in seconds.",
  },
];

const steps = [
  { step: "1", title: "Connect Google Calendar", desc: "One-click OAuth — we read your calendar events." },
  { step: "2", title: "Paste your transcript", desc: "Drop in a meeting transcript from any source." },
  { step: "3", title: "Get your AI brief", desc: "Summary, action items, and follow-up email in seconds." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      {/* Nav */}
      <nav className="border-b border-white/5 sticky top-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            Meeting<span className="text-blue-500">Drop</span>
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Powered by Claude AI
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
          Turn messy meetings into
          <br />
          <span className="text-blue-500">clear action plans</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          MeetingDrop connects to your Google Calendar, reads your transcripts, and delivers a
          summary, action items with owners, and a ready-to-send follow-up email — all in seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 text-base w-full sm:w-auto"
          >
            Start for free →
          </Link>
          <span className="text-sm text-slate-500">No credit card required · 3 free meetings/month</span>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass glass-hover rounded-xl p-6 transition-all duration-200"
            >
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          From transcript to brief in <span className="text-blue-500">3 steps</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-lg flex items-center justify-center mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-slate-400 text-center mb-12">Start free. Upgrade when you're ready.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="glass rounded-2xl p-8">
            <h3 className="font-bold text-xl mb-1">Free</h3>
            <p className="text-slate-400 text-sm mb-4">For individuals getting started</p>
            <div className="text-4xl font-bold mb-6">
              $0<span className="text-lg font-normal text-slate-400">/mo</span>
            </div>
            <ul className="space-y-3 text-sm mb-8">
              {["3 meetings/month", "AI summaries + action items", "Follow-up email drafts", "Google Calendar sync"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-300">
                    <span className="text-green-400">✓</span> {item}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/dashboard"
              className="block text-center border border-white/10 hover:border-white/20 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Get started free
            </Link>
          </div>
          {/* Pro */}
          <div className="relative rounded-2xl p-8 bg-blue-600/10 border border-blue-500/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most popular
              </span>
            </div>
            <h3 className="font-bold text-xl mb-1">Pro</h3>
            <p className="text-slate-400 text-sm mb-4">For teams that move fast</p>
            <div className="text-4xl font-bold mb-6">
              $29<span className="text-lg font-normal text-slate-400">/mo</span>
            </div>
            <ul className="space-y-3 text-sm mb-8">
              {["Unlimited meetings", "Everything in Free", "Priority AI processing", "Team sharing (soon)"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-300">
                    <span className="text-blue-400">✓</span> {item}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/dashboard"
              className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="glass rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to drop the meeting chaos?</h2>
          <p className="text-slate-400 mb-8">
            Join startup teams who close every meeting with clarity.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25"
          >
            Connect Google Calendar →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 max-w-6xl mx-auto px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} MeetingDrop. Built for startup teams.
      </footer>
    </div>
  );
}
