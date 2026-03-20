import { Card, Stack, TextField } from "@mui/material";
import { capitalCase } from "change-case";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const DocUpload = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <TextField
            name="doc"
            type="file"
            label={t("products.add.add_doc")}
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: ".xlsx, .xls, .pdf" }}
            {...register("doc")}
            error={Boolean(errors.doc)}
            helperText={t(errors.doc?.message)}
          />
        </Stack>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <TextField
            name="sample_doc"
            type="file"
            label={t("products.add.add_sample_doc")}
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: ".xlsx, .xls, .pdf" }}
            {...register("sample_doc")}
            error={Boolean(errors.sample_doc)}
            helperText={t(errors.sample_doc?.message)}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default DocUpload;
