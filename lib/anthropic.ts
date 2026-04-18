import Anthropic from "@anthropic-ai/sdk";

export type MeetingAnalysis = {
  summary: string;
  action_items: { task: string; owner: string }[];
  follow_up_email: string;
};

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export async function analyzeMeeting(transcript: string): Promise<MeetingAnalysis> {
  const prompt = `You are a professional meeting analyst. Given the following meeting transcript, return ONLY a valid JSON object with no extra text, no markdown, no backticks:
{
  "summary": "2-3 sentence overview of what was discussed and decided",
  "action_items": [
    { "task": "specific task description", "owner": "person name or Unknown" }
  ],
  "follow_up_email": "a professional ready-to-send follow-up email summarizing the meeting and listing action items with owners"
}
Transcript: ${transcript}`;

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Anthropic");
  }

  return JSON.parse(content.text) as MeetingAnalysis;
}
