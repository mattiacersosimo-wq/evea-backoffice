// @mui
import { Box, Stack, Typography } from "@mui/material";
// assets
import { UploadIllustration } from "../../assets";
import Translate from "../translate";

// ----------------------------------------------------------------------

export default function BlockContent({ maxSize }) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: "column", md: "row" }}
      sx={{ width: 1, textAlign: { xs: "center", md: "left" } }}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          <Translate>image_upload.drop_file</Translate>
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <Translate>global.dropSelected</Translate> &nbsp;
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "primary.main", textDecoration: "underline" }}
          >
            <Translate>image_upload.browse</Translate>
          </Typography>
          &nbsp; <Translate>image_upload.through</Translate>
        </Typography>
        <Typography variant="caption">
          <Translate>global.max_size</Translate>: {maxSize / 1000} KB
        </Typography>
      </Box>
    </Stack>
  );
}
