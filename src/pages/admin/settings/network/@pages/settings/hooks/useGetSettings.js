import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useSettingsForm from "./useSettingsForm";

const useGetSettings = () => {
  const methods = useSettingsForm();

  const fetchData = async () => {
    try {
      const { status, data } = await axiosInstance(
        "api/admin/network-settings"
      );
      if (status === 200) {
        const { referral_bonus, purchase, registration } = data.data;
        methods.reset({
          referral_bonus,
          registration,
          purchase,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return methods;
};

export default useGetSettings;
