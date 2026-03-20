import { Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useAuth from "src/hooks/useAuth";
import { PAYOUT_TYPE_IDS } from "src/utils/types";

const BankInfo = () => {
  const { watch } = useFormContext();
  const paymentType = watch("payment_type");

  const { user } = useAuth();
  const { iban, bank_country, bank_name, swift } = user?.user_profile || {};

  const show = useMemo(() => {
    if (paymentType) {
      return parseInt(paymentType) === PAYOUT_TYPE_IDS.manual;
    }

    return false;
  }, [paymentType]);

  const dataInputted = useMemo(() => {
    return (
      Boolean(iban) &&
      Boolean(bank_country) &&
      Boolean(bank_name) &&
      Boolean(swift)
    );
  }, [iban, bank_country, bank_name, swift]);

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
                Bank Name: {bank_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                Bank Country: {bank_country}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                SWIFT: {swift}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                IBAN: {iban}
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

export default BankInfo;
