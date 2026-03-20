import { Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useGetUserStripeInfo from "src/pages/user/profile/sub-pages/payout/components/stripe/hooks/use-get-user-stripe-info";
import { PAYOUT_TYPE_IDS } from "src/utils/types";

const StripeInfo = () => {
  const { watch } = useFormContext();
  const paymentType = watch("payment_type");
  const { watch: stripInfo } = useGetUserStripeInfo();

  const { routing_number, account_number } = stripInfo();

  const show = useMemo(() => {
    if (paymentType) {
      return parseInt(paymentType) === PAYOUT_TYPE_IDS.stipe;
    }

    return false;
  }, [paymentType]);

  const dataInputted = useMemo(() => {
    return Boolean(routing_number) && Boolean(account_number);
  }, [routing_number, account_number]);

  const { palette } = useTheme();

  return (
    <Ternary
      when={show}
      then={
        <Ternary
          when={dataInputted}
          then={
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                Routing Number: {routing_number}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                Account Number: {account_number}
              </Typography>
            </Stack>
          }
          otherwise={
            <span style={{ color: "#59657e", fontSize: "12px" }}>
              <Translate>global.update_bank</Translate>{" "}
              <Button component={Link} to={"/user/profile/payout"}>
                <span
                  style={{
                    color: palette.primary.main,
                    fontSize: "12px",
                  }}
                >
                  <Translate>impersonate.click</Translate>
                </span>
              </Button>
            </span>
          }
        />
      }
    />
  );
};

export default StripeInfo;
