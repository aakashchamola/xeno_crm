import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AddOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const errorRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setError('');
    setSuccess('');
    setCustomers([]);
    if (query.length > 2) {
      setSearchLoading(true);
      try {
        const jwt = localStorage.getItem('jwt');
        const res = await axios.get(
          `${API_URL}/customers/search?query=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        setCustomers(res.data);
      } catch (err) {
        setError('Failed to search customers. Please try again.');
        errorRef.current?.focus();
      }
      setSearchLoading(false);
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedCustomerId) {
      setError('Customer selection is required.');
      errorRef.current?.focus();
      return;
    }
    if (!amount || isNaN(Number(amount))) {
      setError('Amount must be a valid number.');
      errorRef.current?.focus();
      return;
    }
    if (!date) {
      setError('Date is required.');
      errorRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      await axios.post(
        `${API_URL}/orders`,
        {
          orderId: `ORD-${Date.now()}`, // Or let backend generate
          customerId: selectedCustomerId,
          amount: Number(amount),
          date
        },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setSuccess('Order added successfully!');
      setSearchQuery('');
      setCustomers([]);
      setSelectedCustomerId('');
      setAmount('');
      setDate('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add order. Please try again.');
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <button
        onClick={() => router.push('/orders')}
        style={{ marginBottom: 20, background: '#fff', color: '#0070f3', border: '2px solid #0070f3', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
        aria-label="Back to Orders"
      >
        &larr; Back to Orders
      </button>
      <form onSubmit={handleSubmit} aria-label="Add Order Form" style={{ maxWidth: 500, margin: '0 auto' }}>
        <h2 tabIndex={0}>Add Order</h2>
        {error && <div role="alert" tabIndex={-1} ref={errorRef}>{error}</div>}
        {success && <div role="status">{success}</div>}
        <label htmlFor="customerSearch">Search Customer:</label>
        <input
          id="customerSearch"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, phone, or email"
          autoComplete="off"
          disabled={loading}
        />
        {searchLoading && <div>Searching...</div>}
        {customers.length > 0 && (
          <ul>
            {customers.map((customer) => (
              <li
                key={customer.id}
                onClick={() => handleSelectCustomer(customer.id)}
                style={{
                  cursor: 'pointer',
                  background: selectedCustomerId === customer.id ? '#e0f7fa' : 'transparent'
                }}
              >
                {customer.name} - {customer.email} - {customer.phone}
              </li>
            ))}
          </ul>
        )}
        <br />
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          name="amount"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          autoComplete="off"
          disabled={loading}
        />
        <br />
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="datetime-local"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          autoComplete="off"
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            setDate(localISOTime);
          }}
          style={{ marginLeft: '8px' }}
          disabled={loading}
        >
          Now
        </button>
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: 12 }} aria-label="Add Order">
          {loading ? 'Submitting...' : 'Add Order'}
        </button>
        <div style={{ marginTop: 12, color: '#888', fontSize: 15 }}>
          Note: Order will only be created if the Customer ID exists.
        </div>
      </form>
    </div>
  );
};

export default AddOrder;