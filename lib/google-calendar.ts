import { google } from "googleapis";

export type CalendarEvent = {
  id: string;
  title: string;
  meeting_date: string;
  attendees: string[];
  description?: string;
};

export async function fetchCalendarEvents(accessToken: string): Promise<CalendarEvent[]> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const thirtyDaysAhead = new Date();
  thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + 30);

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: thirtyDaysAgo.toISOString(),
    timeMax: thirtyDaysAhead.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 50,
  });

  const events = response.data.items ?? [];

  return events
    .filter((e) => e.status !== "cancelled" && e.summary)
    .map((e) => ({
      id: e.id!,
      title: e.summary!,
      meeting_date: e.start?.dateTime ?? e.start?.date ?? new Date().toISOString(),
      attendees: (e.attendees ?? [])
        .map((a) => a.email ?? a.displayName ?? "")
        .filter(Boolean),
      description: e.description ?? undefined,
    }));
}
