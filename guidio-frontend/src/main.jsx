import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router";
import App from "./App";
import { ThemeProvider } from "@/app/theme-provider";
import "@/styles/globals.css";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to guidio-frontend/.env.local (local) or to the Vercel Environment Variables (production)."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        <ThemeProvider defaultTheme="dark" storageKey="Guidio-Ai-theme">
          <App />
        </ThemeProvider>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);