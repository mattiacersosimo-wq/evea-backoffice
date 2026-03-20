import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { number, object, string, array } from "yup";
import * as yup from "yup";

const ValidationSchema = yup.object().shape({
  kyc_identity_proof: yup
    .mixed()
    .test("isFile", "Select a Doc", (value) => Boolean(value.length)),
  kyc_address_proof: yup
    .mixed()
    .test("isFile", "Select a Doc", (value) => Boolean(value.length)),
});

export const documentFormDefaultValues = {
  kyc_identity_proof: "",
  kyc_address_proof: "",
};

const useFormKyc = () => {
  return useForm({
    documentFormDefaultValues,
    resolver: yupResolver(ValidationSchema),
  });
};

export default useFormKyc;
