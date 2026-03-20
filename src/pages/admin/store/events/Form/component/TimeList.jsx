const TimeList = ({ limit = 24 }) => {
  let components = [];

  for (let i = 0; i < limit; i++) {
    const value = i < 10 ? `0${i}` : i;
    components.push(<option value={value}>{value}</option>);
  }
  return components;
};

export default TimeList;
