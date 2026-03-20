import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import addVisitor from "src/api/global";
import { FormProvider } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import axiosInstance from "src/utils/axios";
import { number, object, ref, string } from "yup";
import Icons from "../icons";
import InputField from "./input-field";

const schema = object().shape({
  first_name: string().required("First Name is required"),
  last_name: string().required("Last Name is required"),
  email: string()
    .email("errors.register.email.email")
    .required("errors.register.email.required"),

  password: string()
    .min(8, "errors.register.password.min")
    .required("errors.register.password.required"),
  confirm_password: string().oneOf(
    [ref("password"), null],
    "errors.register.repassword.oneOf"
  ),
  mobile: number()
    .typeError("Mobile is required")
    .min(12, "Mobile Number Must be less than 12 digits")
    .required("Mobile is required"),
  country: string().required("Country is required"),
});

const defaultValues = {
  first_name: "",
  last_name: "",
  password: "12345678",
  confirm_password: "12345678",
  email: "",
  country: "",
  mobile: "",
  countryCode: "",
  // skype: "",
  // whatsapp: "",
  // telegram: "",
  // type: "",
  // message: "",
};

const RegisterForm = ({ setUserId, setShowOtp }) => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });

  const { enqueueSnackbar } = useSnackbar();
  const {
    setError,
    formState: { isSubmitting },
    setValue,
  } = methods;
  const onSubmit = async (inputData) => {
    const { status, message, data, err } = await addVisitor(inputData);
    if (status) {
      setUserId(data.id);
      enqueueSnackbar(message);
      setShowOtp(true);
      return;
    }
    Object.entries(err.response.data).forEach(([k, v]) => {
      setError(k, { message: v });
    });
  };

  const { breakpoints } = useTheme();
  const d_md = useMediaQuery(breakpoints.down("md"));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("https://ipapi.co/json/");

        const { country_calling_code, country_code_iso3 } = data;

        if (country_code_iso3) {
          setValue("country", country_code_iso3);
        }
        if (country_calling_code) {
          setValue("countryCode", country_calling_code);
        }
        //console.log(
        //    country_calling_code,
        //    country_code,
        //    country_code_iso3
        //);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack justifyContent="center" height="100%" alignItems="center">
        <Box>
          <InputField />
          <LoadingButton
            loading={isSubmitting}
            fullWidth
            type="submit"
            variant="contained"
            name="message"
          >
            Continue
          </LoadingButton>

          <Ternary
            when={d_md}
            then={
              <Box
                sx={{
                  mt: 2,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Icons color="#000" mt={0} mb={0} />
              </Box>
            }
          />
        </Box>
      </Stack>
    </FormProvider>
  );
};

export default RegisterForm;
