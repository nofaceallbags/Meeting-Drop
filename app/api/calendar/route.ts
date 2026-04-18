import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchCalendarEvents } from "@/lib/google-calendar";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providerToken = session.provider_token;
  if (!providerToken) {
    return NextResponse.json(
      { error: "No Google access token. Please sign out and sign in again to grant calendar access." },
      { status: 403 }
    );
  }

  try {
    const events = await fetchCalendarEvents(providerToken);
    return NextResponse.json({ events });
  } catch (err: unknown) {
    console.error("[calendar]", err);
    const message = err instanceof Error ? err.message : "Failed to fetch calendar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
