const topEarners = (data, line) => {
  const temp = {};
  temp.Line = line;
  temp.Username = data?.user?.username;
  temp.Email = data?.user?.email;
  temp.Amount = data?.amount;
  return temp;
};

export default topEarners;
