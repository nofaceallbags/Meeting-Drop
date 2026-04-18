"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { Meeting, Subscription } from "@/lib/supabase";
import MeetingForm from "@/app/components/MeetingForm";
import MeetingOutput from "@/app/components/MeetingOutput";
import UpgradeModal from "@/app/components/UpgradeModal";
import Link from "next/link";

export default function MeetingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data: m } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!m) { router.push("/dashboard"); return; }
      setMeeting(m as Meeting);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setSubscription(sub as Subscription ?? null);

      setLoading(false);
    }
    load();
  }, [id]);

  async function handleAnalyze(transcript: string) {
    if (!meeting) return;

    // Check free tier limit
    if (subscription?.plan === "free" && (subscription?.meeting_count ?? 0) >= 3) {
      setShowUpgrade(true);
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_id: meeting.id, transcript }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) { setShowUpgrade(true); return; }
        throw new Error(data.error ?? "Analysis failed");
      }

      setMeeting((prev) => prev ? { ...prev, ...data.meeting } : prev);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSave() {
    if (!meeting) return;
    setSaving(true);
    try {
      await fetch("/api/meetings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: meeting.id,
          summary: meeting.summary,
          action_items: meeting.action_items,
          follow_up_email: meeting.follow_up_email,
          status: "complete",
        }),
      });
      setMeeting((prev) => prev ? { ...prev, status: "complete" } : prev);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!meeting) return null;

  const hasOutput = meeting.summary && meeting.action_items;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Dashboard
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white text-sm font-medium truncate">{meeting.title}</span>
          <span
            className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
              meeting.status === "complete"
                ? "bg-green-500/15 text-green-400 border border-green-500/20"
                : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
            }`}
          >
            {meeting.status === "complete" ? "Complete" : "Pending"}
          </span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Meeting header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{meeting.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
            <span>
              {new Date(meeting.meeting_date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            {meeting.attendees && meeting.attendees.length > 0 && (
              <span>· {(meeting.attendees as string[]).join(", ")}</span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Show form or output depending on whether analysis exists */}
        {!hasOutput ? (
          <MeetingForm
            meeting={meeting}
            onAnalyze={handleAnalyze}
            analyzing={analyzing}
          />
        ) : (
          <MeetingOutput
            meeting={meeting}
            onSave={handleSave}
            saving={saving}
            onRedo={() => setMeeting((prev) => prev ? { ...prev, summary: null, action_items: null, follow_up_email: null, status: "pending" } : prev)}
          />
        )}
      </main>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
