import { jwtDecode } from 'jwt-decode';

export function getUserFromJWT() {
  const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  if (!jwt) return null;
  try {
    const user = jwtDecode(jwt);
    // Check expiry
    if (user.exp && Date.now() / 1000 > user.exp) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      return null;
    }
    return user;
  } catch {
    return null;
  }
}