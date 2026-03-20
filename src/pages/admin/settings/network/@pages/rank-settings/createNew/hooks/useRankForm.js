import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  referral_package_count: "",
  referral_package: "",
  referral_count: "",
  rank_name: "",
  personal_volume: "",
  bonus_amount: "",
  package_id: "",
  team_volume: "",
};
const useRankForm = (config) => {
  const {
    team_volume,
    package_id,
    personal_volume,
    referral_count,
    referral_package,
  } = config;

  const teamVolume = Boolean(team_volume);
  const referralPackageCount = Boolean(referral_package);
  const referralCount = Boolean(referral_count);
  const personalVolume = Boolean(personal_volume);
  const packageId = Boolean(package_id);
  const Schema = Yup.object().shape({
    // package_id: Yup.string().required("Package is required")
    package_id: Yup.string().test(
      "Package is required",
      "Package is required",
      function (value) {
        if (packageId === true) {
          return value;
        }
        return true;
      }
    ),
    bonus_amount: Yup.string().required("Bonus Amount is required"),
    // personal_volume: Yup.string().required("Personal volume is required"),

    personal_volume: Yup.string().test(
      "Personal volume is required",
      "Personal volume is required",
      function (value) {
        if (personalVolume === true) {
          return value;
        }
        return true;
      }
    ),

    rank_name: Yup.string().required("Rank name is required"),
    // referral_count: Yup.string().required("Referral count is required"),

    referral_count: Yup.string().test(
      "Referral package is required",
      "Referral package is required",
      function (value) {
        if (referralCount === true) {
          return value;
        }
        return true;
      }
    ),

    // referral_package: Yup.string().required("Referral package is required"),

    referral_package: Yup.string().test(
      "Referral package is required",
      "Referral package is required",
      function (value) {
        if (referralPackageCount === true) {
          return value;
        }
        return true;
      }
    ),
    // referral_package_count: Yup.string().required(
    //   "Referral package count is required"
    // ),

    referral_package_count: Yup.string().test(
      "Referral package count is required",
      "Referral package count is required",
      function (value) {
        if (referralPackageCount === true) {
          return value;
        }
        return true;
      }
    ),
    team_volume: Yup.string().test(
      "Team volume count is required",
      "Team volumecount is required",
      function (value) {
        if (teamVolume === true) {
          return value;
        }
        return true;
      }
    ),
  });
  return useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });
};

export default useRankForm;
