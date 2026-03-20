import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { RHFUploadMultiFile } from "src/components/hook-form";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import LabelStyle from "../../../../../../../../../components/label-style";

const MultiFileUpload = ({ name = "image", maxSize = 200000 }) => {
  const { setValue, watch, getValues } = useFormContext();

  const [image, imageWithIds] = watch([name, "image_with_ids"]);

  const handleRemoveAll = () => {
    setValue(name, []);
    setValue(
      "deleted_image_ids",
      imageWithIds.map(({ id }) => id)
    );
  };

  const handleRemove = (file) => {
    const filteredImages = image?.filter((_file) => _file !== file);
    const deletedImageIds = imageWithIds
      ?.filter(({ image_url }) => image_url === file)
      .map(({ id }) => id);
    setValue("deleted_image_ids", [
      ...getValues("deleted_image_ids"),
      deletedImageIds,
    ]);
    setValue(name, filteredImages);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const objectUrls = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue(name, [...image, ...objectUrls]);
    },
    [setValue, image]
  );
  const { t } = useTranslation();
  return (
    <div>
      <LabelStyle>{t("products.add.images")}</LabelStyle>
      <RHFUploadMultiFile
        name={name}
        showPreview
        accept="image/png, image/jpg, image/jpeg"
        maxSize={maxSize}
        onDrop={handleDrop}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
      />
      <Box
        sx={{
          padding: "5px",
          border: "dashed 1px #f7535329",
          borderRadius: "7px",
          marginTop: "10px",
        }}
      >
        <ul style={{ listStyle: "none" }}>
          <li>
            <Typography color="error" variant="caption">
              <Translate>global.imageValid</Translate>
            </Typography>
          </li>
          <li>
            <Typography color="error" variant="caption">
              <Translate>global.messageImage</Translate>
            </Typography>
          </li>
        </ul>
      </Box>
    </div>
  );
};

export default MultiFileUpload;
