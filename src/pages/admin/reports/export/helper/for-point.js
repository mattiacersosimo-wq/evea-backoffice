import { capitalCase } from "change-case";

const forPoint = (data, line) => {
  const temp = {};
  temp.Line = line;
  temp.Username = data?.user?.username;
  temp.Leg = data?.leg;
  temp.PV = data?.pv;
  temp["Date Joined"] = data?.created_at;

  return temp;
};

export default forPoint;
