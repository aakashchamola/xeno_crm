import axios from 'axios';

export function getApiClient() {
  const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  return axios.create({
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });
}