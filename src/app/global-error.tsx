'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h1>Application Error</h1>
        <p>An unexpected error occurred.</p>
        <button onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  )
}
