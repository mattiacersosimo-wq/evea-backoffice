import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const defaultValues = {
  package_id: null,
  personal_volume: null,
  rank_criteria: "daily",
  referral_package: null,
  referral_count: null,
  team_volume: null,
};

const useGetData = (setSelectedValue) => {
  const methods = useForm({
    defaultValues,
  });
  const handleError = useErrors();
  const [data, setData] = useState();
  const fetchData = async () => {
    try {
      const { status, data } = await axiosInstance(
        "/api/admin/settings-rank-configuration"
      );
      if (status === 200) {
        const {
          package_id,
          personal_volume,
          rank_criteria,
          referral_package,
          referral_count,
          team_volume,
        } = data?.data;
        methods.reset({
          package_id,
          personal_volume,
          rank_criteria,
          referral_package,
          referral_count,
          team_volume,
        });
        setSelectedValue(rank_criteria);
        setData(data?.data);
      }
    } catch (err) {
      handleError(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { methods, fetchData, data };
};

export default useGetData;
