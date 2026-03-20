import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";

import Translate from "src/components/translate";
import useHome from "./hooks/useHome";

const Home = () => {
  const subscription = useHome();
  const {
    purchase_product: product,
    created_at,
    effective_until,
  } = subscription;
  const { name, meta_description, product_images: images } = product || {};

  return (
    <div>
      <Box
        sx={{
          display: "grid",
          rowGap: 3,
          columnGap: 2,
          marginTop: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: "background.neutral" }}>
          <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar alt={name}>{name?.charAt(0)?.toUpperCase()}</Avatar>
              <div>
                <Typography variant="subtitle2">{name}</Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.disabled", mt: 0.5, display: "block" }}
                >
                  <Translate>user.subscriptions.purchase_date</Translate>:{" "}
                  <ParseDate date={created_at} />
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.disabled", mt: 0.5, display: "block" }}
                >
                  <Translate>user.subscriptions.expiry_date</Translate>:{" "}
                  <ParseDate date={effective_until} />
                </Typography>
              </div>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={3}
              sx={{ color: "text.secondary" }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify
                  icon={"healthicons:i-schedule-school-date-time-outline"}
                  width={25}
                  height={25}
                  sx={{ color: "info.main" }}
                />
                <Typography variant="caption">
                  <Translate>
                    user.subscriptions.recurring_not_enabled
                  </Translate>
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="caption">{meta_description}</Typography>
          </Stack>

          <Box sx={{ p: 1, position: "relative" }}>
            <img
              src={images?.find(Boolean)?.image_url}
              ratio="1/1"
              sx={{ borderRadius: 1.5 }}
            />
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Home;
