export const required = (v) => v !== undefined && v !== null && String(v).trim().length > 0;

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

export const validatePhone = (phone) =>
  /^[+]?[\d\s\-()]{7,15}$/.test(String(phone).trim());

export const minLength = (v, len) => String(v).trim().length >= len;
export const maxLength = (v, len) => String(v).trim().length <= len;