import OpenAI from "openai";

export function createOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export async function summarizeText(text: string) {
  const client = createOpenAIClient();
  if (!client) return { short: text.slice(0, 200), full: text };
  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a concise summarizer." },
        { role: "user", content: `Summarize:
\n${text}` },
      ],
      max_tokens: 220,
    });
    const out = resp.choices?.[0]?.message?.content ?? text.slice(0, 200);
    return { short: out, full: text };
  } catch (err) {
    console.error("summarizeText error", err);
    return { short: text.slice(0, 200), full: text };
  }
}
