import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useGuidanceForm from "./useGuidanceForm";

const useGetGuidanceById = (selectedGuidanceId) => {
  const methods = useGuidanceForm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `/api/admin/brand-user-guidances/${selectedGuidanceId}`
        );

        if (status === 200) {
          const { active, description, title, url } = data.data;
          methods.reset({
            active,
            description,
            title,
            url,
          });
        }
      } catch (err) {
        console.error(err);
        enqueueSnackbar(err.message, { variant: "error" });
      }
    };

    if (selectedGuidanceId) fetchData();
  }, [selectedGuidanceId]);

  return methods;
};

export default useGetGuidanceById;
