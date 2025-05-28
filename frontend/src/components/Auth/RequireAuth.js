import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserFromJWT } from '../../utils/jwt';

export default function RequireAuth({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check for valid, non-expired JWT
    if (typeof window !== 'undefined') {
      const user = getUserFromJWT();
      if (!user) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        router.replace('/');
      }
    }
  }, [router]);

  return children;
}