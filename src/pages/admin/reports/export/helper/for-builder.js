const forBuilder = (data, line) => {
  const temp = {};
  temp.Line = line;
  temp.Username = data?.user?.username;
  temp.Email = data?.user?.email;
  temp.Amount = data?.amount;
  temp["Date Joined"] = data?.created_at;
  return temp;
};

export default forBuilder;
