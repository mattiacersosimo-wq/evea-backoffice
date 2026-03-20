import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState({
    active_left_customers: 0,
    active_right_customers: 0,
    total_customers: 0,
  });

  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await fetchUser("dashboard/active-users");
        if (status === 200) {
          setActiveUsers(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return activeUsers;
};

export default useActiveUsers;
