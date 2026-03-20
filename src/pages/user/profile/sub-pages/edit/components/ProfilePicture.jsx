import { Box, Typography } from "@mui/material";
import React from "react";
import { RHFUploadAvatar } from "src/components/hook-form";
import useAuth from "src/hooks/useAuth";

import Translate from "src/components/translate";
import { fData } from "src/utils/formatNumber";
import useUploadImage from "../hooks/useUploadImage";

const ProfilePicture = ({ methods }) => {
  const { user } = useAuth();
  const handleDrop = useUploadImage(methods);

  return (
    <Box sx={{ mb: 5 }}>
      <RHFUploadAvatar
        name="avatarUrl"
        fileUrl={user?.user_profile?.profile_image}
        maxSize={200000}
        accept="image/png, image/jpg, image/jpeg, image/gif"
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
            <Translate>global.allowed</Translate> *.jpeg, *.jpg, *.png, *.gif
            <br /> <Translate>global.max</Translate> {fData(200000)}
          </Typography>
        }
      />
    </Box>
  );
};

export default ProfilePicture;
