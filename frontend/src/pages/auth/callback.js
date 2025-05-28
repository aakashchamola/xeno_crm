import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');
      if (token) {
        localStorage.setItem('jwt', token);
        const user = jwtDecode(token);
        localStorage.setItem('user', JSON.stringify(user));
        router.replace('/campaigns');
      } else {
        setError('No token found in callback URL.');
      }
    } catch (err) {
      setError('Invalid token or callback URL.');
    }
  }, [router]);

  if (error) return <div style={{ color: 'red' }}>Sign-in failed: {error}</div>;
  return <div>Signing in...</div>;
}