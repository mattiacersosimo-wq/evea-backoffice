import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "src/components/hook-form";
import Ternary from "src/components/ternary";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import useShowDraftButton from "../hooks/use-show-draft-button";
import SingleUpload from "./SingleFileUpload";

const RightGrid = ({ onSubmit }) => {
  const showDraftButton = useShowDraftButton();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const [loading, setLoading] = useState({
    draft: false,
    publish: false,
  });

  const handleSaveAsDraftClick = () => {
    // setValue("is_draft", true);
    setLoading({ draft: true, publish: false });
    handleSubmit(onSubmit(true))();
  };
  const handleSubmitClick = () => {
    // setValue("is_draft", false);
    setLoading({ draft: false, publish: true });

    handleSubmit(onSubmit())();
  };
  const { t } = useTranslation();
  const { draft, publish } = loading;
  return (
    <Grid item xs={12} md={5}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Box name="short-description">
            <RHFTextField
              name="short_description"
              label="blogs.create.form.short_desc"
              multiline
              fullWidth
              rows={3}
            />
          </Box>
          <Stack spacing={1} mt={2}>
            <TextField
              name="document_url"
              type="file"
              label={t("blogs.create.form.add_doc")}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: ".xlsx, .xls, .pdf" }}
              {...register("document_url")}
              error={Boolean(errors.document_url)}
              helperText={errors.document_url?.message}
            />
          </Stack>
          <Stack spacing={1} m={1}>
            <SingleUpload />
          </Stack>
        </Card>
        <Box
          sx={{
            display: "grid",
            rowGap: 3,
            columnGap: 2,
            marginTop: 3,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: showDraftButton ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
            },
          }}
        >
          <Ternary
            when={showDraftButton}
            then={
              <LoadingButton
                loading={isSubmitting && draft}
                type="submit"
                variant="outlined"
                size="large"
                name="save-draft"
                onClick={handleSaveAsDraftClick}
              >
                <Translate>blogs.create.form.save_as_draft</Translate>
              </LoadingButton>
            }
          />

          <LoadingButton
            loading={isSubmitting && publish}
            type="submit"
            variant="contained"
            size="large"
            onClick={handleSubmitClick}
            name="submit"
          >
            <Translate>blogs.create.form.submit</Translate>
          </LoadingButton>
        </Box>
      </Stack>
    </Grid>
  );
};

export default RightGrid;
