// Run from guidio-backend:  node check-ai.js
// Tests Gemini and Groq directly and prints the REAL error. Never prints keys.
import "dotenv/config";

const gemKey = process.env.GEMINI_API_KEY;
const gemModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const groqKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

console.log("Node:", process.version);
console.log("Gemini model:", gemModel, "| Groq model:", groqModel, "\n");

async function call(name, url, init) {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(20000) });
    const body = (await res.text()).slice(0, 400);
    console.log(`[${name}] HTTP ${res.status}`, res.ok ? "OK" : "\n  " + body);
  } catch (e) {
    console.log(`[${name}] NETWORK ERROR:`, e.message, "| cause:", e.cause?.code || e.cause?.message || "-");
  }
}

if (gemKey) {
  await call(
    "gemini",
    `https://generativelanguage.googleapis.com/v1beta/models/${gemModel}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": gemKey },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Say hi" }] }] }),
    },
  );
} else console.log("[gemini] no GEMINI_API_KEY set");

if (groqKey) {
  await call("groq", "https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
    body: JSON.stringify({ model: groqModel, messages: [{ role: "user", content: "Say hi" }], max_tokens: 20 }),
  });
} else console.log("[groq] no GROQ_API_KEY set");