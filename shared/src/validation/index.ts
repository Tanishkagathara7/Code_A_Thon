export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePassword = (password: string): string | null => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  return null;
};
