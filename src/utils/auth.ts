export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};
