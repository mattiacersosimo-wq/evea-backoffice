export const isValidString = (arg) => {
  if (!arg.length) return true;
  return /^[a-z\s]+$/i.test(arg);
};

export const isValidNumber = (arg) => {
  if (!arg.length) return true;
  return /^[\d]+$/.test(arg);
};
