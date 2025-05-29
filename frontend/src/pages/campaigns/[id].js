import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
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
        <section aria-label="Campaign Detail">
          {loading && <div role="status">Loading...</div>}
          {error && <div role="alert">{error}</div>}
          {campaign && (
            <>
              <h2 tabIndex={0}>{campaign.name}</h2>
              <div>Status: {campaign.status}</div>
              <div>Audience: {campaign.audienceSize ?? 'N/A'}</div>
              <div>Sent: {campaign.sent ?? 'N/A'}</div>
              <div>Failed: {campaign.failed ?? 'N/A'}</div>
              <div>Message: {campaign.message ?? 'N/A'}</div>
              {/* Add more fields as needed */}
            </>
          )}
        </section>
      </RequireAuth>
  );
}