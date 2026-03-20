import { useEffect, useState } from "react";
import WorldMap from "src/pages/user/dashboard/components/WorldMap";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";

const useMembersMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          URI.admin.network.worldMap
        );

        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return data;
};

const MemberMapWidget = () => {
  const data = useMembersMap();
  return (
    <div>
      <WorldMap data={data} />
    </div>
  );
};

export default MemberMapWidget;
