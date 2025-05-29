import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RequireAuth from '../../components/Auth/RequireAuth';

export default function CampaignDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) return;
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const jwt = localStorage.getItem('jwt');
        const res = await axios.get(`${API_URL}/campaigns/${id}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        setCampaign(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch campaign');
      }
      setLoading(false);
    };
    fetchCampaign();
  }, [id, API_URL]);

  return (
    <RequireAuth>
      <section aria-label="Campaign Detail" style={{ maxWidth: 700, margin: "0 auto" }}>
        <button onClick={() => router.back()} style={{ marginBottom: 16 }}>&larr; Back</button>
        {loading && <div role="status">Loading...</div>}
        {error && <div role="alert">{error}</div>}
        {campaign && (
          <div style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #eee",
            padding: 24,
            marginTop: 16
          }}>
            <h2 tabIndex={0}>{campaign.name}</h2>
            <div><b>Status:</b> {campaign.status}</div>
            <div><b>Audience:</b> {campaign.audienceSize ?? 'N/A'}</div>
            <div><b>Sent:</b> {campaign.sent ?? 'N/A'}</div>
            <div><b>Failed:</b> {campaign.failed ?? 'N/A'}</div>
            <div><b>Message:</b> {campaign.message ?? 'N/A'}</div>
            <div><b>Created:</b> {campaign.createdAt ? new Date(campaign.createdAt).toLocaleString() : "N/A"}</div>
            <div style={{ marginTop: 16 }}>
              <b>Segment Rules:</b>
              <pre style={{ background: "#f8f8f8", padding: 12, borderRadius: 4 }}>
                {JSON.stringify(campaign.segmentRules, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </section>
    </RequireAuth>
  );
}