const Loop = ({ list = [], render }) => {
  return list?.map(render);
};

export default Loop;
