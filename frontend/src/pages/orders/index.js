import { useEffect, useState, useRef } from "react";
import OrderList from "../../components/Order/OrderList";
import RequireAuth from "../../components/Auth/RequireAuth";
import axios from "axios";
import { useRouter } from "next/router";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const errorRef = useRef(null);
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setOrders(res.data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [API_URL]);

  return (
    <RequireAuth>
      <section aria-label="Order List" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 tabIndex={0}>Orders</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={fetchOrders} aria-label="Refresh Orders" disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => router.push('/orders/new')}
              aria-label="Add Order"
              style={{ background: '#0070f3', color: '#fff', fontWeight: 600, borderRadius: 6, padding: '8px 18px', fontSize: 16 }}
            >
              + Add Order
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
        {!loading && !error && orders.length > 0 && <OrderList orders={orders} />}
        {!loading && !orders.length && !error && (
          <div style={{ marginTop: 32, color: "#888" }}>No orders found.</div>
        )}
      </section>
    </RequireAuth>
  );
} 