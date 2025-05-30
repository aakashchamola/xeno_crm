import { useState, useRef } from "react";
import axios from "axios";

export default function OrderForm({ onCreated }) {
  const [form, setForm] = useState({
    orderId: "",
    customerId: "",
    amount: "",
    date: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const errorRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  function validate(form) {
    if (!form.orderId.trim()) return "Order ID is required.";
    if (!form.customerId.trim()) return "Customer ID is required.";
    if (!form.amount || isNaN(Number(form.amount))) return "Amount must be a number.";
    if (!form.date || isNaN(Date.parse(form.date))) return "Date is required and must be valid.";
    return null;
  }

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validation = validate(form);
    if (validation) {
      setError(validation);
      errorRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt");
      await axios.post(
        `${API_URL}/orders`,
        {
          orderId: form.orderId,
          customerId: form.customerId,
          amount: Number(form.amount),
          date: form.date
        },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setSuccess("Order added! (Only if the customer exists.)");
      setForm({ orderId: "", customerId: "", amount: "", date: "" });
      setError("");
      if (onCreated) onCreated();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Failed to add order. Please try again."
      );
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add Order Form" style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2 tabIndex={0}>Add Order</h2>
      {error && <div role="alert" tabIndex={-1} ref={errorRef}>{error}</div>}
      {success && <div role="status">{success}</div>}
      <label htmlFor="order-id">Order ID:</label>
      <input id="order-id" name="orderId" value={form.orderId} onChange={handleChange} required aria-required="true" autoComplete="off" disabled={loading} />
      <br />
      <label htmlFor="order-customer-id">Customer ID:</label>
      <input id="order-customer-id" name="customerId" value={form.customerId} onChange={handleChange} required aria-required="true" autoComplete="off" disabled={loading} />
      <br />
      <label htmlFor="order-amount">Amount:</label>
      <input id="order-amount" name="amount" value={form.amount} onChange={handleChange} required aria-required="true" autoComplete="off" disabled={loading} type="number" min="0" step="0.01" />
      <br />
      <label htmlFor="order-date">Date:</label>
      <input id="order-date" name="date" value={form.date} onChange={handleChange} required aria-required="true" autoComplete="off" disabled={loading} type="datetime-local" />
      <br />
      <button type="submit" disabled={loading} style={{ marginTop: 12 }} aria-label="Add Order">
        {loading ? "Submitting..." : "Add Order"}
      </button>
      <div style={{ marginTop: 12, color: '#888', fontSize: 15 }}>
        Note: Order will only be created if the Customer ID exists.
      </div>
    </form>
  );
} 