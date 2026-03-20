import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import LabelStyle from "src/components/label-style";
import useAuth from "src/hooks/useAuth";

const ShippingAddress = ({ invoice }) => {
  const { user_payment } = invoice || {};

  const {
    billing_first_name,
    billing_last_name,
    billing_country,
    billing_street_address,
    billing_apartment,
    billing_postcode,
    billing_city,
    billing_province,
    billing_phone,
    billing_email,
    shipping_first_name,
    shipping_last_name,
    shipping_country,
    shipping_street_address,
    shipping_apartment,
    shipping_postcode,
    shipping_city,
    shipping_province,
    shipping_phone,
    shipping_email,
  } = user_payment?.carts[0] || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>

      <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
        <Box sx={{ mb: 3 }}>
          <LabelStyle>Shipping Address</LabelStyle>
          <Stack mt={1} spacing={0.5}>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Name : {shipping_first_name} {shipping_last_name}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Address 1 : {shipping_street_address}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              City : {shipping_city}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              State : {shipping_province}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Country : {shipping_country}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Pincode : {shipping_postcode}
            </Typography>
          </Stack>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
        <Box sx={{ mb: 3, textAlign: { sm: "right" } }}>
          <LabelStyle>Billing Address</LabelStyle>
          <Stack mt={1} spacing={0.5}>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Name : {billing_first_name} {billing_last_name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Street : {billing_street_address}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              State : {billing_province}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Country : {billing_country}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Pincode : {billing_postcode}
            </Typography>
          </Stack>
        </Box>
      </Grid>

      {/* <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
        <Box sx={{ textAlign: { sm: "left" } }}>
          <Typography variant="h6">{invoiceNumber}</Typography>
          {isAdmin ? (
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: "text.disabled" }}
            >
              EMAIL &nbsp;:&nbsp;&nbsp;
              <span>{email ?? "_"}</span>
            </Typography>
          ) : null}
          <Typography variant="overline" sx={{ color: "text.disabled" }}>
            <Translate>
              user.online_store.my_orders.details.invoiced_date
            </Translate>
            &nbsp;:&nbsp;&nbsp; <ParseDate date={createDate} />
          </Typography>
          <br />
        </Box>
      </Grid> */}

      <Grid item xs={12} mb={3}>
        <Divider sx={{ my: 2 }} />
      </Grid>
    </Grid>
  );
};

export default ShippingAddress;
