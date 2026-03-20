const round =
  (precision) =>
  (number = 0) => {
    if (isNaN(number)) return 0;
    return parseFloat(parseFloat(number).toFixed(precision));
  };

export const twoPlaceRound = round(2);
