const forJoining = (data, line) => {
  const temp = {};
  temp.Line = line;
  temp.Username = data?.username;
  temp.Email = data?.email;
  temp.Sponsor = data?.sponsor?.user?.username;
  temp["Date Joined"] = data?.created_at;
  return temp;
};

export default forJoining;
