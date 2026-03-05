"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  React.useEffect(() => {
    // log for debugging without crashing build
    // eslint-disable-next-line no-console
    console.error("GlobalError boundary caught:", error);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: "system-ui", padding: 24 }}>
        <h1 style={{ margin: 0 }}>Something went wrong</h1>
        <p style={{ marginTop: 12, opacity: 0.85 }}>
          The app hit an unexpected error. You can try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
