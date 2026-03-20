import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const objFromArray = (array, key = "id") => {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
};

const defaultValues = {
  allIds: [],
  byId: {},
};
const useGetMails = (URL) => {
  const params = useParams();
  const [mails, setMails] = useState(defaultValues);
  const handleErrors = useErrors();

  const fetchData = async () => {
    try {
      const { data, status } = await axiosInstance.get(URL, {
        params,
      });

      if (status === 200) {
        const mails = data.data;
        if (mails) {
          const byId = objFromArray(mails);
          setMails({
            byId,
            allIds: Object.keys(byId),
          });
        } else {
          setMails(defaultValues);
        }
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  const memoisedFetch = useCallback(fetchData, [params]);

  useEffect(() => {
    memoisedFetch();
  }, [memoisedFetch]);

  return { mails, fetchMails: fetchData };
};

export default useGetMails;
