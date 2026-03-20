import { Box, Button, Stack } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HashLink } from "react-router-hash-link";
import useUserCoinAddress from "src/components/coinAddress/hooks/useUserCoinAddress";
import { RHFSelect } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useCoinTypes from "src/hooks/useCoinTypes";
import { PAYOUT_TYPE_IDS } from "src/utils/types";

const CoinTypes = () => {
  const coinTypes = useCoinTypes();
  const {
    watch,
    formState: { errors },
  } = useFormContext();
  const showCoin = watch("coin_id");
  const paymentType = watch("payment_type");
  const [coinAddress, setCoinAddress] = useState(null);
  const coins = useUserCoinAddress();

  useEffect(() => {
    const coin = coins.find((coin) => coin?.coin_id === parseInt(showCoin));
    setCoinAddress(coin);
  }, [showCoin]);

  const { palette } = useTheme();

  const show = useMemo(() => {
    if (paymentType) {
      return parseInt(paymentType) === PAYOUT_TYPE_IDS.crypto;
    }

    return false;
  }, [paymentType]);
  const { t } = useTranslation();

  return (
    <Ternary
      when={show}
      then={
        <Box>
          <RHFSelect
            name="coin_id"
            label="financial.payout.request.coin"
            size="small"
            helperText={
              <Ternary
                when={Boolean(errors?.coin_id)}
                then={t(errors?.coin_id?.message)}
                otherwise={
                  <Box>
                    <Ternary
                      when={coinAddress?.address}
                      then={
                        <>
                          <span style={{ fontSize: "13px", color: "gray" }}>
                            <Translate>global.coin</Translate>
                          </span>
                          &nbsp;:&nbsp;
                          <span style={{ color: "#59657e" }}>
                            {coinAddress?.address}
                          </span>
                        </>
                      }
                    />
                    <Stack direction="row" alignItems="center">
                      <Ternary
                        when={showCoin !== "" && !coinAddress?.address}
                        then={
                          <span style={{ color: "#59657e" }}>
                            <Translate>global.update_coin</Translate>{" "}
                            <Button
                              component={HashLink}
                              to={"/user/profile/payout#coin-address"}
                            >
                              <span
                                style={{
                                  color: palette.primary.main,
                                }}
                              >
                                <Translate>impersonate.click</Translate>
                              </span>
                            </Button>
                          </span>
                        }
                      />
                    </Stack>
                  </Box>
                }
              />
            }
          >
            <option />
            {coinTypes.map(({ id, name }) => (
              <option value={id}>{name}</option>
            ))}
          </RHFSelect>
        </Box>
      }
    />
  );
};

export default CoinTypes;
