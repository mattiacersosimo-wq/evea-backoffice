import Map from "src/components/map";
import ActivityItem from "./activity-item";

const Activities = ({ data }) => (
  <Map list={data} render={(item) => <ActivityItem data={item} />} />
);

export default Activities;
