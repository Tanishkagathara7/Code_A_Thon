// Strong password validator: min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
export const validatePassword = (pass: string): string | null => {
  if (!pass || pass.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(pass)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(pass)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(pass)) {
    return 'Password must contain at least one number.';
  }
  if (!/[!@#$%^&*(),.?":{}|<>\-_=+[\]\\/~`]/.test(pass)) {
    return 'Password must contain at least one special character (!@#$%^&*...).';
  }
  return null;
};
