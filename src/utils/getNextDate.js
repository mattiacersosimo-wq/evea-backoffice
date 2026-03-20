const getNextDate = () => {
  const date = new Date();
  return new Date(date.setDate(date.getDate() + 1));
};

export default getNextDate;
