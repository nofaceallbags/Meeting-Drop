import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase-server";
import { analyzeMeeting } from "@/lib/anthropic";
import { FREE_MEETING_LIMIT } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meeting_id, transcript } = await request.json();

    if (!meeting_id || !transcript?.trim()) {
      return NextResponse.json({ error: "meeting_id and transcript are required" }, { status: 400 });
    }

    // Verify meeting belongs to user
    const { data: meeting } = await supabase
      .from("meetings")
      .select("id, user_id")
      .eq("id", meeting_id)
      .eq("user_id", user.id)
      .single();

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check subscription / free tier limit
    const serviceClient = createServiceSupabaseClient();
    const { data: sub } = await serviceClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!sub) {
      // Auto-create subscription row
      await serviceClient.from("subscriptions").insert({
        user_id: user.id,
        plan: "free",
        meeting_count: 0,
      });
    } else if (sub.plan === "free" && sub.meeting_count >= FREE_MEETING_LIMIT) {
      return NextResponse.json(
        { error: "Free tier limit reached. Upgrade to Pro for unlimited meetings." },
        { status: 402 }
      );
    }

    // Call Anthropic
    const analysis = await analyzeMeeting(transcript);

    // Save result to Supabase
    const { data: updated } = await serviceClient
      .from("meetings")
      .update({
        transcript: transcript,
        summary: analysis.summary,
        action_items: analysis.action_items,
        follow_up_email: analysis.follow_up_email,
        status: "complete",
      })
      .eq("id", meeting_id)
      .select()
      .single();

    // Increment meeting count
    await serviceClient
      .from("subscriptions")
      .update({ meeting_count: (sub?.meeting_count ?? 0) + 1 })
      .eq("user_id", user.id);

    return NextResponse.json({ meeting: updated });
  } catch (err: unknown) {
    console.error("[analyze]", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
