import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/fetchUser";

const useFetchTicketView = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const fetchData = async (id) => {
    try {
      const { data } = await axiosInstance.get(`support-tickets/${id}`);
      const { status, data: details } = data;
      if (status) {
        setData(details);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  return { data, fetchData };
};

export default useFetchTicketView;
