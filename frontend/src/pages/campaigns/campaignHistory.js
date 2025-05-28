import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import RequireAuth from '../../components/Auth/RequireAuth';

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const jwt = localStorage.getItem('jwt');
        const res = await axios.get(`${API_URL}/campaigns`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        setCampaigns(
          (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setError('');
      } catch (err) {
        setError('Failed to fetch campaigns');
      }
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  return (
    <Layout>
      <RequireAuth>
        <section aria-label="Campaign History">
          <h2 tabIndex={0}>Campaign History</h2>
          {loading && <div role="status">Loading...</div>}
          {error && <div role="alert">{error}</div>}
          <ul>
            {campaigns.map(c => (
              <li key={c.id}>
                <a href={`/campaigns/${c.id}`} style={{ textDecoration: 'underline', color: '#0070f3' }}>
                  <b>{c.name}</b>
                </a>
                {' — Status: '}{c.status}
                {' — Audience: '}{c.audienceSize ?? 'N/A'}
                {' — Sent: '}{c.sent ?? 'N/A'}
                {' — Failed: '}{c.failed ?? 'N/A'}
              </li>
            ))}
          </ul>
          {!loading && !campaigns.length && !error && (
            <div>No campaigns found.</div>
          )}
        </section>
      </RequireAuth>
    </Layout>
  );
}