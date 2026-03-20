const stripNullFromObject = (object = {}) =>
  Object.entries(object).reduce((acc, [k, v]) => {
    if (Boolean(v)) {
      acc[k] = v;
    }
    return acc;
  }, {});

export default stripNullFromObject;
