import { Card, Grid, Typography } from "@mui/material";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RHFUploadAvatar } from "src/components/hook-form";
import Translate from "src/components/translate";

import { fData } from "src/utils/formatNumber";

const ImageUpload = ({ title, name }) => {
  const { setValue } = useFormContext();
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          name,
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  const { t } = useTranslation();
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ py: 5, px: 3, textAlign: "center" }}>
            <Typography m={2}> {t(title)} </Typography>
            <RHFUploadAvatar
              name={name}
              accept="image/*"
              maxSize={1145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  <Translate>{"settings.brand.allowed"}</Translate> *.jpeg,
                  *.jpg, *.png, *.gif
                  <br /> <Translate>{"settings.brand.size"}</Translate>
                  {fData(1145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ImageUpload;
