import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import Iconify from "src/components/Iconify";
import { FormProvider, RHFTextField } from "src/components/hook-form";

import Translate from "src/components/translate";
import useQueryParams from "src/hooks/useQueryParams";
import useUpdateCategory from "../hooks/useUpdateCategory";
import Transition from "src/utils/dialog-animation";

const UpdateCategory = ({ onClose, fetchData }) => {
  const { queryObject } = useQueryParams();
  const { selected_id: selectedId, open } = queryObject;
  const { methods, onSubmit } = useUpdateCategory(selectedId, () => {
    onClose();
    fetchData();
  });
  const { palette } = useTheme();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open === "edit"}
      onClose={onClose}
      aria-labelledby="delete-blog-category"
      TransitionComponent={Transition}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle
          id="delete-blog-category"
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="span">
            <Translate>blogs.categories.create.edit.title</Translate>
          </Typography>
          {/* <IconButton aria-label="close" onClick={onClose}>
            <Iconify icon="ic:baseline-close" />
          </IconButton> */}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                },
              }}
            >
              <RHFTextField
                name="name"
                label="blogs.categories.create.name"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Box name="description">
                <RHFTextField
                  fullwidth
                  rows={3}
                  multiline
                  name="description"
                  label="blogs.categories.create.desc"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            sx={{ color: palette.error.main }}
            name="close"
          >
            <Translate>blogs.categories.create.close</Translate>
          </Button>

          <Button type="submit" variant="contained" name="update">
            <Translate>blogs.categories.create.edit.submit</Translate>
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateCategory;
