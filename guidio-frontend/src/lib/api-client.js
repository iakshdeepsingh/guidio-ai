const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawBaseUrl) {
  throw new Error("Missing VITE_API_BASE_URL. Add it to client/.env.local.");
}

// Remove trailing slashes.
// In development, if the app is opened from another device (a phone using
// http://192.168.x.x:5173), "localhost" would point at the phone itself.
// Swap it for the host the page was loaded from, so the same .env works everywhere.
function resolveBaseUrl(url) {
  const clean = url.replace(/\/+$/, "");

  if (import.meta.env.DEV && typeof window !== "undefined") {
    try {
      const parsed = new URL(clean);
      const isLoopback = ["localhost", "127.0.0.1"].includes(parsed.hostname);
      const pageHost = window.location.hostname;

      if (isLoopback && !["localhost", "127.0.0.1"].includes(pageHost)) {
        parsed.hostname = pageHost;
        return parsed.origin;
      }
    } catch {
      // Not a valid URL: fall through to the raw value.
    }
  }

  return clean;
}

export const API_BASE_URL = resolveBaseUrl(rawBaseUrl);

const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_STREAM_CONNECT_TIMEOUT_MS = 30_000;

/* =========================================================
   ERRORS
   ========================================================= */

/**
 * Error thrown for every failed API call.
 *
 * It extends Error, so existing code that only reads error.message
 * keeps working. New code can also read:
 *
 * status             HTTP status (0 when no response was received)
 * code               Error classification
 * details            Validation details from the backend
 * retryAfterSeconds  Server retry/cooldown time
 */
export class ApiError extends Error {
  constructor(
    message,
    {
      status = 0,
      code = "unknown",
      details = null,
      retryAfterSeconds = null,
    } = {}
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.retryAfterSeconds = retryAfterSeconds;
  }

  get isRateLimited() {
    return this.code === "rate_limited";
  }
}

const RATE_LIMIT_PATTERN =
  /quota|rate.?limit|resource.?exhausted|too many requests|\b429\b|limit has been reached/i;

/**
 * The backend's streaming error event carries a message and may carry
 * an explicit error code.
 */
export function messageLooksRateLimited(message) {
  return RATE_LIMIT_PATTERN.test(message || "");
}

function codeFromStatus(status) {
  if (status === 400 || status === 422) return "validation";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 408 || status === 504) return "timeout";
  if (status === 429) return "rate_limited";
  if (status === 502 || status === 503) return "unavailable";
  if (status >= 500) return "server";

  return "unknown";
}

const FALLBACK_MESSAGES = {
  validation: "Some of the information you entered is not valid.",
  unauthorized: "Your session has expired. Please sign in again.",
  forbidden: "You do not have permission to do that.",
  not_found: "The requested item was not found.",
  timeout: "The server took too long to respond. Please try again.",
  rate_limited:
    "Too many requests right now. Please wait a moment and try again.",
  unavailable:
    "The Guidio AI server is unavailable or waking up. Please wait a few seconds and try again.",
  server: "Something went wrong on the server. Please try again later.",
  unknown: "The request failed. Please try again.",
};

function parseRetryAfter(response) {
  const value = response.headers.get("Retry-After");
  const seconds = Number.parseInt(value ?? "", 10);

  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

function buildApiError(response, payload) {
  const code = codeFromStatus(response.status);

  const message =
    (typeof payload?.message === "string" && payload.message) ||
    FALLBACK_MESSAGES[code];

  return new ApiError(message, {
    status: response.status,
    code,
    details: payload?.errors ?? null,
    retryAfterSeconds: parseRetryAfter(response),
  });
}

function buildNetworkError() {
  return new ApiError(
    "Cannot reach the Guidio AI server. Check your internet connection. If the server was idle, it may need a few seconds to wake up.",
    { code: "network" }
  );
}

function buildTimeoutError() {
  return new ApiError(FALLBACK_MESSAGES.timeout, {
    status: 408,
    code: "timeout",
  });
}

/* =========================================================
   INTERNAL HELPERS
   ========================================================= */

function createRequestSignal(externalSignal, timeoutMs) {
  const controller = new AbortController();

  let timedOut = false;
  let timer = null;

  if (timeoutMs > 0) {
    timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
  }

  const onExternalAbort = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", onExternalAbort, {
        once: true,
      });
    }
  }

  return {
    signal: controller.signal,

    didTimeOut: () => timedOut,

    stopTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },

    cleanup() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      externalSignal?.removeEventListener("abort", onExternalAbort);
    },
  };
}

