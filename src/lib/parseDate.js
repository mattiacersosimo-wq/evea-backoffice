import moment from "src/utils/dayjs";
import { DATE_FORMAT } from "src/config";

const parseDate = (arg, inputFormat = "YYYY-MM-DD") =>
  arg ? moment(arg, inputFormat).format(DATE_FORMAT) : "-";

export default parseDate;
