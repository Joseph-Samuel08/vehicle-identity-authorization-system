import React, { useEffect, useState } from "react";

import { createInsurance, getApiErrorMessage } from "../api.js";

const initialForm = {
  vehicle_id: "",
  provider_name: "",
  policy_number: "",
  expiry_date: "",
  status: "ACTIVE",
};

export default function InsuranceForm({ latestVehicleId, onCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [createdInsurance, setCreatedInsurance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!latestVehicleId) {
      return;
    }

    setFormData((current) => {
      if (current.vehicle_id !== "") {
        return current;
      }

      return {
        ...current,
        vehicle_id: String(latestVehicleId),
      };
    });
  }, [latestVehicleId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createInsurance({
        ...formData,
        vehicle_id: formData.vehicle_id === "" ? undefined : Number(formData.vehicle_id),
      });
      setCreatedInsurance(response.data);
      setFormData(initialForm);
      if (onCreated) {
        onCreated(response.data);
      }
    } catch (error) {
      setCreatedInsurance(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Step 3</p>
          <h2>Insurance Registration</h2>
        </div>
        <p className="panel-copy">Add the policy that will be used during authorization.</p>
      </div>

      {latestVehicleId && (
        <p className="helper-copy">Latest registered vehicle ID: {latestVehicleId}</p>
      )}

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label>
          Vehicle ID
          <input
            name="vehicle_id"
            type="number"
            min="1"
            value={formData.vehicle_id}
            onChange={handleChange}
            placeholder={latestVehicleId ? String(latestVehicleId) : "1"}
            required
          />
        </label>

        <label>
          Provider Name
          <input
            name="provider_name"
            type="text"
            value={formData.provider_name}
            onChange={handleChange}
            placeholder="ICICI"
            required
          />
        </label>

        <label>
          Policy Number
          <input
            name="policy_number"
            type="text"
            value={formData.policy_number}
            onChange={handleChange}
            placeholder="ICICI-2027-0001"
            required
          />
        </label>

        <label>
          Expiry Date
          <input
            name="expiry_date"
            type="date"
            value={formData.expiry_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register Insurance"}
        </button>
      </form>

      {createdInsurance && (
        <div className="feedback success">
          <strong>Insurance created.</strong> Policy ID: {createdInsurance.id}
        </div>
      )}

      {errorMessage && <div className="feedback error">{errorMessage}</div>}
    </div>
  );
}
