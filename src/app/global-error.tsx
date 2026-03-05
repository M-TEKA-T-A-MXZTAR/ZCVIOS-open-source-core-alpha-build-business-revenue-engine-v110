"use client";

export const dynamic = "force-dynamic";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1>Something went wrong</h1>
        <p style={{ opacity: 0.8 }}>
          A global error occurred. Try again, or refresh the page.
        </p>

        <pre style={{ whiteSpace: "pre-wrap", opacity: 0.7 }}>
          {error?.message}
        </pre>

        <button
          onClick={() => reset()}
          style={{
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #888",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
