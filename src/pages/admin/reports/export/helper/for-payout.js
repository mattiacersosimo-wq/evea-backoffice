import { capitalCase } from "change-case";

const forPayout = (data, line) => {
  const temp = {};
  temp.Line = line;
  temp.Username = data?.user?.username;
  temp["Full Name"] = (data?.user_profile?.first_name)(
    data?.user_profile?.last_name
  );
  temp.Status = capitalCase(data?.status);
  temp["Requested Amount"] = data.user_coin_address?.address;
  temp["Requested Amount"] = data?.amount;
  temp["Admin Fee Deducted"] = data?.admin_fee_deducted;
  temp["Amount Released	"] = data?.released_amount;
  temp["Date Joined"] = data?.created_at;
  temp["Coin"] = data?.available_coin?.name;
  temp["Date"] = data.created_at;
  return temp;
};

export default forPayout;
