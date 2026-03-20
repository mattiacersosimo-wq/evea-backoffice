import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { paramCase } from "change-case";
import { Link } from "react-router-dom";
import { Currency } from "src/components/with-prefix";
import { PATH_USER } from "src/routes/paths";

const PackageCouponCard = ({ product }) => {
  const { name, package_price, id, product_image } = product;

  return (
    <>
      <Card
        sx={{
          mt: 2,
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <CardMedia
            sx={{ height: { md: 200, xs: 160 } }}
            image={product_image?.image_url}
          />
          {/* <img
            src={product_image?.image_url}
            alt="Image"
            style={{
              width: "100%",
              borderRadius: "8px 8px 0 0",
              height: "50%",
            }}
          /> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              <Currency>{package_price.price}</Currency>
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: "1.2rem" }}>
              <span style={{ fontSize: "15px" }}>Package Name</span> : {name}
            </Typography>
          </Box>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <Button
              LinkComponent={Link}
              to={PATH_USER.coupons.view(id, {
                name: paramCase(name),
              })}
              size="small"
              variant="outlined"
              sx={{
                width: "90%",
                "&:hover": {
                  backgroundColor: "#0056b3",
                  color: "white",
                },
              }}
            >
              Buy Now
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default PackageCouponCard;
