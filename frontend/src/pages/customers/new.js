import CustomerForm from '../../components/Customer/CustomerForm';
import RequireAuth from '../../components/Auth/RequireAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewCustomer() {
  const [created, setCreated] = useState(false);
  const router = useRouter();
  return (
    <RequireAuth>
      <CustomerForm onCreated={() => setCreated(true)} />
      {created && (
        <div style={{ marginTop: 24 }}>
          <a href="/campaigns/new" style={{ marginRight: 16 }}>Create Campaign</a>
          <button onClick={() => setCreated(false)}>Add Another Customer</button>
        </div>
      )}
    </RequireAuth>
  );
} 