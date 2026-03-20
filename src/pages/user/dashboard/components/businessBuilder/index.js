import {
  Box,
  Button,
  Card,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { PATH_USER } from "src/routes/paths";

const IconWrapperStyle = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
}));

export default function BusinessBuilderList() {
  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title="Business Builder: Requirements" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            border: "dashed #cccccc82 1px",
            padding: "0.5rem",
            borderRadius: "1rem",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">
              1 Active product subscription
            </Typography>
          </Box>

          <IconWrapperStyle>
            <Iconify icon={"el:ok-sign"} width={20} height={20} />
          </IconWrapperStyle>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            border: "dashed #cccccc82 1px",
            padding: "0.5rem",
            borderRadius: "1rem",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">
              Pay Business Builder Subscription
            </Typography>
          </Box>

          <IconWrapperStyle>
            <Iconify
              icon={"el:ok-sign"}
              width={20}
              height={20}
              sx={{ color: "#8b8b8b" }}
            />
          </IconWrapperStyle>
        </Stack>
      </Stack>
      <Box sx={{ p: 1, textAlign: "right" }}>
        <Button
          to={PATH_USER.genealogy.affiliate}
          LinkComponent={Link}
          size="small"
          color="info"
          endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
        >
          View Affiliate Dashboard
        </Button>
      </Box>
    </Card>
  );
}
