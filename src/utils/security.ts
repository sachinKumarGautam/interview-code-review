//  Security:  Inadequate output sanitization leading to potential XSS.
export const unsafeNameDisplay = (name: string): string => {
  return `<div>Unsafe Name Display: ${name}</div>`;
};
