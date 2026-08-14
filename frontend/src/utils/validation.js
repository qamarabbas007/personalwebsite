export const isValidEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isRequired = (value) => value !== undefined && value !== null && String(value).trim().length > 0;

export const minLength = (value = "", len = 0) => String(value).trim().length >= len;

export const validateContactForm = ({ name, email, message }) => {
  const errors = {};
  if (!isRequired(name)) errors.name = "Name is required";
  if (!isRequired(email) || !isValidEmail(email)) errors.email = "A valid email is required";
  if (!isRequired(message) || !minLength(message, 10)) errors.message = "Message should be at least 10 characters";
  return errors;
};
