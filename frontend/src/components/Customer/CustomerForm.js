import { useState, useRef } from "react";
import axios from "axios";

export default function CustomerForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    spend: "",
    visits: "",
    last_active: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const errorRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  function validate(form) {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Valid email is required.";
    if (form.spend && isNaN(Number(form.spend))) return "Spend must be a number.";
    if (form.visits && isNaN(Number(form.visits))) return "Visits must be a number.";
    if (form.last_active && isNaN(Date.parse(form.last_active))) return "Last active must be a valid date.";
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
        `${API_URL}/customers`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          spend: form.spend ? Number(form.spend) : undefined,
          visits: form.visits ? Number(form.visits) : undefined,
          last_active: form.last_active || undefined
        },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setSuccess("Customer added!");
      setForm({ name: "", email: "", phone: "", spend: "", visits: "", last_active: "" });
      setError("");
      if (onCreated) onCreated();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Failed to add customer. Please try again."
      );
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add Customer Form" style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2 tabIndex={0}>Add Customer</h2>
      {error && <div role="alert" tabIndex={-1} ref={errorRef}>{error}</div>}
      {success && <div role="status">{success}</div>}
      <label htmlFor="customer-name">Name:</label>
      <input id="customer-name" name="name" value={form.name} onChange={handleChange} required aria-required="true" autoComplete="off" disabled={loading} />
      <br />
      <label htmlFor="customer-email">Email:</label>
      <input id="customer-email" name="email" value={form.email} onChange={handleChange} required aria-required="true" autoComplete="off" disabled={loading} type="email" />
      <br />
      <label htmlFor="customer-phone">Phone:</label>
      <input id="customer-phone" name="phone" value={form.phone} onChange={handleChange} autoComplete="off" disabled={loading} />
      <br />
      <label htmlFor="customer-spend">Spend:</label>
      <input id="customer-spend" name="spend" value={form.spend} onChange={handleChange} autoComplete="off" disabled={loading} type="number" min="0" />
      <br />
      <label htmlFor="customer-visits">Visits:</label>
      <input id="customer-visits" name="visits" value={form.visits} onChange={handleChange} autoComplete="off" disabled={loading} type="number" min="0" />
      <br />
      <label htmlFor="customer-last-active">Last Active:</label>
      <input id="customer-last-active" name="last_active" value={form.last_active} onChange={handleChange} autoComplete="off" disabled={loading} type="date" />
      <br />
      <button type="submit" disabled={loading} style={{ marginTop: 12 }} aria-label="Add Customer">
        {loading ? "Submitting..." : "Add Customer"}
      </button>
    </form>
  );
} 