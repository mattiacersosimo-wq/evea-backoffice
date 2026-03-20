import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";

import fetchUser from "src/utils/fetchUser";
import { usePurchaseData } from "../../store/purchaseStore";

const OptionStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2.5),
  justifyContent: "space-between",
  transition: theme.transitions.create("all"),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

const useFetchPurchaseMethods = () => {
  const { product_id: productIds } = usePurchaseData();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const fetchData = async () => {
    const reqData = new FormData();
    productIds.forEach((id) => reqData.append("product_id[]", id));

    try {
      const { data } = await fetchUser.post("product-payment-types", reqData);
      const { status, data: paymentMethods } = data;
      if (status) setPaymentMethods(paymentMethods);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { paymentMethods };
};

const Methods = ({ setHavePaymentMethods, setSelectedPaymentType }) => {
  const { paymentMethods } = useFetchPurchaseMethods();
  useEffect(() => {
    if (paymentMethods.length) setHavePaymentMethods(true);
    else setHavePaymentMethods(false);
  }, [setHavePaymentMethods, paymentMethods]);

  return (
    <Card sx={{ my: 3 }}>
      <CardHeader title={"userOnlineStore.paymentOptions"} />
      <CardContent>
        <RadioGroup
          row
          onChange={(e) => setSelectedPaymentType(e.target.value)}
        >
          <Stack
            spacing={2}
            sx={{
              width: "70%",
            }}
          >
            {paymentMethods.map(({ name, id, description }) => {
              return (
                <OptionStyle key={id}>
                  <FormControlLabel
                    value={id}
                    control={
                      <Radio
                        checkedIcon={
                          <Iconify icon={"eva:checkmark-circle-2-fill"} />
                        }
                      />
                    }
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="subtitle2">{name}</Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {description ?? "userOnlineStore.descriptionGoesHere"}
                        </Typography>
                      </Box>
                    }
                    sx={{ flexGrow: 1, py: 3 }}
                  />
                </OptionStyle>
              );
            })}
          </Stack>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

Methods.propTypes = {
  paymentOptions: PropTypes.array,
  cardOptions: PropTypes.array,
};

export default Methods;
