import { useSnackbar } from "notistack";
import { useState } from "react";
import usersAutoComplete from "src/api/autoComplete/usersNew";

const useUsersList = (query = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [usersList, setUsersList] = useState([]);
  const fetchData = async (term = "", query = {}) => {
    const { status, data, error } = await usersAutoComplete(term, query);
    if (status) {
      let newSearchList = [];
      const temp = [...usersList, ...data];

      temp.forEach(({ user_id, username }) => {
        const alreadyExist = newSearchList.findIndex(
          ({ user_id: existId }) => existId === user_id
        );
        if (alreadyExist === -1) {
          newSearchList.push({ user_id, username });
        }
      });
      setUsersList(newSearchList);
      return data;
    } else {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const onSearch = (e) => {
    if (e) {
      const { value } = e.target;
      if (value.length > 2) {
        fetchData(value, query);
      }
    }
  };

  return { usersList, onSearch, fetchData };
};

export default useUsersList;
