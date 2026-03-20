import { useSnackbar } from "notistack";
import { useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useUpdate = (inputData, config) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleError = useErrors();
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    const reqData = new FormData();
    const updateArray = inputData.map((item) => {
      return {
        id: item.id,
        rank_name: item.rank_name,
        pqv_required: item.pqv_required,
        tv_required: item.tv_required,
        gv_required: item.gv_required,
        user_type: item.user_type,
        min_pqv: item.min_pqv,
        is_circle_of_evea: item.is_circle_of_evea,
        max_team_percentage: item.max_team_percentage,
        active: item.active,
        bonus_amount: item.bonus_amount,
        referral_count: item?.referral_count,
        package_id: item?.package_id,
        referral_package: item?.referral_package,
        referral_package_count: item?.referral_package_count,
        team_volume: item?.team_volume,
        personal_volume: item?.personal_volume,
      };
    });
    const strData = JSON.stringify(updateArray);
    reqData.append("data", strData);
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/settings-rank`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        setLoading(false);
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  return { onSubmit, loading };
};

export default useUpdate;
