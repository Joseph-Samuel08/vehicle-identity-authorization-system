// Demo dashboard entry point for the Vehicle Identity Authorization System.
import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import AuthorizationCheck from "./components/AuthorizationCheck.jsx";
import InsuranceForm from "./components/InsuranceForm.jsx";
import OwnerForm from "./components/OwnerForm.jsx";
import VehicleForm from "./components/VehicleForm.jsx";

const styles = `
  :root {
    --canvas: #f4efe6;
    --canvas-dark: #e7dcc9;
    --surface: rgba(255, 252, 245, 0.9);
    --surface-strong: #fffdf8;
    --ink: #16302b;
    --muted: #5f655e;
    --line: rgba(22, 48, 43, 0.14);
    --accent: #0d7a6f;
    --accent-soft: rgba(13, 122, 111, 0.14);
    --warm: #e4a34b;
    --success: #0a7a57;
    --success-soft: rgba(10, 122, 87, 0.12);
    --danger: #b44e3d;
    --danger-soft: rgba(180, 78, 61, 0.14);
    --shadow: 0 24px 60px rgba(42, 38, 29, 0.12);
  }

  * {
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    font-family: "Avenir Next", "Trebuchet MS", sans-serif;
    color: var(--ink);
    background:
      radial-gradient(circle at top left, rgba(228, 163, 75, 0.22), transparent 36%),
      radial-gradient(circle at bottom right, rgba(13, 122, 111, 0.18), transparent 32%),
      linear-gradient(145deg, var(--canvas) 0%, var(--canvas-dark) 100%);
  }

  button, input, select {
    font: inherit;
  }

  .dashboard-shell {
    width: min(1180px, calc(100vw - 32px));
    margin: 0 auto;
    padding: 32px 0 48px;
  }

  .hero {
    position: relative;
    overflow: hidden;
    padding: 28px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 28px;
    background:
      linear-gradient(135deg, rgba(255, 253, 248, 0.96), rgba(255, 248, 236, 0.86));
    box-shadow: var(--shadow);
  }

  .hero::after {
    content: "";
    position: absolute;
    inset: auto -80px -100px auto;
    width: 240px;
    height: 240px;
    border-radius: 999px;
    background: rgba(13, 122, 111, 0.08);
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 0.86rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .hero h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.4rem);
    line-height: 1.05;
  }

  .hero p {
    max-width: 720px;
    margin: 14px 0 0;
    color: var(--muted);
    line-height: 1.65;
  }

  .flow-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 24px;
  }

  .flow-step {
    padding: 14px 16px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.56);
  }

  .flow-step strong {
    display: block;
    margin-bottom: 6px;
    font-size: 0.95rem;
  }

  .flow-step span {
    color: var(--muted);
    font-size: 0.92rem;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-top: 24px;
  }

  .panel-card {
    padding: 22px;
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: 24px;
    background: var(--surface);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow);
  }

  .panel-card-wide {
    grid-column: 1 / -1;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .panel-header h2 {
    margin: 4px 0 0;
    font-size: 1.35rem;
  }

  .panel-copy {
    max-width: 300px;
    margin: 0;
    color: var(--muted);
    line-height: 1.55;
    text-align: right;
  }

  .eyebrow {
    margin: 0;
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .helper-copy {
    margin: -2px 0 18px;
    color: var(--muted);
    font-size: 0.93rem;
  }

  .dashboard-form {
    display: grid;
    gap: 14px;
  }

  .compact-form {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .dashboard-form label {
    display: grid;
    gap: 8px;
    font-size: 0.92rem;
    font-weight: 700;
  }

  .dashboard-form input,
  .dashboard-form select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--surface-strong);
    color: var(--ink);
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  }

  .dashboard-form input:focus,
  .dashboard-form select:focus {
    border-color: rgba(13, 122, 111, 0.5);
    box-shadow: 0 0 0 4px rgba(13, 122, 111, 0.08);
    transform: translateY(-1px);
  }

  .dashboard-form button {
    padding: 13px 16px;
    border: 0;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--accent), #159884);
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  }

  .dashboard-form button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 14px 24px rgba(13, 122, 111, 0.22);
  }

  .dashboard-form button:disabled {
    opacity: 0.72;
    cursor: wait;
  }

  .feedback {
    margin-top: 16px;
    padding: 14px 16px;
    border-radius: 16px;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .feedback.success {
    background: var(--success-soft);
    color: var(--success);
  }

  .feedback.error {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .auth-result {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 18px;
    padding: 18px;
    border-radius: 20px;
  }

  .auth-result.authorized {
    background: var(--success-soft);
    color: var(--success);
  }

  .auth-result.blocked {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .auth-pill {
    min-width: 120px;
    padding: 10px 14px;
    border-radius: 999px;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.58);
  }

  .auth-result p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
  }

  .dashboard-footer {
    margin-top: 18px;
    color: var(--muted);
    font-size: 0.92rem;
    text-align: center;
  }

  @media (max-width: 900px) {
    .flow-row,
    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .panel-header {
      flex-direction: column;
    }

    .panel-copy {
      max-width: none;
      text-align: left;
    }

    .compact-form {
      grid-template-columns: 1fr;
    }
  }
`;

function App() {
  const [latestOwnerId, setLatestOwnerId] = useState(null);
  const [latestVehicleId, setLatestVehicleId] = useState(null);

  return (
    <>
      <style>{styles}</style>

      <div className="dashboard-shell">
        <section className="hero">
          <div className="hero-badge">Demo Dashboard</div>
          <h1>Vehicle Identity Authorization System</h1>
          <p>
            Use this interface to register an owner, add a vehicle, attach insurance,
            and then check whether the vehicle is authorized to interact with the
            connected platform.
          </p>

          <div className="flow-row">
            <div className="flow-step">
              <strong>1. Create Owner</strong>
              <span>Capture the person or entity that owns the vehicle.</span>
            </div>
            <div className="flow-step">
              <strong>2. Register Vehicle</strong>
              <span>Link the vehicle identity to an existing owner ID.</span>
            </div>
            <div className="flow-step">
              <strong>3. Add Insurance</strong>
              <span>Provide an active policy so compliance checks can pass.</span>
            </div>
            <div className="flow-step">
              <strong>4. Check Authorization</strong>
              <span>See whether the vehicle is AUTHORIZED or BLOCKED.</span>
            </div>
          </div>
        </section>

        <main className="dashboard-grid">
          <OwnerForm onCreated={(owner) => setLatestOwnerId(owner.id)} />
          <VehicleForm
            latestOwnerId={latestOwnerId}
            onCreated={(vehicle) => setLatestVehicleId(vehicle.id)}
          />
          <InsuranceForm latestVehicleId={latestVehicleId} />
          <AuthorizationCheck latestVehicleId={latestVehicleId} />
        </main>

        <p className="dashboard-footer">
          Backend API target: <strong>http://localhost:8000</strong>
        </p>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
