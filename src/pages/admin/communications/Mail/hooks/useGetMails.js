import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
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
  const [selectedMails, setSelectedMails] = useState(0);
  const [state, actions] = useDataHandler();
  const [isRefreshLoading, setRefreshIsLoading] = useState(false);
  const { seed, page, ...rest } = usePagination();

  const fetchData = async (page = 1) => {
    actions.loading();
    try {
      const { data, status } = await axiosInstance.get(URL, {
        params: { ...params, page },
      });

      if (status === 200) {
        const { data: mails, last_page, from } = data.data || {};
        if (mails) {
          setRefreshIsLoading(false);
          setSelectedMails(0);
          // const byId = objFromArray(mails);
          // setMails({
          //   byId: byId,
          //   allIds: Object.keys(byId).reverse(),
          // });
          seed(last_page, from);
          // setMails(mails);
          if (Boolean(mails.length)) {
            actions.success(mails);
            return;
          }
          actions.success();
        }
      } else {
        setRefreshIsLoading(false);
        setMails(defaultValues);
      }
    } catch (err) {
      setRefreshIsLoading(false);
      actions.error();
      handleErrors(err);
    }
  };
  const memoisedFetch = useCallback(fetchData, [params, page]);

  useEffect(() => {
    memoisedFetch(page);
  }, [memoisedFetch]);

  return {
    state,
    selectedMails,
    setSelectedMails,
    setRefreshIsLoading,
    isRefreshLoading,
    fetchMails: fetchData,
    pagination: { page, ...rest },
  };
};

export default useGetMails;
