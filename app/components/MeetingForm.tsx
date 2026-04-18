"use client";

import { useState, useRef } from "react";
import type { Meeting } from "@/lib/supabase";

type Props = {
  meeting: Meeting;
  onAnalyze: (transcript: string) => void;
  analyzing: boolean;
};

export default function MeetingForm({ meeting, onAnalyze, analyzing }: Props) {
  const [transcript, setTranscript] = useState(meeting.transcript ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTranscript((ev.target?.result as string) ?? "");
    };
    reader.readAsText(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (transcript.trim().length < 50) return;
    onAnalyze(transcript.trim());
  }

  const charCount = transcript.length;
  const isReady = transcript.trim().length >= 50;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="font-semibold text-white text-sm" htmlFor="transcript">
            Meeting Transcript
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload .txt
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here…&#10;&#10;e.g. John: Let's start with the Q3 roadmap. Sarah: I think we should prioritize the API integration…"
          className="w-full h-72 bg-transparent border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none transition-colors leading-relaxed"
          disabled={analyzing}
        />

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-600">
            {charCount > 0 ? `${charCount.toLocaleString()} characters` : "Minimum 50 characters required"}
          </p>
          {!isReady && charCount > 0 && (
            <p className="text-xs text-yellow-500">Transcript too short</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isReady || analyzing}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
      >
        {analyzing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing with Claude AI…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Analyze Meeting
          </>
        )}
      </button>

      {analyzing && (
        <p className="text-center text-xs text-slate-500">
          This usually takes 5–10 seconds…
        </p>
      )}
    </form>
  );
}
