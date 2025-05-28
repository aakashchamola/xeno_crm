import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import RequireAuth from '../../components/Auth/RequireAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AI_URL = process.env.NEXT_PUBLIC_AI_URL;

export default function CampaignDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, [id]);

  const handleSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${AI_URL}/ai/performance-summary`, {
        stats: {
          sent: campaign.sent,
          failed: campaign.failed,
          audienceSize: campaign.audienceSize,
          status: campaign.status,
        }
      });
      setSummary(res.data.summary);
    } catch (err) {
      setError('Failed to get summary');
    }
    setLoading(false);
  };

  if (loading) return <Layout><div role="status">Loading...</div></Layout>;
  if (error) return <Layout><div role="alert">{error}</div></Layout>;
  if (!campaign) return null;

  return (
    <Layout>
      <RequireAuth>
        <section aria-label="Campaign Detail">
          <h2 tabIndex={0}>{campaign.name}</h2>
          <div>Status: {campaign.status}</div>
          <div>Audience: {campaign.audienceSize}</div>
          <div>Sent: {campaign.sent}</div>
          <div>Failed: {campaign.failed}</div>
          <div>Message: {campaign.message}</div>
          <button type="button" onClick={handleSummary} aria-label="Show AI-generated performance summary">
            Show AI Summary
          </button>
          {summary && <div style={{ marginTop: 8, background: '#f6f6f6', padding: 8 }} aria-live="polite">{summary}</div>}
        </section>
      </RequireAuth>
    </Layout>
  );
}