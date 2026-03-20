import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useUserActivity = () => {
  const { count, onChange, page, seed } = usePagination();
  const [data, setData] = useState({ list: [] });

  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        const { status, data } = await axiosInstance("/api/activity", {
          params: { page },
        });
        if (status === 200) {
          const { last_login } = data;
          const { last_page, from, data: list } = data.data;
          seed(last_page, from);
          setData((prev) => ({ ...prev, list, lastSeen: last_login }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData(page);
  }, [page]);

  return { data, count, onChange, page };
};

export default useUserActivity;
