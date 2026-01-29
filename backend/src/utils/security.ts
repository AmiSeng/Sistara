// src/utils/security.ts
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // high security but still fast

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};
