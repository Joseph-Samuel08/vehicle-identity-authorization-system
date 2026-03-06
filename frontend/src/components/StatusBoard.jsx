import React from "react";

export default function StatusBoard({
  health,
  counts,
  loading,
  errorMessage,
  onRefresh,
}) {
  const statusText = health?.status || "checking";
  const statusClass =
    health?.status === "system operational" ? "status-positive" : "status-neutral";

  return (
    <section className="status-board">
      <div className="status-header">
        <div>
          <p className="eyebrow">Live System Snapshot</p>
          <h2>Demo Readiness</h2>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      <div className="status-grid">
        <div className="status-card status-card-wide">
          <span className={`status-pill ${statusClass}`}>{statusText}</span>
          <h3>{health?.service || "Vehicle Identity Authorization System"}</h3>
          <p>
            Judges can validate backend availability immediately before running the
            owner, vehicle, insurance, and authorization flow.
          </p>
        </div>

        <div className="status-card">
          <span className="metric-label">Owners</span>
          <strong>{counts.owners}</strong>
          <p>Registered identity holders currently in the system.</p>
        </div>

        <div className="status-card">
          <span className="metric-label">Vehicles</span>
          <strong>{counts.vehicles}</strong>
          <p>Vehicle identities currently available for authorization.</p>
        </div>

        <div className="status-card">
          <span className="metric-label">Insurance</span>
          <strong>{counts.insurance}</strong>
          <p>Policies available to satisfy compliance checks.</p>
        </div>
      </div>

      {errorMessage && <div className="feedback error">{errorMessage}</div>}
    </section>
  );
}
