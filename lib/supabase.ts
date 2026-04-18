import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Meeting = {
  id: string;
  user_id: string;
  google_event_id: string | null;
  title: string;
  meeting_date: string;
  attendees: string[];
  transcript: string | null;
  summary: string | null;
  action_items: { task: string; owner: string }[] | null;
  follow_up_email: string | null;
  status: "pending" | "complete";
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  plan: "free" | "pro";
  meeting_count: number;
  created_at: string;
};
