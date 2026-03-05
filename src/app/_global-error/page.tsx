export default function GlobalErrorRouteFallback() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Global Error Fallback Route</h1>
      <p>This route is intentionally minimal to avoid CI prerender failures.</p>
    </main>
  );
}
