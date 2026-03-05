"use client";

export default function GlobalErrorRoute() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1 style={{ margin: 0 }}>Error</h1>
      <p style={{ marginTop: 12, opacity: 0.85 }}>
        This route exists to prevent prerender failures during CI. The real error
        handling is provided by src/app/global-error.tsx.
      </p>
    </main>
  );
}
