"use client";

import { useState } from "react";
import type { Meeting } from "@/lib/supabase";

type Props = {
  meeting: Meeting;
  onSave: () => void;
  saving: boolean;
  onRedo: () => void;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-green-400">Copied</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function MeetingOutput({ meeting, onSave, saving, onRedo }: Props) {
  const actionItems = (meeting.action_items as { task: string; owner: string }[]) ?? [];

  const actionItemsText = actionItems
    .map((a, i) => `${i + 1}. ${a.task} — Owner: ${a.owner}`)
    .join("\n");

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Summary */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <span className="text-blue-400">📋</span> Summary
          </h2>
          <CopyButton text={meeting.summary ?? ""} />
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{meeting.summary}</p>
      </div>

      {/* Action Items */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <span className="text-green-400">✅</span> Action Items
          </h2>
          <CopyButton text={actionItemsText} />
        </div>

        {actionItems.length === 0 ? (
          <p className="text-slate-500 text-sm">No action items found.</p>
        ) : (
          <ul className="space-y-3">
            {actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs flex items-center justify-center mt-0.5 font-medium">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{item.task}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {item.owner}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Follow-up Email */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <span className="text-purple-400">📧</span> Follow-up Email Draft
          </h2>
          <CopyButton text={meeting.follow_up_email ?? ""} />
        </div>
        <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
          {meeting.follow_up_email}
        </pre>
      </div>

      {/* Actions row */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {meeting.status !== "complete" && (
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-all text-sm"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save to Dashboard
              </>
            )}
          </button>
        )}
        {meeting.status === "complete" && (
          <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Saved to dashboard
          </div>
        )}
        <button
          onClick={onRedo}
          className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white font-medium py-3 px-5 rounded-xl transition-all text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Re-analyze
        </button>
      </div>
    </div>
  );
}
