"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Meeting, Subscription } from "@/lib/supabase";
import MeetingCard from "@/app/components/MeetingCard";
import UpgradeModal from "@/app/components/UpgradeModal";
import { useRouter } from "next/navigation";

type CalendarEvent = {
  id: string;
  title: string;
  meeting_date: string;
  attendees: string[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ id: string; email?: string; name?: string; avatar?: string } | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/auth/login"); return; }

      const meta = u.user_metadata;
      setUser({
        id: u.id,
        email: u.email,
        name: meta?.full_name ?? meta?.name ?? u.email,
        avatar: meta?.avatar_url ?? meta?.picture,
      });

      const { data: m } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", u.id)
        .order("meeting_date", { ascending: false });
      setMeetings((m as Meeting[]) ?? []);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", u.id)
        .single();
      setSubscription(sub as Subscription ?? null);

      setLoadingMeetings(false);
    }
    init();
  }, [router]);

  const fetchCalendar = useCallback(async () => {
    setLoadingCalendar(true);
    try {
      const res = await fetch("/api/calendar");
      if (!res.ok) throw new Error("calendar fetch failed");
      const data = await res.json();
      setCalendarEvents(data.events ?? []);
    } catch {
      // silently fail — user may not have granted scope yet
    } finally {
      setLoadingCalendar(false);
    }
  }, []);

  async function importEvent(event: CalendarEvent) {
    if (!user) return;

    if (subscription?.plan === "free" && (subscription?.meeting_count ?? 0) >= 3) {
      setShowUpgrade(true);
      return;
    }

    setImportingId(event.id);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_event_id: event.id,
          title: event.title,
          meeting_date: event.meeting_date,
          attendees: event.attendees,
        }),
      });
      if (!res.ok) throw new Error("import failed");
      const { meeting } = await res.json();
      setMeetings((prev) => [meeting, ...prev]);
      router.push(`/meeting/${meeting.id}`);
    } catch {
      alert("Failed to import event. Please try again.");
    } finally {
      setImportingId(null);
    }
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
  }

  const isPro = subscription?.plan === "pro";
  const meetingCount = subscription?.meeting_count ?? 0;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Top nav */}
      <nav className="border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold">
            Meeting<span className="text-blue-500">Drop</span>
          </span>
          <div className="flex items-center gap-4">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                isPro
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "bg-white/5 text-slate-400 border border-white/10"
              }`}
            >
              {isPro ? "Pro" : `Free · ${meetingCount}/3`}
            </span>
            {!isPro && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                Upgrade
              </button>
            )}
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name ?? "avatar"}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                onClick={signOut}
                title="Sign out"
              />
            ) : (
              <button
                onClick={signOut}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            {user?.name ? `Hey, ${user.name.split(" ")[0]} 👋` : "Dashboard"}
          </h1>
          <p className="text-slate-400 text-sm">Your meeting briefs, all in one place.</p>
        </div>

        {/* Google Calendar sync */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-semibold text-white mb-1">Google Calendar</h2>
              <p className="text-sm text-slate-400">
                {calendarEvents.length > 0
                  ? `${calendarEvents.length} meetings found (±30 days)`
                  : "Pull your upcoming and past meetings to get started."}
              </p>
            </div>
            <button
              onClick={fetchCalendar}
              disabled={loadingCalendar}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {loadingCalendar ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              )}
              {loadingCalendar ? "Syncing…" : "Sync Calendar"}
            </button>
          </div>

          {calendarEvents.length > 0 && (
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
              {calendarEvents.map((ev) => {
                const alreadyImported = meetings.some((m) => m.google_event_id === ev.id);
                return (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between bg-white/3 hover:bg-white/5 rounded-lg px-4 py-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{ev.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(ev.meeting_date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "numeric", minute: "2-digit",
                        })}
                        {ev.attendees.length > 0 && ` · ${ev.attendees.length} attendees`}
                      </p>
                    </div>
                    {alreadyImported ? (
                      <span className="text-xs text-green-400 ml-4 shrink-0">✓ Imported</span>
                    ) : (
                      <button
                        onClick={() => importEvent(ev)}
                        disabled={importingId === ev.id}
                        className="ml-4 shrink-0 text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {importingId === ev.id ? "…" : "Import"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Saved meetings */}
        <div>
          <h2 className="font-semibold text-white mb-4">
            Your Meetings{" "}
            {meetings.length > 0 && (
              <span className="text-slate-500 font-normal text-sm">({meetings.length})</span>
            )}
          </h2>

          {loadingMeetings ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-xl h-20 animate-pulse" />
              ))}
            </div>
          ) : meetings.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-slate-500 text-sm">
                No meetings yet. Sync your calendar or import a meeting above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.map((m) => (
                <MeetingCard key={m.id} meeting={m} />
              ))}
            </div>
          )}
        </div>
      </main>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
