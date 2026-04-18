"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UpgradeModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-[#0d1526] border border-white/10 rounded-2xl p-8 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-2xl mb-2">🚀</div>
            <h2 className="text-xl font-bold text-white">Upgrade to Pro</h2>
            <p className="text-slate-400 text-sm mt-1">
              You&apos;ve hit the free tier limit of 3 meetings/month.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors ml-4 mt-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Price */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-5 mb-6">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-3xl font-bold text-white">$29</span>
            <span className="text-slate-400 text-sm">/month</span>
          </div>
          <ul className="space-y-2">
            {[
              "Unlimited meetings per month",
              "AI summaries + action items",
              "Follow-up email drafts",
              "Google Calendar sync",
              "Priority support",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-blue-400">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Redirecting to checkout…
            </>
          ) : (
            "Upgrade Now — $29/month"
          )}
        </button>

        <p className="text-center text-xs text-slate-600 mt-3">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}
