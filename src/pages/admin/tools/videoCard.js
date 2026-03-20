import Vimeo from "@u-wave/react-vimeo";
import { paramCase } from "change-case";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// @mui
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useResponsive from "../../../hooks/useResponsive";
// utils
import { fShortenNumber } from "../../../utils/formatNumber";
import { fDate } from "../../../utils/formatTime";
// components
import Iconify from "../../../components/Iconify";
import Image from "../../../components/Image";
import SvgIconStyle from "../../../components/SvgIconStyle";
import TextIconLabel from "../../../components/TextIconLabel";
import TextMaxLine from "../../../components/TextMaxLine";
import Test from "./test";

// ----------------------------------------------------------------------

VideoCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function VideoCard({ post, index }) {
  const isDesktop = useResponsive("up", "md");

  const { cover, title, view, comment, share, author, createdAt } = post;

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: "absolute",
            color: "background.paper",
          }}
        />
        <Avatar
          alt={author.name}
          src="https://freeiconshop.com/wp-content/uploads/edd/vimeo-flat.png"
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: "absolute",
          }}
        />
        {/* <Image alt="cover" src={cover} ratio="4/3" /> */}
        <Vimeo
          video="https://vimeo.com/253989945"
          autoplay
          controls
          responsive
        />
      </Box>

      <PostContent
        title={title}
        view={view}
        comment={comment}
        share={share}
        createdAt={createdAt}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

PostContent.propTypes = {
  createdAt: PropTypes.string,
  index: PropTypes.number,
  title: PropTypes.string,
  view: PropTypes.number,
  editvideo: PropTypes.number,
  deletevideo: PropTypes.number,
};

export function PostContent({
  title,
  view,
  editvideo,
  deletevideo,
  createdAt,
  index,
}) {
  const isDesktop = useResponsive("up", "md");

  const linkTo = PATH_DASHBOARD.blog.view(paramCase(title));

  const POST_INFO = [
    { number: editvideo, icon: "akar-icons:edit" },
    { number: deletevideo, icon: "eva:trash-2-outline" },
  ];

  return (
    <>
      <CardContent
        sx={{
          pt: 4.5,
          width: 1,
        }}
      >
        <Typography
          gutterBottom
          variant="caption"
          component="div"
          sx={{
            color: "text.disabled",
          }}
        >
          {fDate(createdAt)}
        </Typography>

        <TextMaxLine variant="subtitle2" line={2} persistent>
          {title}
        </TextMaxLine>

        <Stack
          flexWrap="wrap"
          direction="row"
          justifyContent="flex-end"
          sx={{
            mt: 3,
            color: "text.disabled",
          }}
        >
          {/* {POST_INFO.map((info, index) => ( 
            icon={<Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />}
            sx={{ typography: 'caption', ml: index === 0 ? 0 : 1.5 }}
          />
        ))} */}
          <Tooltip title="Delete Event">
            <TextIconLabel
              icon={
                <Iconify
                  icon={"akar-icons:edit"}
                  sx={{ width: 16, height: 16, mr: 0.5, color: "default.main" }}
                />
              }
              sx={{ typography: "caption", ml: index === 0 ? 0 : 1.5 }}
            />
          </Tooltip>
          <TextIconLabel
            icon={
              <Iconify
                icon={"eva:trash-2-outline"}
                sx={{ width: 16, height: 16, mr: 0.5, color: "error.main" }}
              />
            }
            sx={{ typography: "caption", ml: index === 0 ? 0 : 1.5 }}
          />
        </Stack>
      </CardContent>
    </>
  );
}