function buildHeaders({ token, headers, accept }) {
  return {
    "Content-Type": "application/json",
    ...(accept ? { Accept: accept } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function sendRequest(endpoint, options, request) {
  const { method, token, body, headers, accept } = options;

  try {
    return await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: buildHeaders({ token, headers, accept }),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: request.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      if (request.didTimeOut()) {
        throw buildTimeoutError();
      }

      // The caller cancelled the request on purpose.
      throw error;
    }

    throw buildNetworkError();
  }
}

/* =========================================================
   PUBLIC: JSON REQUESTS
   ========================================================= */

/**
 * Same call shape as before:
 * apiRequest(endpoint, { method, token, body, headers }).
 *
 * Returns the parsed JSON envelope ({ success, message, data }).
 *
 * Optional options: signal (AbortSignal) and timeoutMs.
 */
export async function apiRequest(
  endpoint,
  {
    method = "GET",
    token,
    body,
    headers = {},
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = {}
) {
  const request = createRequestSignal(signal, timeoutMs);

  try {
    const response = await sendRequest(
      endpoint,
      { method, token, body, headers },
      request
    );

    if (response.status === 204) {
      return null;
    }

    const payload = await readJson(response);

    if (!response.ok) {
      throw buildApiError(response, payload);
    }

    if (payload === null) {
      throw new ApiError("The server sent an unexpected response.", {
        status: response.status,
        code: "server",
      });
    }

    return payload;
  } catch (error) {
    if (error?.name === "AbortError" && request.didTimeOut()) {
      throw buildTimeoutError();
    }

    throw error;
  } finally {
    request.cleanup();
  }
}

/* =========================================================
   PUBLIC: SERVER-SENT EVENTS (AI assistant)
   ========================================================= */

function handleFrame(frame, onEvent) {
  for (const line of frame.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed.startsWith("data:")) continue;

    const json = trimmed.slice(5).trim();

    if (!json) continue;

    let payload;

    try {
      payload = JSON.parse(json);
    } catch {
      continue;
    }

    // Updated Phase 6 streaming error handling.
    if (payload.type === "error") {
      const message =
        payload.message || "Unable to generate the AI response.";

      const rateLimited =
        payload.code === "rate_limited" || messageLooksRateLimited(message);

      throw new ApiError(message, {
        status: rateLimited ? 429 : 0,
        code: rateLimited ? "rate_limited" : "server",
        retryAfterSeconds: Number.isFinite(payload.retryAfterSeconds)
          ? payload.retryAfterSeconds
          : null,
      });
    }

    onEvent?.(payload);

    if (payload.type === "done") {
      return true;
    }
  }

  return false;
}

/**
 * POSTs to an endpoint that answers with text/event-stream.
 *
 * Calls onEvent(payload) for every event except "error".
 * An "error" event is thrown as an ApiError.
 *
 * Resolves to { finished }, where finished is true only if
 * a "done" event was received.
 */
export async function apiStream(
  endpoint,
  {
    method = "POST",
    token,
    body,
    headers = {},
    signal,
    timeoutMs = DEFAULT_STREAM_CONNECT_TIMEOUT_MS,
    onEvent,
  } = {}
) {
  // The timeout only covers connecting.
  // A long answer may keep streaming.
  const request = createRequestSignal(signal, timeoutMs);

  let finished = false;

  try {
    const response = await sendRequest(
      endpoint,
      { method, token, body, headers, accept: "text/event-stream" },
      request
    );

    request.stopTimer();

    if (!response.ok) {
      throw buildApiError(response, await readJson(response));
    }

    if (!response.body) {
      throw new ApiError("Streaming is not supported by this browser.", {
        code: "unsupported",
      });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    try {
      while (true) {
        let chunk;

        try {
          chunk = await reader.read();
        } catch (error) {
          // Only a failed read means the connection broke.
          // Errors thrown by onEvent must reach the caller unchanged.
          if (error?.name === "AbortError") {
            throw error;
          }

          throw new ApiError(
            "The connection was lost while receiving the response. Please try again.",
            { code: "network" }
          );
        }

        const { value, done } = chunk;

        if (done) break;

        buffer += decoder
          .decode(value, { stream: true })
          .replace(/\r\n/g, "\n");

        const frames = buffer.split("\n\n");

        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          if (handleFrame(frame, onEvent)) {
            finished = true;
          }
        }
      }

      buffer += decoder.decode();

      if (buffer.trim() && handleFrame(buffer, onEvent)) {
        finished = true;
      }
    } finally {
      reader.releaseLock();
    }

    return { finished };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error?.name === "AbortError") {
      if (request.didTimeOut()) {
        throw buildTimeoutError();
      }

      throw error;
    }

    // Anything else came from the caller's onEvent callback.
    // Pass it on as is.
    throw error;
  } finally {
    request.cleanup();
  }
}