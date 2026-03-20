const forDebit = (data, line) => {
  const temp = {};
  temp.Line = line;
  temp.Username = data?.user?.username;
  temp.Email = data?.user?.email;
  temp.Amount = data?.total_amount;
  temp["Payment Method"] = data?.wallet_type;
  temp.Note = data?.note;
  temp["Date Joined"] = data?.created_at;
  return temp;
};

export default forDebit;
