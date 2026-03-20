import { LoadingButton } from "@mui/lab";
import { Container, Grid } from "@mui/material";
import LoadingScreen from "src/components/LoadingScreen";
import ChoosePlan from "src/components/choose-plan";
import { FormProvider } from "src/components/hook-form";
import Map from "src/components/map";
import Translate from "src/components/translate";
import GoogleOAuthButton from "src/pages/auth/components/google-login";
import PickField from "./components/pick-fields";
import TermAndConditions from "./components/term-and-conditions";
import useFields from "./hooks/use-fields";
import useRegister from "./hooks/use-register";

const RegisterForm = () => {
  const { methods, onSubmit } = useRegister();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fields = useFields();

  if (fields.length < 1) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="md">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {/*<Stack spacing={3}>*/}
        <Grid container spacing={3}>
          <Map
            list={fields}
            render={({
              input_label,
              input_type,
              input_name,
              input_options,
            }) => (
              <Grid item md={6}>
                <PickField
                  key={input_name}
                  label={input_label}
                  name={input_name}
                  type={input_type}
                  inputOptions={input_options}
                />
              </Grid>
            )}
          />
          <Grid item md={6}>
            <ChoosePlan />
          </Grid>
        </Grid>

        {/*<Stack spacing={2}>
                    <Map
                        list={fields}
                        render={({
                            input_label,
                            input_type,
                            input_name,
                            input_options,
                        }) => (
                            <PickField
                                key={input_name}
                                label={input_label}
                                name={input_name}
                                type={input_type}
                                inputOptions={input_options}
                            />
                        )}
                    />
                </Stack>*/}

        {/*<ChoosePlan />*/}

        <TermAndConditions />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          name="register"
        >
          <Translate>register.register</Translate>
        </LoadingButton>
        {/* <GoogleOAuthButton
                    plan={methods.getValues("plan")}
                    buttonLabel="register.google_register"
                /> */}
        {/*</Stack>*/}
      </FormProvider>
    </Container>
  );
};

export default RegisterForm;
