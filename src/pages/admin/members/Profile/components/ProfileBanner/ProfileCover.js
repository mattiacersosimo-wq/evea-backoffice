import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";

import { useParams } from "react-router";
import { FormProvider } from "src/components/hook-form";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import MyAvatar, { MemberAvatar } from "src/components/MyAvatar";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import cssStyles from "src/utils/cssStyles";
import { useMemberProfileContext } from "../..";

const RootStyle = styled("div")(({ theme }) => ({
  "&:before": {
    ...cssStyles().bgBlur({ blur: 1, color: theme.palette.primary.darker }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
}));

const InfoStyle = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: "absolute",
  marginTop: theme.spacing(5),
  [theme.breakpoints.up("md")]: {
    right: "auto",
    display: "flex",
    alignItems: "center",
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 18,
  height: 18,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(0.5),
}));

const UploadButton = {
  position: "absolute",
  zIndex: 99,
  display: "flex",
  alignItems: "center",
  right: "2%",
  bottom: "25%",
};

const Input = styled("input")({
  display: "none",
});

export default function ProfileCover() {
  const { enqueueSnackbar } = useSnackbar();
  const { mid } = useParams();
  const handleError = useErrors();

  const {
    memberProfile: { user_profile },
    dispatch,
  } = useMemberProfileContext();

  const handleChange = async (e) => {
    // upload image file setup
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    if (file.size > 200 * 1024) {
      enqueueSnackbar(
        "File size exceeds the limit of 200 KB. Please choose a smaller file.",
        { variant: "error" }
      );
      e.target.value = "";
      return;
    }
    // end upload image file setup
    const formData = new FormData();
    formData.append("cover_image", e.target.files[0]);
    formData.append("_method", "PUT");
    try {
      const { status, data } = await axiosInstance({
        method: "post",
        url: `/api/admin-change-cover-image/${mid}`,
        data: formData,
      });

      if (status === 200) {
        enqueueSnackbar(data.message);
        dispatch({ type: "UPDATE_COVER", payload: data.data });
      }
    } catch (error) {
      console.error(error);

      handleError(error);
    }
  };

  return (
    <RootStyle>
      <InfoStyle>
        <MemberAvatar
          uri={user_profile?.user_profile?.profile_image}
          name={user_profile?.username}
          sx={{
            mx: "auto",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "common.white",
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
            "& p": {
              fontSize: "3rem",
            },
          }}
        />
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: "common.white",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h4">{user_profile.username}</Typography>
          <Stack
            direction="row"
            sx={{
              textAlign: { xs: "center", md: "right" },
            }}
          >
            <IconStyle icon={"bi:phone-fill"} />
            <Typography variant="body2">{user_profile.mobile}</Typography>
          </Stack>
        </Box>
      </InfoStyle>

      <FormProvider>
        <Box style={UploadButton}>
          <Tooltip
            title="Upload Cover Image"
            style={{ width: "max-content" }}
            name="upload-cover"
          >
            <label htmlFor="icon-button-file">
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                name="cover_image"
                onChange={handleChange}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                style={{ color: "white" }}
              >
                <Iconify icon={"bi:camera-fill"} width={24} height={24} />
              </IconButton>
            </label>
          </Tooltip>
        </Box>
      </FormProvider>
      <Image
        alt="profile cover"
        src={user_profile.user_profile?.cover_image}
        sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </RootStyle>
  );
}
