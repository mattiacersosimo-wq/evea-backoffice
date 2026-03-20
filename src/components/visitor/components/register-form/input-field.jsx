import { Grid, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Countries from "src/components/countries";
import { RHFTextField } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { Controller, useFormContext } from "react-hook-form";

const InputField = () => {
  const { breakpoints } = useTheme();
  const d_md = useMediaQuery(breakpoints.down("md"));
  const { control } = useFormContext();

  return (
    <>
      <Ternary
        when={d_md}
        then={
          <>
            <Typography variant="h4">Contact Information</Typography>
            <Typography variant="caption" fontWeight={600}>
              Fill up the Form and our Team will get back to you in 24 hours.
            </Typography>
          </>
        }
      />
      <Grid sx={{ mb: 2, mt: 0.0005 }} container spacing={2}>
        <Grid item md={6} sm={12} width="100%">
          <RHFTextField
            fullWidth
            name="first_name"
            label="First Name"
            variant="standard"
            placeholder="John"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item md={6} sm={12} width="100%">
          <RHFTextField
            fullWidth
            name="last_name"
            label="Last Name"
            variant="standard"
            placeholder="Doe"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item sm={12} width="100%">
          <RHFTextField
            fullWidth
            name="email"
            label="Email"
            variant="standard"
            placeholder="johndoe@cloudmlm.com"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item sm={10} md={10} width="100%">
          <Controller
            name="mobile"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <PhoneInput
                  {...field}
                  country={"in"}
                  enableSearch
                  specialLabel="Mobile"
                  inputStyle={{
                    border: "none",
                    borderBottom: error ? "1px solid red" : "1px solid #c3cad1",
                    borderRadius: 0,
                    fontSize: 16,
                    width: "120%",
                    backgroundColor: "transparent",
                  }}
                  buttonStyle={{
                    border: "none",
                    backgroundColor: "transparent",
                  }}
                  dropdownStyle={{
                    zIndex: 9999,
                  }}
                />
                {error && (
                  <p
                    style={{
                      color: "#FF4842",
                      fontSize: "0.75rem",
                      marginTop: "7px",
                    }}
                  >
                    {error.message}
                  </p>
                )}
              </>
            )}
          />
        </Grid>
        <Grid item sm={12} md={12} width="100%">
          <Countries variant="standard" />
        </Grid>
        {/* <Grid item md={6} sm={12} width="100%">
          <RHFTextField
            fullWidth
            name="password"
            label="Password"
            variant="standard"
            type="password"
          />
        </Grid>
        <Grid item md={6} sm={12} width="100%">
          <RHFTextField
            fullWidth
            name="confirm_password"
            label="Confirm Password"
            variant="standard"
            type="password"
          />
        </Grid> */}
        {/* <Grid item md={6} sm={12} width="100%">
          <RHFTextField
            fullWidth
            name="whatsapp"
            label="Whatsapp"
            variant="standard"
          />
        </Grid>
        <Grid item md={6} sm={12} width="100%">
          <RHFTextField
            fullWidth
            name="telegram"
            label="Telegram"
            variant="standard"
          />
        </Grid> */}
      </Grid>
    </>
  );
};

export default InputField;
