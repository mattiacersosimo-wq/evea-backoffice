import moment from "src/utils/dayjs";

const getThreeYearsFromNow = () => moment().add(3, "years");

export default getThreeYearsFromNow;
