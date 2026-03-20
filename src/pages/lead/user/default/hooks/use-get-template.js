import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useTemplateForm from "./use-template-form";

const useGetTemplate = () => {
  const methods = useTemplateForm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          "api/user/lead-capture-template"
        );
        const {
          Subheading,
          features_and_benefits,
          headline,
          objection_handling,
          social_proof,
          visuals,
        } = data.data || {};
        methods.reset({
          Subheading,
          features_and_benefits,
          headline,
          objection_handling,
          social_proof,
          visuals,
        });
      } catch (err) {
        enqueueSnackbar(err.message);
      }
    };
    fetchData();
  }, []);

  return methods;
};

export default useGetTemplate;
