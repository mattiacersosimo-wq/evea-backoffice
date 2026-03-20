import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { RHFUploadSingleFile } from "src/components/hook-form";
import LabelStyle from "src/components/label-style";
import Translate from "src/components/translate";

const SingleFileUpload = ({ name = "image", maxSize = 200000 }) => {
  const { setValue, watch } = useFormContext();

  const image = watch(name);
  const handleRemoveAll = () => {
    setValue(name, []);
  };

  const handleRemove = (file) => {
    const filteredItems = image?.filter((_file) => _file !== file);
    setValue(name, filteredItems);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const objectUrls = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue(name, objectUrls);
    },
    [setValue, image]
  );
  return (
    <div>
      <LabelStyle>
        <Translate>global.images</Translate>
      </LabelStyle>
      <RHFUploadSingleFile
        name="image"
        showPreview
        accept="image/*"
        maxSize={maxSize}
        onDrop={handleDrop}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
        sx={{ marginTop: "1rem" }}
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

export default SingleFileUpload;
