const Map = ({ list = [], render }) => {
  return list?.map(render);
};

export default Map;
