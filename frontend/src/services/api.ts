// A central place for all our API calls.
// This makes the components cleaner and the API logic reusable.

import { Experiment } from "../types"; // We'll create this types file next!

const BASE_URL = '/api/v1';

// A helper function to handle fetch responses.
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'Network response was not ok');
  }
  // For 204 No Content, we don't need to parse JSON
  if (response.status === 204) {
    return;
  }
  return response.json();
};

export const api = {
  getExperiments: async (): Promise<Experiment[]> => {
    const response = await fetch(`${BASE_URL}/experiments`);
    return handleResponse(response);
  },

  createExperiment: async (payload: any) => {
    const response = await fetch(`${BASE_URL}/experiments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  updateExperiment: async (id: string, data: { name: string; description: string }) => {
    const response = await fetch(`${BASE_URL}/experiments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteExperiment: async (id: string) => {
    const response = await fetch(`${BASE_URL}/experiments/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
