import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useFounderStatus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/wp/founder/status");
        if (!off) setData(r?.data || null);
      } catch {}
      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, []);

  return { ...(data || {}), loading };
};

export default useFounderStatus;
