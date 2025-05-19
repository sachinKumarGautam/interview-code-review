import { User } from "../types"; // Assume this type exists

// Best Practices:  Hardcoded API endpoint.  Should come from config.
const API_ENDPOINT = "https://example.com/api";

export const getUser = async (id: string): Promise<User> => {
  const response = await fetch(`${API_ENDPOINT}/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json();
};
