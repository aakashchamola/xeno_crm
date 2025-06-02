import React from "react";

export default function OrderList({ orders }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 16 }}>
      <table
        style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}
        aria-label="Orders Table"
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{o.order_id || o.orderId}</td>
              <td>{o.customer_id || o.customerId || '-'}</td>
              <td>{o.amount}</td>
              <td>{o.date ? new Date(o.date).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 