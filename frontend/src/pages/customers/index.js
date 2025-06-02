import { useEffect, useState, useRef } from "react";
import CustomerList from "../../components/Customer/CustomerList";
import RequireAuth from "../../components/Auth/RequireAuth";
import axios from "axios";
import { useRouter } from "next/router";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const errorRef = useRef(null);
  const router = useRouter();

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setCustomers(res.data);
    } catch (err) {
      setError("Failed to fetch customers. Please try again later.");
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [API_URL]);

  return (
    <RequireAuth>
      <section aria-label="Customer List" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 tabIndex={0}>Customers</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={fetchCustomers} aria-label="Refresh Customers" disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => router.push('/customers/new')}
              aria-label="Add Customer"
              style={{ background: '#0070f3', color: '#fff', fontWeight: 600, borderRadius: 6, padding: '8px 18px', fontSize: 16 }}
            >
              + Add Customer
            </button>
          </div>
        </div>
        {error && <div role="alert" tabIndex={-1} ref={errorRef} style={{ marginTop: 16 }}>{error}</div>}
        {loading && (
          <div role="status" aria-live="polite" style={{ marginTop: 32 }}>
            <div style={{ height: 40, background: '#eee', borderRadius: 4, marginBottom: 8, width: '100%' }} />
            <div style={{ height: 40, background: '#eee', borderRadius: 4, marginBottom: 8, width: '100%' }} />
            <div style={{ height: 40, background: '#eee', borderRadius: 4, marginBottom: 8, width: '100%' }} />
          </div>
        )}
        {!loading && !error && customers.length > 0 && <CustomerList customers={customers} />}
        {!loading && !customers.length && !error && (
          <div style={{ marginTop: 32, color: "#888" }}>No customers found.</div>
        )}
      </section>
    </RequireAuth>
  );
} 