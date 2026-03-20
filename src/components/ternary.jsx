const Ternary = ({ when, then = null, otherwise = null }) => {
  return when ? then : otherwise;
};

export default Ternary;
