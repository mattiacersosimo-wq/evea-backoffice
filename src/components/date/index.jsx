import parseDate from "src/lib/parseDate";

const ParseDate = ({ date, format = null }) => (
  <span style={{ whiteSpace: "nowrap" }}>{parseDate(date, format)}</span>
);

export const CreatedDate = ({ date }) => (
  <ParseDate date={date} format="YYYY/MM/DD" />
);

export default ParseDate;
