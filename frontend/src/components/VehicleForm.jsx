import React, { useEffect, useState } from "react";

import { createVehicle, getApiErrorMessage } from "../api.js";

const initialForm = {
  vehicle_number: "",
  vehicle_type: "",
  manufacturer: "",
  model_name: "",
  manufacture_year: "",
  owner_id: "",
};

export default function VehicleForm({ latestOwnerId, onCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [createdVehicle, setCreatedVehicle] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!latestOwnerId) {
      return;
    }

    setFormData((current) => {
      if (current.owner_id !== "") {
        return current;
      }

      return {
        ...current,
        owner_id: String(latestOwnerId),
      };
    });
  }, [latestOwnerId]);

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
      const response = await createVehicle({
        ...formData,
        manufacture_year:
          formData.manufacture_year === "" ? undefined : Number(formData.manufacture_year),
        owner_id: formData.owner_id === "" ? undefined : Number(formData.owner_id),
      });
      setCreatedVehicle(response.data);
      setFormData(initialForm);
      if (onCreated) {
        onCreated(response.data);
      }
    } catch (error) {
      setCreatedVehicle(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Step 2</p>
          <h2>Vehicle Registration</h2>
        </div>
        <p className="panel-copy">Attach a vehicle identity record to an existing owner.</p>
      </div>

      {latestOwnerId && (
        <p className="helper-copy">Latest registered owner ID: {latestOwnerId}</p>
      )}

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label>
          Vehicle Number
          <input
            name="vehicle_number"
            type="text"
            value={formData.vehicle_number}
            onChange={handleChange}
            placeholder="TN09AB1234"
            required
          />
        </label>

        <label>
          Vehicle Type
          <input
            name="vehicle_type"
            type="text"
            value={formData.vehicle_type}
            onChange={handleChange}
            placeholder="Car"
            required
          />
        </label>

        <label>
          Manufacturer
          <input
            name="manufacturer"
            type="text"
            value={formData.manufacturer}
            onChange={handleChange}
            placeholder="Hyundai"
            required
          />
        </label>

        <label>
          Model Name
          <input
            name="model_name"
            type="text"
            value={formData.model_name}
            onChange={handleChange}
            placeholder="i20"
            required
          />
        </label>

        <label>
          Manufacture Year
          <input
            name="manufacture_year"
            type="number"
            min="1990"
            value={formData.manufacture_year}
            onChange={handleChange}
            placeholder="2023"
            required
          />
        </label>

        <label>
          Owner ID
          <input
            name="owner_id"
            type="number"
            min="1"
            value={formData.owner_id}
            onChange={handleChange}
            placeholder={latestOwnerId ? String(latestOwnerId) : "1"}
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register Vehicle"}
        </button>
      </form>

      {createdVehicle && (
        <div className="feedback success">
          <strong>Vehicle created.</strong> Vehicle ID: {createdVehicle.id}
        </div>
      )}

      {errorMessage && <div className="feedback error">{errorMessage}</div>}
    </div>
  );
}
