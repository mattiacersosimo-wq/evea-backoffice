import { Box, Typography } from "@mui/material";
import React from "react";
import { RHFUploadAvatar } from "src/components/hook-form";
import useAuth from "src/hooks/useAuth";

import { fData } from "src/utils/formatNumber";
import useUploadImage from "../hooks/useUploadImage";

const ProfilePicture = (methods) => {
  const { user } = useAuth();

  const handleDrop = useUploadImage(methods);

  return (
    <Box sx={{ mb: 5 }}>
      <RHFUploadAvatar
        name="avatarUrl"
        fileUrl={user?.user_profile?.profile_image}
        accept="image/png, image/jpg, image/jpeg, image/gif"
        maxSize={200000}
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
            {"profile.allowed"} *.jpeg, *.jpg, *.png, *.gif
            <br /> max size of {fData(200000)}
          </Typography>
        }
      />
    </Box>
  );
};

export default ProfilePicture;
