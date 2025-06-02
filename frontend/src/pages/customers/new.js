import CustomerForm from '../../components/Customer/CustomerForm';
import RequireAuth from '../../components/Auth/RequireAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewCustomer() {
  const [created, setCreated] = useState(false);
  const router = useRouter();
  return (
    <RequireAuth>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button
          onClick={() => router.push('/customers')}
          style={{ marginBottom: 20, background: '#fff', color: '#0070f3', border: '2px solid #0070f3', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
          aria-label="Back to Customers"
        >
          &larr; Back to Customers
        </button>
        <CustomerForm onCreated={() => setCreated(true)} />
        {created && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 32,
            }}
          >
            <a
              href="/campaigns/new"
              style={{
                background: '#0070f3',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: 6,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 17,
                boxShadow: '0 2px 8px #e0e0e0',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#005bb5')}
              onMouseOut={e => (e.currentTarget.style.background = '#0070f3')}
              tabIndex={0}
              aria-label="Create Campaign"
            >
              + Create Campaign
            </a>
            <button
              onClick={() => setCreated(false)}
              style={{
                background: '#fff',
                color: '#0070f3',
                border: '2px solid #0070f3',
                padding: '10px 24px',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 17,
                boxShadow: '0 2px 8px #e0e0e0',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#f0f8ff';
                e.currentTarget.style.color = '#005bb5';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#0070f3';
              }}
              aria-label="Add Another Customer"
            >
              + Add Another Customer
            </button>
          </div>
        )}
      </div>
    </RequireAuth>
  );
} 