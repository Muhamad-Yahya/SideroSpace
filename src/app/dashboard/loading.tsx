// Dashboard loading skeleton — shown immediately on navigation while
// getDashboardAnalytics() resolves server-side. Next.js wraps page.tsx
// in a <Suspense> boundary using this file as the fallback.

export default function DashboardLoading() {
  return (
    <main className="research-dashboard" aria-busy="true" aria-label="Loading dashboard">
      {/* Hero skeleton */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <div
            className="animate-pulse rounded-lg bg-white/[0.06]"
            style={{ height: "3.5rem", width: "60%", marginBottom: "1rem" }}
          />
          <div
            className="animate-pulse rounded bg-white/[0.04]"
            style={{ height: "1rem", width: "90%", marginBottom: "0.5rem" }}
          />
          <div
            className="animate-pulse rounded bg-white/[0.04]"
            style={{ height: "1rem", width: "75%", marginBottom: "1.5rem" }}
          />
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div
              className="animate-pulse rounded-lg bg-white/[0.08]"
              style={{ height: "2.25rem", width: "10rem" }}
            />
            <div
              className="animate-pulse rounded-lg bg-white/[0.05]"
              style={{ height: "2.25rem", width: "9rem" }}
            />
          </div>
        </div>
        <figure className="dashboard-hero-visual" aria-hidden="true">
          <div
            className="animate-pulse"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.03)",
              borderRadius: "inherit",
            }}
          />
        </figure>
      </section>

      {/* Experiment cards skeleton */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <div
              className="animate-pulse rounded bg-white/[0.04]"
              style={{ height: "0.75rem", width: "8rem", marginBottom: "0.5rem" }}
            />
            <div
              className="animate-pulse rounded-lg bg-white/[0.06]"
              style={{ height: "1.75rem", width: "14rem" }}
            />
          </div>
        </div>
        <div className="experiment-card-grid">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl"
              style={{
                background: "var(--panel, #10141e)",
                border: "1px solid rgba(255,255,255,0.06)",
                height: "22rem",
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Insights skeleton */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <div
              className="animate-pulse rounded bg-white/[0.04]"
              style={{ height: "0.75rem", width: "10rem", marginBottom: "0.5rem" }}
            />
            <div
              className="animate-pulse rounded-lg bg-white/[0.06]"
              style={{ height: "1.75rem", width: "18rem" }}
            />
          </div>
        </div>
        <div className="featured-insight-grid">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl"
              style={{
                background: "var(--panel, #10141e)",
                border: "1px solid rgba(255,255,255,0.06)",
                height: "10rem",
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
