import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";

import Translate from "src/components/translate";
import { defaultValues } from "../hooks/useAddCategory";

const Form = ({ onClose }) => {
  const {
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext();
  useEffect(() => {
    reset(defaultValues);
    return () => reset(defaultValues);
  }, []);

  const { palette } = useTheme();

  return (
    <>
      <DialogContent>
        <DialogContentText>
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              marginTop: 0,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <RHFTextField name="name" label="blogs.categories.create.name" />
            <Box name="description">
              <RHFTextField
                fullwidth
                rows={3}
                multiline
                name="description"
                label="blogs.categories.create.desc"
              />
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          sx={{ color: palette.warning.normal }}
          name="close"
          color="error"
        >
          <Translate>blogs.categories.create.close</Translate>
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          name="blog-submit"
        >
          <Translate>blogs.categories.create.submit</Translate>
        </LoadingButton>
      </DialogActions>
    </>
  );
};
export default Form;
