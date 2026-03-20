import { Box, Paper, Stack } from "@mui/material";
import { useSubscriptionContext } from "../../store/subscription";
import Content from "../content";
import "./style.css";

const MySubscription = ({ fetchData }) => {
  const data = useSubscriptionContext();

  const { purchase_product } = data || {};
  const { product_images } = purchase_product || {};

  return (
    <>
      <Paper
        variant="elevation"
        elevation={4}
        sx={{
          padding: 1,
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={3}>
          <Box
            sx={{
              width: "300px",
            }}
          >
            <img
              style={{
                borderRadius: 5,
                objectFit: "contain",
              }}
              src={product_images?.find(Boolean)?.image_url}
            />
          </Box>
          <Content fetchData={fetchData} />
        </Stack>
      </Paper>
    </>
  );
};

export default MySubscription;
