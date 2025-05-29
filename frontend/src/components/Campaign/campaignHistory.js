import { useEffect, useState } from "react";
import RequireAuth from "../Auth/RequireAuth";
import { useRouter } from "next/router";
import axios from "axios";

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
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
        setError("Failed to fetch campaigns.");
      }
      setLoading(false);
    };
    fetchCampaigns();
  }, [API_URL]);

  return (
    <RequireAuth>
      <section aria-label="Campaign History" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 tabIndex={0}>Campaign History</h2>
          <button onClick={() => router.push("/campaigns/new")} aria-label="Create New Campaign">
            + New Campaign
          </button>
        </div>
        {loading && <div role="status">Loading...</div>}
        {error && <div role="alert">{error}</div>}
        {!loading && !error && campaigns.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
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
                <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>
                    <a href={`/campaigns/${c.id}`} style={{ textDecoration: 'underline', color: '#0070f3' }}>
                      <b>{c.name}</b>
                    </a>
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
        )}
        {!loading && !campaigns.length && !error && (
          <div style={{ marginTop: 32, color: "#888" }}>No campaigns found. Click "New Campaign" to create one.</div>
        )}
      </section>
    </RequireAuth>
  );
}