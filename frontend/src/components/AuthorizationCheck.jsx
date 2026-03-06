import React, { useEffect, useState } from "react";

import { checkAuthorization, getApiErrorMessage } from "../api.js";

export default function AuthorizationCheck({ latestVehicleId }) {
  const [vehicleId, setVehicleId] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (latestVehicleId && vehicleId === "") {
      setVehicleId(String(latestVehicleId));
    }
  }, [latestVehicleId, vehicleId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setChecking(true);
    setErrorMessage("");

    try {
      const response = await checkAuthorization(vehicleId);
      setResult(response.data);
    } catch (error) {
      setResult(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setChecking(false);
    }
  }

  const resultClass =
    result?.authorization_status === "AUTHORIZED" ? "authorized" : "blocked";

  return (
    <div className="panel-card panel-card-wide">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Step 4</p>
          <h2>Authorization Check</h2>
        </div>
        <p className="panel-copy">
          Verify whether a vehicle can interact with the connected platform.
        </p>
      </div>

      {latestVehicleId && (
        <p className="helper-copy">Latest registered vehicle ID: {latestVehicleId}</p>
      )}

      <form className="dashboard-form compact-form" onSubmit={handleSubmit}>
        <label>
          Vehicle ID
          <input
            type="number"
            min="1"
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            placeholder={latestVehicleId ? String(latestVehicleId) : "1"}
            required
          />
        </label>

        <button type="submit" disabled={checking}>
          {checking ? "Checking..." : "Check Authorization"}
        </button>
      </form>

      {result && (
        <div className={`auth-result ${resultClass}`}>
          <span className="auth-pill">{result.authorization_status}</span>
          <p>{result.message}</p>
        </div>
      )}

      {errorMessage && <div className="feedback error">{errorMessage}</div>}
    </div>
  );
}
