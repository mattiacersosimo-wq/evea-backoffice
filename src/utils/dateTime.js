import moment from "moment";
import { DATE_FORMAT } from "src/config";

export const getClientTime = (time) => {
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (time) {
    const dateTime = moment(time).format(`${DATE_FORMAT} HH:mm`);
    return `${dateTime} / ${clientTimeZone}`;
  }

  return null;
};

export const getHostTime = (start_date, time, timezone) => {
  return `${moment(start_date).format(DATE_FORMAT)} ${time} / ${timezone}`;
};
