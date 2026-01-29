// src/utils/validators.ts

export const isValidName = (name: string) => {
  // letters + spaces only
  return /^[A-Za-z\s]{2,50}$/.test(name);
};

export const isValidEthiopianPhone = (phone: string) => {
  // +2519XXXXXXXX or 09XXXXXXXX
  return /^(?:\+2519\d{8}|09\d{8})$/.test(phone);
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isStrongPassword = (password: string) => {
  // min 8, 1 upper, 1 lower, 1 digit
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};
