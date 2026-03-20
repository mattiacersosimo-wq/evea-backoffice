import { Box, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RHFTextField } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import LabelStyle from "src/components/label-style";

const Wrapper = ({ label, children }) => {
  return (
    <>
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 1,
        }}
      >
        <LabelStyle>{label} </LabelStyle>
      </Box>

      <Box
        sx={{
          display: "grid",
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          },
        }}
      >
        {children}
      </Box>
    </>
  );
};

export const Document = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  return (
    <Wrapper label={t("material.add_material.add_document")}>
      <TextField
        type="file"
        label={t("material.add_material.add_document")}
        InputLabelProps={{
          shrink: true,
        }}
        {...register("doc", {
          required: "Document is required",
        })}
        inputProps={{
          accept:
            "application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        }}
        error={Boolean(errors.doc)}
        helperText={t(errors.doc?.message)}
      />
      <RHFTextField name="doc_title" label={"material.add_material.title"} />
      <RHFDatePicker
        label="material.add_material.expiry_date"
        name="doc_access_time"
      />
    </Wrapper>
  );
};

export const Video = () => {
  const { t } = useTranslation();
  return (
    <Wrapper label={t("material.add_material.add_video")}>
      <RHFTextField name="video" label={"material.add_material.URL"} />

      <RHFTextField name="video_title" label={"material.add_material.title"} />
      <RHFDatePicker
        label={"material.add_material.expiry_date"}
        name="video_access_time"
      />
    </Wrapper>
  );
};
