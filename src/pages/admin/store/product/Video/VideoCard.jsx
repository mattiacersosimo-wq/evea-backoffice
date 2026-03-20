import { Box, Button, Card, Grid, Stack } from "@mui/material";

import Vimeo from "@u-wave/react-vimeo";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";

const VideoCard = ({ item, openEdit, openDelete }) => {
  return (
    <Card p={2}>
      <Card>
        <Vimeo video={item.video_url} controls responsive />
      </Card>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 1,
          m: 1,
          borderRadius: 1,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon={"akar-icons:edit"} />}
          onClick={openEdit}
          name="edit"
        >
          <Translate>{"products.video.edit"}</Translate>
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon={"eva:trash-2-outline"} />}
          color="error"
          onClick={openDelete}
          name="delete"
        >
          <Translate> {"products.video.delete"}</Translate>
        </Button>
      </Stack>
    </Card>
  );
};

export default VideoCard;
