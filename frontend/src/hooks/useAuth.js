import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const userStr = localStorage.getItem('user');
    if (jwt && userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return user;
}