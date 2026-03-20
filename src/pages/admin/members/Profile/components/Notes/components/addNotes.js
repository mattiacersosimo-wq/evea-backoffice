import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import Iconify from "src/components/Iconify";

import useAddNotes from "./hooks/useAddNotes";

const AddNotes = ({ fetchNotes }) => {
  const { methods, onSubmit } = useAddNotes(fetchNotes);
  const {
    formState: { errors },
  } = methods;
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <Grid container spacing={2} p={3}>
        <Grid item xs={12} md={5}>
          <FormControl fullWidth>
            <TextField
              {...methods.register("title")}
              id="video-title"
              label={"adminTools.videos.title"}
              variant="outlined"
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={5}>
          <FormControl fullWidth>
            <TextField
              {...methods.register("video_tool_url")}
              id="video-url"
              label={"adminTools.videos.videoURLs"}
              variant="outlined"
              error={Boolean(errors.video_tool_url)}
              helperText={errors.video_tool_url?.message}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box sx={{ height: "100%" }}>
            <Button
              type="submit"
              size="large"
              startIcon={<Iconify icon={"carbon:add"} />}
              fullWidth
              sx={{ height: "100%" }}
              style={{ backgroundColor: "#f2f3f5" }}
            >
              {"adminTools.videos.add"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddNotes;
