// Best Practices:  Date formatting is locale-specific.  This function assumes a specific format.
export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
