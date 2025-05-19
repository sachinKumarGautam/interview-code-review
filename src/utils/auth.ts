// Security:  Storing sensitive data in localStorage (vulnerable to XSS).
export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

// Best Practices:  Function does not handle the case where the token might be expired or invalid.
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};
