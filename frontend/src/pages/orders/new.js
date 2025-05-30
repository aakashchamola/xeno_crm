import OrderForm from '../../components/Order/OrderForm';
import RequireAuth from '../../components/Auth/RequireAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewOrder() {
  const [created, setCreated] = useState(false);
  const router = useRouter();
  return (
    <RequireAuth>
      <OrderForm onCreated={() => setCreated(true)} />
      {created && (
        <div style={{ marginTop: 24 }}>
          <a href="/campaigns/new" style={{ marginRight: 16 }}>Create Campaign</a>
          <button onClick={() => setCreated(false)}>Add Another Order</button>
        </div>
      )}
    </RequireAuth>
  );
} 