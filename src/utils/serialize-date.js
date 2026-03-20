import moment from "moment";

const serializeDate = (date = null) => {
  if (date) {
    return moment(date).format("YYYY/MM/DD");
  }

  return null;
};

export default serializeDate;
