import React from "react";

export default function CustomerList({ customers }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 16 }}>
      <table
        style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}
        aria-label="Customers Table"
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Spend</th>
            <th>Visits</th>
            <th>Last Active</th>
            <th>Last Purchase Date</th>
            <th>Inactive Days</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{c.customer_id || '-'}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone || '-'}</td>
              <td>{c.spend ?? 0}</td>
              <td>{c.visits ?? 0}</td>
              <td>{c.last_active ? new Date(c.last_active).toLocaleDateString() : '-'}</td>
              <td>{c.last_purchase_date ? new Date(c.last_purchase_date).toLocaleDateString() : '-'}</td>
              <td>{c.inactive_days ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 