import React, { useState } from "react";

import { createOwner, getApiErrorMessage } from "../api.js";

const initialForm = {
  name: "",
  email: "",
  phone_number: "",
};

export default function OwnerForm({ onCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [createdOwner, setCreatedOwner] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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
      const response = await createOwner(formData);
      setCreatedOwner(response.data);
      setFormData(initialForm);
      if (onCreated) {
        onCreated(response.data);
      }
    } catch (error) {
      setCreatedOwner(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Step 1</p>
          <h2>Owner Registration</h2>
        </div>
        <p className="panel-copy">Register the person responsible for the vehicle.</p>
      </div>

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            name="phone_number"
            type="text"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+91-9876543210"
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register Owner"}
        </button>
      </form>

      {createdOwner && (
        <div className="feedback success">
          <strong>Owner created.</strong> Owner ID: {createdOwner.id}
        </div>
      )}

      {errorMessage && <div className="feedback error">{errorMessage}</div>}
    </div>
  );
}
