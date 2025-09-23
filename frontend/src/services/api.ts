import { Experiment } from "../types";

const BASE_URL = '/api/v1';

// Helper to get the auth token from localStorage and build headers.
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper to handle API responses and errors.
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // If we get a 401 Unauthorized, the token is bad, so log the user out.
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/'; // Go back to login page
    }
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'Network response was not ok');
  }
  if (response.status === 204) {
    return;
  }
  return response.json();
};

export const api = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // --- THIS IS THE FIX ---
  // We now use getAuthHeaders() to send the token with this request.
  getExperiments: async (): Promise<Experiment[]> => {
    const response = await fetch(`${BASE_URL}/experiments`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createExperiment: async (payload: any) => {
    const response = await fetch(`${BASE_URL}/experiments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  updateExperiment: async (id: string, data: { name: string; description: string }) => {
    const response = await fetch(`${BASE_URL}/experiments/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteExperiment: async (id: string) => {
    const response = await fetch(`${BASE_URL}/experiments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

