import moment from "moment";
import { DATE_FORMAT } from "src/config";
import Pastmonth from "src/images/admindasboard/past-month.png";
import PastweekIcon from "src/images/admindasboard/past-week.png";
import Thismonth from "src/images/admindasboard/this-month.png";
import ThisweekIcon from "src/images/admindasboard/this-week.png";
import Thisyear from "src/images/admindasboard/this-year.png";
import TodayIcon from "src/images/admindasboard/today.png";

const _data = {
  today: {
    icon: TodayIcon,
    title: "business.today",
    start_date: moment().format(DATE_FORMAT),
  },
  this_month: {
    icon: Thismonth,
    title: "business.thisMonth",
    start_date: moment().startOf("month").format(DATE_FORMAT),
    end_date: moment().endOf("month").format(DATE_FORMAT),
  },
  this_week: {
    icon: ThisweekIcon,
    title: "business.thisWeek",
    start_date: moment().startOf("week").format(DATE_FORMAT),
    end_date: moment().endOf("week").format(DATE_FORMAT),
  },
  past_month: {
    icon: Pastmonth,
    title: "business.pastMonth",
    start_date: moment()
      .subtract(1, "month")
      .startOf("month")
      .format(DATE_FORMAT),
    end_date: moment().subtract(1, "month").endOf("month").format(DATE_FORMAT),
  },
  past_week: {
    icon: PastweekIcon,
    title: "business.pastWeek",
    start_date: moment()
      .subtract(1, "week")
      .startOf("week")
      .format(DATE_FORMAT),
    end_date: moment().subtract(1, "week").endOf("week").format(DATE_FORMAT),
  },
  this_year: {
    icon: Thisyear,
    title: "business.thisYear",
    start_date: moment().startOf("year").format(DATE_FORMAT),
    end_date: moment().endOf("year").format(DATE_FORMAT),
  },
};

export default _data;
