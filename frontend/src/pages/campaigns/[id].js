import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import RequireAuth from '../../components/Auth/RequireAuth';

export default function CampaignDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const errorRef = useRef(null);

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
        if (err.response && err.response.status === 404) {
          setError('Campaign not found.');
        } else {
          setError('Failed to fetch campaign. Please try again later.');
        }
        errorRef.current?.focus();
      }
      setLoading(false);
    };
    fetchCampaign();
  }, [id, API_URL]);

  return (
    <RequireAuth>
      <section aria-label="Campaign Detail" style={{ maxWidth: 700, margin: "0 auto" }}>
        <button
          onClick={() => router.back()}
          style={{ marginBottom: 16, fontSize: 16, padding: '6px 16px', borderRadius: 4, background: '#f0f0f0', color: '#0070f3', border: 'none', cursor: 'pointer' }}
          aria-label="Go back"
        >
          &larr; Back
        </button>
        {loading && <div role="status" aria-live="polite">Loading...</div>}
        {error && <div role="alert" tabIndex={-1} ref={errorRef} style={{ color: '#b00020', background: '#fff0f0', padding: 12, borderRadius: 6, marginTop: 16 }}>{error}</div>}
        {campaign && (
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px #e0e0e0",
            padding: 32,
            marginTop: 16,
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            wordBreak: 'break-word'
          }}>
            <h2 tabIndex={0} style={{ fontSize: 28, marginBottom: 12 }}>{campaign.name}</h2>
            <div style={{ marginBottom: 8 }}><b>Status:</b> {campaign.status}</div>
            <div style={{ marginBottom: 8 }}><b>Audience:</b> {campaign.audienceSize ?? 'N/A'}</div>
            <div style={{ marginBottom: 8 }}><b>Sent:</b> {campaign.sent ?? 'N/A'}</div>
            <div style={{ marginBottom: 8 }}><b>Failed:</b> {campaign.failed ?? 'N/A'}</div>
            <div style={{ marginBottom: 8 }}><b>Message:</b> {campaign.message ?? 'N/A'}</div>
            <div style={{ marginBottom: 8 }}><b>Created:</b> {campaign.createdAt ? new Date(campaign.createdAt).toLocaleString() : "N/A"}</div>
            <div style={{ marginTop: 16 }}>
              <b>Segment Rules:</b>
              <pre style={{ background: "#f8f8f8", padding: 12, borderRadius: 4, fontSize: 15, overflowX: 'auto' }} aria-label="Segment Rules">
                {JSON.stringify(campaign.segmentRules, null, 2)}
              </pre>
            </div>
          </div>
        )}
        <style jsx>{`
          @media (max-width: 700px) {
            div[aria-label="Campaign Detail"] > div {
              padding: 12px !important;
            }
            h2 { font-size: 22px !important; }
          }
        `}</style>
      </section>
    </RequireAuth>
  );
}