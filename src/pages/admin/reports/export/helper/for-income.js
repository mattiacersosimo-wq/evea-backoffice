import { capitalCase } from "change-case";

const forIncome = (data, line) => {
  const temp = {};
  temp.Line = line;
  temp.Username = data?.user?.username;
  temp["Bonus Type"] = capitalCase(data?.payment_type);
  temp.Amount = data?.total_amount;
  temp["Date Joined"] = data?.created_at;
  return temp;
};

export default forIncome;
