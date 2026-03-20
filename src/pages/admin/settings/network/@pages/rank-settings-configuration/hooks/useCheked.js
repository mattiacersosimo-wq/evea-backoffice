import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetPaymentTypes = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const updateMethods = (sid) => async () => {
    setMethods((prev) => {
      const temp = [...prev];
      const itemIndex = temp.findIndex(({ id }) => id === sid);
      const selected = temp[itemIndex];
      selected.active = Number(!selected.active);
      temp.splice(itemIndex, 1, selected);
      return temp;
    });
  };

  const updateRecurring = (sid) => async () => {
    setMethods((prev) => {
      const temp = [...prev];
      const itemIndex = temp.findIndex(({ id }) => id === sid);
      const selected = temp[itemIndex];
      selected.is_recurring = Number(!selected.is_recurring);
      temp.splice(itemIndex, 1, selected);
      return temp;
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/api/admin/settings-rank-configuration");
        console.log(data)
        setMethods(
          data.data.map(({ personal_volume, referral_count,  referral_package,package_id,team_volume }) => ({
            package_id,
            personal_volume,
            referral_count,        
            referral_package,
            team_volume
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    const reqData = new FormData();

    methods.forEach(({ id, active, is_recurring }) => {
      reqData.append(`type[${id}]`, active);
      if (is_recurring !== null)
        reqData.append(`recurring[${id}]`, is_recurring);
    });

    reqData.append("_method", "PUT");
    try {
      const { data } = await axiosInstance.post(
        "api/admin/status-payment-types",
        reqData
      );
      enqueueSnackbar(data.message);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      enqueueSnackbar(err.message);
    }
  };

  return { loading, methods, updateMethods, onSubmit, updateRecurring };
};

export default useGetPaymentTypes;
