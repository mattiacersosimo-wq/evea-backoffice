import { endOfQuarter } from "date-fns";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import buildPath from "src/utils/build-path";

const useGetTemplate = () => {
  const [template, setTemplate] = useState({
    headline: "",
    Subheading: "",
    features_and_benefits: "",
    objection_handling: "",
    social_proof: "",
    visuals: "",
  });
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { referral } = useParams();
  useEffect(() => {
    const fetchData = async (uname = "") => {
      try {
        const { data } = await axiosInstance.get(
          buildPath("/api/lead-capture-template", uname)
        );

        const {
          Subheading,
          headline,
          features_and_benefits,
          objection_handling,
          social_proof,
          visuals,
        } = data.data || {};

        setTemplate({
          Subheading,
          headline,
          features_and_benefits,
          objection_handling,
          social_proof,
          visuals,
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err);
      }
    };

    if (referral) fetchData(referral);
  }, [referral]);

  return { template, loading };
};

export default useGetTemplate;
