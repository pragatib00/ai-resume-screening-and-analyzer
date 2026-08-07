const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,59}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export function validateName(name) {
  const trimmed = (name || "").trim();

  if (!trimmed) return "Full name is required.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (!NAME_REGEX.test(trimmed)) {
    return "Name can only contain letters, spaces, apostrophes and hyphens.";
  }
  return "";
}

export function validateEmail(email) {
  const trimmed = (email || "").trim();

  if (!trimmed) return "Email is required.";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
  return "";
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return "";
}

export function validateRequired(value, label) {
  if (!(value || "").trim()) return `${label} is required.`;
  return "";
}
