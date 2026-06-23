import moment from "moment";

const convertDMYToMDY = (dateToConvert = "") => {
  if (Boolean(dateToConvert))
    return moment(dateToConvert, "DD/MM/YYYY").format("MM/DD/YYYY");

  return null;
};

export const convertMDYToDMY = (dateToConvert = "") => {
  if (Boolean(dateToConvert))
    return moment(dateToConvert, "MM/DD/YYYY").format("DD/MM/YYYY");

  return null;
};

export default convertDMYToMDY;
