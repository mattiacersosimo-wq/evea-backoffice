import { LoadingButton } from "@mui/lab";
import { Card, Stack, TextField, Typography } from "@mui/material";
import Translate from "../translate";
import useCoinAddresses from "./hooks/useCoinAddresses";

const CoinAddress = () => {
  const { loading, addresses, data, handleChange, onSubmit } =
    useCoinAddresses();
  const activeData = addresses.filter((item) => item?.active === 1);

  return (
    <div id="coin-address">
      <Card sx={{ p: 3, mt: 1 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          <Translate>global.coin_address</Translate>
        </Typography>
        <Stack spacing={3} alignItems="flex-end">
          {activeData.map((item) => {
            const address = data[item.id];
            return (
              <Stack width={"100%"} direction="row" key={item.id} spacing={4}>
                <TextField
                  label={item.name}
                  fullWidth
                  name={item.id}
                  value={address || ""}
                  onChange={handleChange}
                />
              </Stack>
            );
          })}
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={onSubmit}
            name="coin-address"
          >
            <Translate>profile.settings.address.save</Translate>
          </LoadingButton>
        </Stack>
      </Card>
    </div>
  );
};

export default CoinAddress;
