const { PLANS } = require("src/CONSTANTS");

const genArchives = () =>
  Object.values(PLANS).reduce((acc, curr) => {
    return { ...acc, [curr]: [] };
  }, {});

export default genArchives;
