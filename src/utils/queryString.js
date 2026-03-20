export const parseQueryString = (q_string = "") => {
  const entries = new URLSearchParams(q_string).entries();

  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }

  return result;
};
export const encodeObjectToQueryString = (obj = {}) =>
  new URLSearchParams(obj).toString();
