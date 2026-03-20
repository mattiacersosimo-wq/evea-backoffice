export const getSingle = (options, selectedId) =>
  options.find(({ id }) => id === parseInt(selectedId)) || null;

export const getMultiple = (options, selectedId) =>
  options.filter(({ id }) => selectedId.includes(parseInt(id))) || [];
