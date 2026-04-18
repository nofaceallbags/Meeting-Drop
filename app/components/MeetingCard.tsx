"use client";

import Link from "next/link";
import type { Meeting } from "@/lib/supabase";

type Props = {
  meeting: Meeting;
};

export default function MeetingCard({ meeting }: Props) {
  const isComplete = meeting.status === "complete";
  const dateStr = new Date(meeting.meeting_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const attendees = (meeting.attendees as string[]) ?? [];

  return (
    <Link href={`/meeting/${meeting.id}`} className="block group">
      <div className="glass glass-hover rounded-xl p-5 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="font-semibold text-white text-base truncate group-hover:text-blue-400 transition-colors">
                {meeting.title}
              </h3>
              <span
                className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                  isComplete
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                }`}
              >
                {isComplete ? "Complete" : "Pending"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {dateStr}
              </span>
              {attendees.length > 0 && (
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {attendees.slice(0, 3).join(", ")}
                  {attendees.length > 3 && ` +${attendees.length - 3}`}
                </span>
              )}
            </div>

            {isComplete && meeting.summary && (
              <p className="text-sm text-slate-400 mt-2 line-clamp-2">{meeting.summary}</p>
            )}
          </div>

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 text-slate-600 group-hover:text-slate-400 mt-1 transition-colors"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
