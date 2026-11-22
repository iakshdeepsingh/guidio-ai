import "dotenv/config";
import { z } from "zod";

/*
 * Central, validated configuration.
 * Every other file reads settings from here instead of process.env.
 * Error messages list variable NAMES only, never their values.
 */

// Treat empty strings ("KEY=") as "not set".
const rawEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    ([, value]) => typeof value === "string" && value.trim() !== "",
  ),
);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Render injects PORT automatically.
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),

  DATABASE_URL: z
    .string()
    .refine(
      (value) =>
        value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "DATABASE_URL must be a MongoDB connection string",
    ),

  // Clerk reads these two directly from process.env as well.
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),

  /* ---- AI providers (at least ONE must be configured) ---- */

  // Google Gemini (AI Studio key). Optional now: Groq or Ollama can run alone.
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().min(1).default("gemini-3.8-flash"),
  GEMINI_BASE_URL: z.string().url().optional(), // advanced / testing only

  // Groq (free tier available, check console.groq.com for current limits).
  GROQ_API_KEY: z.string().min(1).optional(),
  GROQ_MODEL: z.string().min(1).default("openai/gpt-oss-120b"),
  GROQ_BASE_URL: z.string().url().default("https://api.groq.com/openai/v1"),

  // Ollama (local open-source models). Enabled only when the URL is set.
  OLLAMA_BASE_URL: z.string().url().optional(),
  OLLAMA_MODEL: z.string().min(1).default("llama3.2"),
  OLLAMA_NUM_CTX: z.coerce.number().int().min(1024).max(131072).default(8192),

  // Order in which providers are tried, for example "gemini,groq,ollama".
  AI_PROVIDER_ORDER: z.string().default("gemini,groq,ollama"),
  // Time limit for ONE provider attempt (JSON requests and first stream chunk).
  AI_TIMEOUT_MS: z.coerce.number().int().min(5000).max(120000).default(30000),
  // Local models on a CPU are slow, so Ollama gets its own limit.
  AI_LOCAL_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(5000)
    .max(600000)
    .default(120000),
  // Maximum silence between two streamed chunks.
  AI_STREAM_IDLE_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(5000)
    .max(120000)
    .default(30000),
  // Extra attempts on the SAME provider for temporary 5xx / network errors.
  AI_MAX_RETRIES: z.coerce.number().int().min(0).max(2).default(1),

  // Comma-separated list of allowed browser origins, for example:
  // https://guidio-ai.vercel.app,http://localhost:5173
  CORS_ORIGINS: z.string().optional(),

  // Legacy variables. They still work and are merged into the list above.
  CLIENT_URL: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  FRONTEND_LOCAL: z.string().optional(),

  // Number of reverse proxies in front of the app (Render = 1).
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).optional(),

  INNGEST_DEV: z.string().optional(),
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");

  console.error(`Invalid or missing environment variables:\n${problems}`);
  console.error(
    "Copy guidio-backend/.env.example to guidio-backend/.env and fill it in.",
  );
  process.exit(1);
}

const config = parsed.data;

if (!config.GEMINI_API_KEY && !config.GROQ_API_KEY && !config.OLLAMA_BASE_URL) {
  console.error(
    "No AI provider is configured. Set at least one of: GEMINI_API_KEY, GROQ_API_KEY, OLLAMA_BASE_URL.",
  );
  process.exit(1);
}

const isProduction = config.NODE_ENV === "production";
const isDevelopment = config.NODE_ENV === "development";

function toOrigin(value) {
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

const originCandidates = [
  ...(config.CORS_ORIGINS ? config.CORS_ORIGINS.split(",") : []),
  config.CLIENT_URL,
  config.FRONTEND_URL,
  config.FRONTEND_LOCAL,
  ...(isProduction ? [] : ["http://localhost:5173", "http://127.0.0.1:5173"]),
];

const corsOrigins = [
  ...new Set(originCandidates.filter(Boolean).map(toOrigin).filter(Boolean)),
];

if (isProduction && corsOrigins.length === 0) {
  console.error(
    "CORS_ORIGINS is required in production, for example: CORS_ORIGINS=https://your-app.vercel.app",
  );
  process.exit(1);
}

export const env = Object.freeze({
  nodeEnv: config.NODE_ENV,
  isProduction,
  isDevelopment,
  port: config.PORT,
  logLevel: config.LOG_LEVEL,

  databaseUrl: config.DATABASE_URL,
  clerkSecretKey: config.CLERK_SECRET_KEY,
  clerkPublishableKey: config.CLERK_PUBLISHABLE_KEY,

  ai: Object.freeze({
    providerOrder: config.AI_PROVIDER_ORDER,
    timeoutMs: config.AI_TIMEOUT_MS,
    localTimeoutMs: config.AI_LOCAL_TIMEOUT_MS,
    streamIdleTimeoutMs: config.AI_STREAM_IDLE_TIMEOUT_MS,
    maxRetries: config.AI_MAX_RETRIES,

    gemini: Object.freeze({
      apiKey: config.GEMINI_API_KEY,
      model: config.GEMINI_MODEL,
      baseUrl: config.GEMINI_BASE_URL,
    }),
    groq: Object.freeze({
      apiKey: config.GROQ_API_KEY,
      model: config.GROQ_MODEL,
      baseUrl: config.GROQ_BASE_URL,
    }),
    ollama: Object.freeze({
      baseUrl: config.OLLAMA_BASE_URL,
      model: config.OLLAMA_MODEL,
      numCtx: config.OLLAMA_NUM_CTX,
    }),
  }),

  corsOrigins,

  // Render sits behind exactly one proxy. Locally there is none.
  trustProxy: config.TRUST_PROXY ?? (isProduction ? 1 : 0),

  inngestDev: config.INNGEST_DEV === "1",
  inngestConfigured: Boolean(
    config.INNGEST_EVENT_KEY && config.INNGEST_SIGNING_KEY,
  ),
});