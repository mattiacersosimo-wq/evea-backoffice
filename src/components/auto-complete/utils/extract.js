export const extractSingle = (v) => (v ? v.id : null);
export const extractMultiple = (v) => (v ? v.map(({ id }) => id) : []);
