import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Currency } from "src/components/with-prefix";
import usePackageCouponId from "./hooks/use-coupon-package-id";

const Cards = () => {
  const { palette } = useTheme();
  const { name, image, price } = usePackageCouponId();

  const { watch, setValue } = useFormContext();
  const numberOfCoupons = watch("no_of_coupon");

  useEffect(() => {
    if (price) {
      setValue("price", price);
      if (numberOfCoupons) {
        setValue("total_amount", parseInt(numberOfCoupons) * price);
      } else {
        setValue("total_amount", price);
      }
    }
  }, [numberOfCoupons, price]);
  return (
    <Paper
      elevation={5}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 3,
        mb: 3,
        background: `linear-gradient(45deg,#fff , 30%, ${palette.primary.lighter} 90%)`,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box sx={{ flexBasis: "50%", position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            color: "black",
            padding: "16px",
          }}
        >
          <Typography variant="h6" gutterBottom style={{ color: "black" }}>
            {name}
          </Typography>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            style={{ color: "black" }}
          >
            <Currency>{price}</Currency>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flexBasis: "50%", display: "flex", justifyContent: "center" }}>
        <img
          src={image}
          alt="Product"
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
        />
      </Box>
    </Paper>
  );
};

Cards.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default Cards;
