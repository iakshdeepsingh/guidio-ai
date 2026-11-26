
# Guidio AI — Server

<p align="center">
  <strong>Backend API for an AI-powered career guidance platform for students.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%7C%20Groq%20%7C%20Ollama-7C3AED" alt="AI Providers" />
</p>

The backend powers student authentication, profile data, AI-generated guidance, mock interviews, and background jobs. It uses a provider-manager architecture so the application can fall back between configured AI providers.

> **Cost-conscious by design:** The project can run using free-tier services and AI APIs. Provider quotas and free-tier policies can change; review [Free-tier limitations](#free-tier-limitations) before deployment.

---

## Contents

1. [Technology Stack](#technology-stack)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Features](#features)
5. [Installation](#installation)
6. [Environment Variables](#environment-variables)
7. [Local Development](#local-development)
8. [API Reference](#api-reference)
9. [AI Providers](#ai-providers)
10. [Database](#database)
11. [Testing](#testing)
12. [Deployment on Render](#deployment-on-render)
13. [Free-tier Limitations](#free-tier-limitations)
14. [Security Notes](#security-notes)

---

## Technology Stack

| Area | Technology |
|---|---|
| Runtime | Node.js 20 or newer (22 recommended), ES modules |
| Framework | Express 5 |
| Database | MongoDB Atlas through Prisma ORM 6 |
| Authentication | Clerk (`@clerk/express`) |
| AI | Google Gemini, Groq, optional local Ollama |
| Background Jobs | Inngest |
| Validation | Zod |
| Security | Helmet, CORS allow-list, express-rate-limit |
| Hosting | Render (API), MongoDB Atlas (database) |

## Architecture

A modular monolith with clear layers:

```text
Request
  → Routes          define endpoints
  → Middleware      auth (Clerk), validation (Zod), rate limits
  → Controllers     HTTP only: read the request, send the response
  → Services        business logic and database access
  → Database        Prisma / MongoDB or AI layer
```

The AI layer is separate from the business logic:

```text
Service → aiService → Provider manager → Gemini (primary)
                                      → Groq   (fallback)
                                      → Ollama (optional, local)
```

Services never import a provider SDK. Switching or adding a provider only touches `src/ai/`.

Cross-cutting pieces:

- `config/env.js` validates every environment variable at startup.
- `middleware/error-handler.js` turns every error into one JSON format.
- `utils/logger.js` writes structured logs with personal data and secrets removed.

## Directory Structure

```text
guidio-backend/
├── prisma/
│   └── schema.prisma              Data models and indexes
├── src/
│   ├── ai/
│   │   ├── providers/             Gemini, Groq, Ollama and HTTP utilities
│   │   ├── ai-provider-manager.js Failover, cooldowns, retries, timeouts
│   │   ├── ai-service.js           The only AI entry point for services
│   │   ├── ai-config.js            Provider settings built from env
│   │   ├── ai-errors.js            Standard AI error codes and messages
│   │   ├── ai-response.js          Message and JSON helpers
│   │   ├── *-prompt.js             AI prompts
│   │   └── *-schema.js             Zod and JSON schemas for AI output
│   ├── config/                     env.js, prisma.js
│   ├── controllers/                One per feature, HTTP only
│   ├── inngest/                    Background functions
│   ├── middleware/                 Auth, validators, rate limiters, errors
│   ├── routes/                     One router per feature
│   ├── services/                   Business logic and database access
│   ├── utils/                      Logger, API response, errors, lifecycle
│   ├── app.js                      Express app
│   └── server.js                   Startup and graceful shutdown
├── tests/                          node:test suites
├── .env.example
├── prisma.config.ts
└── package.json
```

## Features

- **Authentication:** Every private route verifies the Clerk session token. Every database query is scoped to the signed-in user, so one user can never read another user's data.
- **AI Student Assistant:** Conversations, message history, streamed replies (Server-Sent Events), partial replies saved when a stream is interrupted, and conversation deletion.
- **AI Career Guidance:** Generates a plan from the saved student profile (readiness score, roles, roadmap, projects, interview topics) and keeps a history.
- **AI Skill Gap Analysis:** Match percentage, strengths, prioritised missing skills, learning plan, project ideas, and report history.
- **AI Mock Interview:** Technical, HR or Mixed interviews, three difficulty levels, per-answer feedback and scores, final summary, and history.
- **Dashboard and Reminders:** Aggregated dashboard data and weekly readiness reminders (Inngest, Mondays 09:00 India time).
- **AI Output Validation:** Every AI answer that is stored or returned as data is checked with Zod first.
- **Reliability:** Health endpoint, graceful shutdown, structured logs, request and AI timeouts.

## Installation

Requirements: Node.js 20+, a MongoDB Atlas cluster, a Clerk application, and at least one AI provider key.

```bash
cd server

npm install

cp .env.example .env
# Windows PowerShell:
# copy .env.example .env

# Edit .env and fill in your own values

npx prisma generate

npm run db:push
```

## Environment Variables

All variables are validated at startup. The server prints the **names** of missing or invalid variables (never their values) and exits.

`.env.example` is the template. Real values go only in `.env`, which Git ignores.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development`, `test` or `production` |
| `PORT` | No | `5000` | Render sets this automatically |
| `LOG_LEVEL` | No | `debug` locally, `info` in production | Logging level |
| `CORS_ORIGINS` | Production | `http://localhost:5173` locally | Allowed browser origins |
| `TRUST_PROXY` | No | `1` in production, `0` locally | Number of reverse proxies |
| `DATABASE_URL` | Yes | — | MongoDB connection string |
| `CLERK_SECRET_KEY` | Yes | — | Clerk secret key |
| `CLERK_PUBLISHABLE_KEY` | Yes | — | Clerk publishable key |
| `GEMINI_API_KEY` | One AI key required | — | Google AI Studio key |
| `GEMINI_MODEL` | No | `gemini-3.8-flash` | Gemini model ID |
| `GROQ_API_KEY` | One AI key required | — | Groq API key |
| `GROQ_MODEL` | No | `openai/gpt-oss-120b` | Groq model ID |
| `OLLAMA_BASE_URL` | One AI key required | — | Local Ollama URL |
| `OLLAMA_MODEL` | No | `llama3.2` | Local model name |
| `OLLAMA_NUM_CTX` | No | `8192` | Local context size |
| `AI_PROVIDER_ORDER` | No | `gemini,groq,ollama` | Provider priority |
| `AI_TIMEOUT_MS` | No | `30000` | Provider timeout |
| `AI_LOCAL_TIMEOUT_MS` | No | `120000` | Ollama timeout |
| `AI_STREAM_IDLE_TIMEOUT_MS` | No | `30000` | Streaming idle timeout |
| `AI_MAX_RETRIES` | No | `1` | Extra attempts (0–2) |
| `INNGEST_DEV` | No | — | `1` for local development |
| `INNGEST_EVENT_KEY` | Production | — | Inngest Cloud event key |
| `INNGEST_SIGNING_KEY` | Production | — | Inngest Cloud signing key |

At least one of `GEMINI_API_KEY`, `GROQ_API_KEY` or `OLLAMA_BASE_URL` must be set.

## Local Development

```bash
npm run dev
# Starts API with auto-reload on http://localhost:5000

npm start
# Production-style start

npm test
# Automated tests
```

Optional, for background jobs locally:

```bash
npx inngest-cli@latest dev
```

Keep `INNGEST_DEV=1` in `.env`.

Check that the server is running:

```bash
curl http://localhost:5000/api/health
```

## API Reference

All routes except `/api/health` and `/api/inngest` require the header:

```http
Authorization: Bearer <Clerk session token>
```

IDs in URLs must be valid MongoDB ObjectIds (otherwise `404 not_found`).

### Response Format

**Success**

```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {}
}
```

**Error**

```json
{
  "success": false,
  "message": "Readable message",
  "errors": null,
  "code": "unauthorized"
}
```

Common error codes:

- `unauthorized` (401)
- `not_found` (404)
- `invalid_json` (400)
- `payload_too_large` (413)
- `conflict` (409)
- `rate_limited` (429)
- `database_unavailable` (503)
- `profile_incomplete`
- `email_not_verified`

AI error codes:

- `rate_limited` (429)
- `ai_unavailable` (503)
- `timeout` (504)
- `ai_safety_blocked` (422)
- `ai_invalid_output` (502)
- `ai_not_configured` (503)
- `ai_auth_failed` (503)
- `ai_model_not_found` (503)

A `Retry-After` header is sent when a wait time is known.

### Endpoints

| Method and Path | Body | Purpose |
|---|---|---|
| `GET /api/health` | — | Public health check |
| `GET /api/users/me` | — | Sync and return signed-in user |
| `GET /api/profile` | — | Read student profile |
| `PUT /api/profile` | Profile fields | Create or update profile |
| `GET /api/dashboard` | — | Dashboard summary |
| `GET /api/assistant/conversations` | — | List conversations |
| `POST /api/assistant/conversations` | `{ title? }` | Create conversation |
| `GET /api/assistant/conversations/:conversationId` | — | Conversation with messages |
| `POST /api/assistant/conversations/:conversationId/messages` | `{ content }` | Send a message; reply streams |
| `DELETE /api/assistant/conversations/:conversationId` | — | Delete conversation |
| `POST /api/career/plans` | Saved profile | Generate career plan |
| `GET /api/career/plans` | — | List plans |
| `GET /api/career/plans/:planId` | — | Read one plan |
| `POST /api/skill-gap/reports` | Saved profile | Generate skill-gap report |
| `GET /api/skill-gap/reports` | — | List reports |
| `GET /api/skill-gap/reports/:reportId` | — | Read one report |
| `POST /api/interviews` | Interview configuration | Start interview |
| `GET /api/interviews` | — | Interview history |
| `GET /api/interviews/:sessionId` | — | Interview details |
| `POST /api/interviews/:sessionId/questions/:questionId/answer` | `{ answerText }` | Submit answer for feedback |
| `GET /api/reminders` | — | List notifications |
| `PATCH /api/reminders/:reminderId/read` | — | Mark one as read |
| `PATCH /api/reminders/read-all` | — | Mark all as read |
| `/api/inngest` | — | Inngest endpoint |

### Streaming (Assistant Messages)

The reply is `text/event-stream`. Each line is `data: <JSON>` followed by a blank line.

```text
data: {"type":"start"}

data: {"type":"chunk","text":"Hello"}

data: {"type":"done","data":{ ...saved messages... }}

data: {"type":"error","message":"...","code":"rate_limited","retryAfterSeconds":30}
```

If the browser disconnects, the AI request is cancelled so no quota is wasted, and any partial reply is saved.

Errors before the stream starts (bad token, bad input, rate limit) are normal JSON errors.

### Health Check

`GET /api/health` is public and exposes no secrets, models or error text.

```json
{
  "success": true,
  "message": "Guidio AI backend is running",
  "data": {
    "status": "healthy",
    "database": "up",
    "ai": {
      "status": "up",
      "providers": [
        {
          "provider": "gemini",
          "available": true
        }
      ]
    },
    "service": "Guidio AI API",
    "uptimeSeconds": 120,
    "timestamp": "2026-01-01T00:00:00.000Z"
  }
}
```

- **HTTP 200:** Database reachable. `ai.status` can still be `degraded` or `down` if a provider is paused by a rate limit.
- **HTTP 503:** Database unreachable, or the server is shutting down (`status: "shutting_down"`).
- The database result is cached for 10 seconds.

### Rate Limits

| Limit | Applies To | Window |
|---|---|---|
| 300 requests | All `/api` routes, per IP address | 15 minutes |
| 30 requests | Assistant messages, career plans, skill-gap reports, per user | 15 minutes |
| 50 requests | Starting interviews and submitting answers, per user | 15 minutes |

A `429` response includes `Retry-After`.

## AI Providers

Configure at least one provider in `.env`.

Default order:

**Gemini → Groq → Ollama**

Providers you do not configure are skipped.

| Provider | Needs | Notes |
|---|---|---|
| Gemini | `GEMINI_API_KEY` | Primary provider. Free tier with per-model limits. |
| Groq | `GROQ_API_KEY` | Optional fallback. Free plan with rate limits. |
| Ollama | `OLLAMA_BASE_URL` | Local open-source models. Cannot run on Render's free plan. |

### Provider Manager Behaviour

- **429 (rate limit):** The provider is paused for its `Retry-After` time (60 seconds if none was sent, never more than 15 minutes) and the next provider is used.
- **Temporary errors (5xx, network, timeout):** After 3 consecutive errors the provider is paused for 30 seconds.
- **Bad key or unknown model:** The provider is paused for 15 minutes and the next one is used.
- **Never retried or failed over:** Invalid requests, safety refusals and cancellations.
- **Streaming:** Failover is possible only before the first chunk is sent.
- **Structured output:** Gemini uses JSON schema mode. Groq uses JSON mode with the schema in the prompt. Ollama uses native JSON-schema `format`. Every answer is validated with Zod.
- **Provider health:** Available through `aiService.getStatus()` and summarised in `/api/health`.

**Model names change.** Groq retires models regularly. Check available models using:

```bash
curl -s https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

In PowerShell, use `$env:GROQ_API_KEY`.

Verify the Gemini model ID in Google AI Studio too.

**Response caching:** Not implemented. All AI output is generated per user, so nothing private is shared between users.

**Fair use:** Use one API key per provider, as the providers' terms intend. The code does not rotate keys or create accounts to get around limits.

## Database

MongoDB through Prisma.

Models:

- `User`
- `StudentProfile`
- `AssistantConversation`
- `AssistantMessage`
- `CareerPlan`
- `SkillGapReport`
- `InterviewSession`
- `InterviewQuestion`
- `InterviewAnswer`
- `InterviewImprovementSummary`
- `WeeklyReadinessReminder`

Relationships use `onDelete: Cascade` where a record belongs to a user.

Indexes (for example `userId, createdAt`) support history lists, and unique indexes prevent duplicates.

### Database Commands

```bash
npx prisma generate

npm run db:push
```

MongoDB has no SQL migrations. `db:push` only adds what is missing. It never wipes data on its own, but read what Prisma prints before confirming, especially if it warns about a unique index on existing duplicate data.

Do not run reset commands against a production database.

**Atlas Network Access:** Allow your IP for local work. Render's free plan has no fixed outbound IP, so the deployed API needs `0.0.0.0/0`. Use a strong, unique database password.

## Testing

```bash
npm test
```

**68 automated tests** run with no database, keys, or internet access.

- **AI layer:** Gemini, Groq and Ollama adapters are tested against small local servers that imitate their real response formats. Covers failover, cooldowns, Retry-After, timeouts, retries, streaming and validation.
- **Reliability:** Logger redaction, health reporting and the profile service (with a fake Prisma object).

These tests prove the logic. They do **not** prove that your real keys, models, MongoDB cluster or Clerk instance work.

After setup, check manually:

1. Sign in.
2. Save a profile.
3. Send an assistant message.
4. Generate a career plan and skill-gap report.
5. Finish an interview.
6. Open `/api/health`.

## Deployment on Render

The repository root has a `render.yaml` blueprint.

1. Push the repository to GitHub (make sure `.env` is not committed).
2. In Render choose **New → Blueprint** (or create a Web Service with Root Directory `guidio-backend`).
3. Settings:
   - Build command: `npm ci && npx prisma generate`
   - Start command: `npm start`
   - Health check path: `/api/health`
   - Instance type: Free
4. Set the secret environment variables (marked `sync: false` in the blueprint):
   - `DATABASE_URL`
   - `CLERK_SECRET_KEY`
   - `CLERK_PUBLISHABLE_KEY`
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - Inngest keys, if using Inngest Cloud
5. Set `CORS_ORIGINS` to your exact frontend URL. Do not set `PORT`.
6. Deploy and open:

   `https://<your-service>.onrender.com/api/health`

7. If you use Inngest Cloud, sync the app at:

   `https://<your-service>.onrender.com/api/inngest`

The server listens on `0.0.0.0` and the port Render provides.

On deployment, Render sends `SIGTERM`: the health check starts answering 503, running requests get time to finish, then the database disconnects and the process exits.

## Free-tier Limitations

Be honest with yourself and your users about these:

- **Render free web services:** Spin down after 15 minutes without traffic and take about a minute to start again. They also have 750 free instance hours per month per workspace, a single instance, no persistent disk, and Render may restart them at any time. [Render documentation](https://render.com/docs/free).

- **AI free tiers:** Have per-model, per-minute and per-day limits that Google and Groq can change at any time. When every provider is limited, users see a clear message with a wait time.

- **Free-tier data:** May be used by the provider according to its terms. Check them before putting sensitive information in prompts.

- **Clerk Development Mode:** Is not meant for a public launch. [Clerk documentation](https://clerk.com/docs/deployments/environments).
  - Development instances are limited to 100 users, and users cannot be moved to a production instance.
  - Session state is passed in the URL query string instead of secure cookies.
  - Sign-in pages use a Clerk `accounts.dev` domain.
  - Fine for a portfolio or demo with a few users. For real users, create a Clerk **Production** instance (this needs your own domain) and replace the `pk_live_` / `sk_live_` keys in Vercel and Render.

- **MongoDB Atlas free (M0):** Has storage and connection limits. Check Atlas for current numbers.

## Security Notes

- Secrets live only in environment variables. `.env` and every `.env.*` file except `.env.example` are in `.gitignore`.
- If a real key was ever committed, shared in a chat or uploaded anywhere, rotate it (Clerk, Gemini, Groq, and the MongoDB user password). Deleting the file from Git does not remove it from history.
- Every private route checks the Clerk session. A malformed or tampered token returns `401`.
- Database queries use the internal user ID found from the verified Clerk ID, never an ID sent by the client.
- Input is validated with Zod; request bodies are limited to 1 MB.
- Helmet sets security headers. CORS allows only the origins in `CORS_ORIGINS`.
- Logs never contain tokens, API keys, connection strings, emails, names, or chat and prompt text. Secrets and emails that appear inside error messages are masked.
- In production, unexpected server errors return a generic message; details stay in the logs.
- The frontend never talks to MongoDB or an AI provider directly.
