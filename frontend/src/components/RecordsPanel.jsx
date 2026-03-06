import React from "react";

function EmptyState({ text }) {
  return <p className="records-empty">{text}</p>;
}

export default function RecordsPanel({ owners, vehicles, insurancePolicies }) {
  const recentOwners = owners.slice(0, 5);
  const recentVehicles = vehicles.slice(0, 5);
  const recentPolicies = insurancePolicies.slice(0, 5);

  return (
    <section className="records-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Live Records</p>
          <h2>Data Explorer</h2>
        </div>
        <p className="panel-copy">
          This section gives judges instant visibility into the latest records created
          through the demo interface.
        </p>
      </div>

      <div className="records-grid">
        <div className="records-card">
          <h3>Owners</h3>
          {recentOwners.length === 0 ? (
            <EmptyState text="No owners registered yet." />
          ) : (
            recentOwners.map((owner) => (
              <article key={owner.id} className="records-item">
                <strong>
                  #{owner.id} {owner.name}
                </strong>
                <span>{owner.email}</span>
                <span>{owner.phone_number}</span>
              </article>
            ))
          )}
        </div>

        <div className="records-card">
          <h3>Vehicles</h3>
          {recentVehicles.length === 0 ? (
            <EmptyState text="No vehicles registered yet." />
          ) : (
            recentVehicles.map((vehicle) => (
              <article key={vehicle.id} className="records-item">
                <strong>
                  #{vehicle.id} {vehicle.vehicle_number}
                </strong>
                <span>
                  {vehicle.manufacturer} {vehicle.model_name} • {vehicle.vehicle_type}
                </span>
                <span>Owner ID: {vehicle.owner_id}</span>
              </article>
            ))
          )}
        </div>

        <div className="records-card">
          <h3>Insurance</h3>
          {recentPolicies.length === 0 ? (
            <EmptyState text="No insurance policies registered yet." />
          ) : (
            recentPolicies.map((policy) => (
              <article key={policy.id} className="records-item">
                <strong>
                  #{policy.id} {policy.provider_name}
                </strong>
                <span>Policy: {policy.policy_number}</span>
                <span>
                  Vehicle ID: {policy.vehicle_id} • {policy.status}
                </span>
                <span>Expiry: {policy.expiry_date}</span>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
