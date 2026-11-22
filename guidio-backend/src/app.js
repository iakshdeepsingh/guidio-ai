import express from "express";
import cors from "cors";
import helmet from "helmet";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { env } from "./config/env.js";
import { logger, requestLogger } from "./utils/logger.js";
import { sendError } from "./utils/api-response.js";

import { inngest } from "./inngest/client.js";
import { inngestFunctions } from "./inngest/functions.js";

import healthRouter from "./routes/health-routes.js";
import userRouter from "./routes/user-routes.js";
import profileRouter from "./routes/profile-routes.js";
import assistantRouter from "./routes/assistant-routes.js";
import careerRouter from "./routes/career-routes.js";
import skillGapRouter from "./routes/skill-gap-routes.js";
import interviewRouter from "./routes/interview-routes.js";
import dashboardRouter from "./routes/dashboard-routes.js";
import reminderRouter from "./routes/reminder-routes.js";

import { apiLimiter } from "./middleware/rate-limiters.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");

  // On Render there is one reverse proxy in front of the app. Without this,
  // every visitor would look like the same IP address to the rate limiters.
  if (env.trustProxy > 0) {
    app.set("trust proxy", env.trustProxy);
  }

  /* ---------------------------------------------------------
     SECURITY
     --------------------------------------------------------- */

  app.use(helmet({ crossOriginResourcePolicy: false }));

  const allowedOrigins = new Set(env.corsOrigins);

  // Development only: allow the Vite dev server opened from another device on
  // the same Wi-Fi (for example http://192.168.29.8:5173 on a phone).
  const LAN_ORIGIN =
    /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/;

  app.use(
    cors({
      origin(origin, callback) {
        // No Origin header: Postman, curl, server-to-server. Clerk still protects the data.
        if (
          !origin ||
          allowedOrigins.has(origin) ||
          (!env.isProduction && LAN_ORIGIN.test(origin))
        ) {
          return callback(null, true);
        }

        logger.warn("cors_blocked", { origin: String(origin).slice(0, 200) });

        // Not allowed: send no CORS headers, so the browser blocks the call.
        return callback(null, false);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      // Lets the browser read Retry-After on a 429 (the frontend uses it).
      exposedHeaders: ["Retry-After", "RateLimit", "RateLimit-Policy"],
      maxAge: 600,
      optionsSuccessStatus: 204,
    })
  );

  app.use(requestLogger);

  /* ---------------------------------------------------------
     PUBLIC ENDPOINTS (no Clerk, no rate limit)
     --------------------------------------------------------- */

  app.get("/", (req, res) => {
    res.json({ success: true, message: "Welcome to Guidio AI API" });
  });

  app.use("/api/health", healthRouter);

  // Inngest calls this itself and signs its requests. It needs a bigger body limit.
  app.use(
    "/api/inngest",
    express.json({ limit: "4mb" }),
    serve({ client: inngest, functions: inngestFunctions })
  );

  /* ---------------------------------------------------------
     API
     --------------------------------------------------------- */

  // The largest real request is an interview answer (8,000 characters, about
  // 32 KB). 100 KB leaves room and stops oversized bodies early.
  app.use(express.json({ limit: "100kb" }));

  // A malformed or tampered token must give 401, not 500. Other Clerk failures
  // (for example a Clerk outage) still go to the normal error handler.
  const clerk = clerkMiddleware();

  app.use("/api", (req, res, next) =>
    clerk(req, res, (error) => {
      if (
        error &&
        (error instanceof SyntaxError ||
          error.name === "TokenVerificationError")
      ) {
        logger.warn("invalid_auth_token", {
          path: req.originalUrl.split("?")[0],
        });

        return sendError(
          res,
          "Unauthorized. Please sign in first.",
          401,
          null,
          "unauthorized"
        );
      }

      return next(error);
    })
  );

  app.use("/api", apiLimiter);

  app.use("/api/users", userRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/assistant", assistantRouter);
  app.use("/api/career", careerRouter);
  app.use("/api/skill-gap", skillGapRouter);
  app.use("/api/interviews", interviewRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/reminders", reminderRouter);

  /* ---------------------------------------------------------
     ERRORS
     --------------------------------------------------------- */

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}