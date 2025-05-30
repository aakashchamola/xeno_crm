import axios from 'axios';

export function getApiClient() {
  const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  return axios.create({
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });
}

export async function handleApiError(apiCall) {
  try {
    return await apiCall();
  } catch (error) {
    if (error.response) {
      // Handle validation errors (400)
      if (error.response.status === 400) {
        throw new Error(error.response.data.error || 'Validation error occurred.');
      }
      // Handle unauthorized errors (401)
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      // Handle other errors
      throw new Error(error.response.data.error || 'An error occurred.');
    } else {
      throw new Error('Network error. Please try again later.');
    }
  }
}