import CampaignForm from '../../components/Campaign/CampaignForm';
import { useRouter } from 'next/router';
// import Layout from '../../components/Layout/Layout';
import RequireAuth from '../../components/Auth/RequireAuth';

export default function NewCampaign() {
  const router = useRouter();
  return (
      <RequireAuth>
        <CampaignForm onCreated={() => router.push('/campaigns')} />
      </RequireAuth>
  );
}