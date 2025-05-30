import { useEffect, useState, useRef } from "react";
import RequireAuth from "../Auth/RequireAuth";
import { useRouter } from "next/router";
import axios from "axios";

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const errorRef = useRef(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError("");
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`${API_URL}/campaigns`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setCampaigns(res.data);
    } catch (err) {
      setError("Failed to fetch campaigns. Please try again later.");
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
  }, [API_URL]);

  return (
    <RequireAuth>
      <section aria-label="Campaign History" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 tabIndex={0}>Campaign History</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={fetchCampaigns} aria-label="Refresh Campaigns" disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={() => router.push("/campaigns/new")} aria-label="Create New Campaign">
              + New Campaign
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
        {!loading && !error && campaigns.length > 0 && (
          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table
              style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}
              aria-label="Campaigns Table"
            >
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Audience</th>
                  <th>Sent</th>
                  <th>Failed</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: "1px solid #eee", cursor: "pointer" }}
                    tabIndex={0}
                    onClick={() => router.push(`/campaigns/${c.id}`)}
                    onKeyDown={e => { if (e.key === 'Enter') router.push(`/campaigns/${c.id}`); }}
                    aria-label={`View campaign ${c.name}`}
                    className="campaign-row"
                  >
                    <td>
                      <span style={{ textDecoration: 'underline', color: '#0070f3', fontWeight: 600 }}>{c.name}</span>
                    </td>
                    <td>{c.status}</td>
                    <td>{c.audienceSize ?? 'N/A'}</td>
                    <td>{c.sent ?? 'N/A'}</td>
                    <td>{c.failed ?? 'N/A'}</td>
                    <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <style jsx>{`
              .campaign-row:hover {
                background: #f5faff;
                transition: background 0.2s;
              }
              @media (max-width: 700px) {
                table, thead, tbody, th, td, tr { font-size: 15px; }
                th, td { padding: 6px 6px; }
              }
            `}</style>
          </div>
        )}
        {!loading && !campaigns.length && !error && (
          <div style={{ marginTop: 32, color: "#888" }}>No campaigns found. Click "New Campaign" to create one.</div>
        )}
      </section>
    </RequireAuth>
  );
}