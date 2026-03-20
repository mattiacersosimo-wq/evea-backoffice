import {
  Avatar,
  Box,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { paramCase } from "change-case";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import SvgIconStyle from "src/components/SvgIconStyle";
import TextIconLabel from "src/components/TextIconLabel";
import TextMaxLine from "src/components/TextMaxLine";
import useResponsive from "src/hooks/useResponsive";
import { PATH_USER } from "src/routes/paths";
import { fShortenNumber } from "src/utils/formatNumber";
import { fDate } from "src/utils/formatTime";

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  const isDesktop = useResponsive("up", "md");

  const { cover, title, view, comment, share, author, createdAt } = post;
  const linkTo = PATH_USER.blogs.view(paramCase(title));
  const latestPost = index === 0 || index === 1 || index === 2;

  if (isDesktop && latestPost) {
    return null;
  }

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <SvgIconStyle
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
          src={author.avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: "absolute",
          }}
        />
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Image alt="cover" src={cover} ratio="4/3" />
        </Link>
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

PostContent.propTypes = {
  comment: PropTypes.number,
  createdAt: PropTypes.string,
  share: PropTypes.number,
  title: PropTypes.string,
  view: PropTypes.number,
};

export function PostContent({ title, view, comment, share, createdAt }) {
  const linkTo = PATH_USER.blogs.view(paramCase(title));

  const POST_INFO = [
    { number: comment, icon: "eva:message-circle-fill" },
    { number: view, icon: "eva:eye-fill" },
    { number: share, icon: "eva:share-fill" },
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

        <Link to={linkTo} color="inherit" component={RouterLink}>
          <TextMaxLine variant="subtitle2" line={2} persistent>
            {title}
          </TextMaxLine>
        </Link>

        <Stack
          flexWrap="wrap"
          direction="row"
          justifyContent="flex-end"
          sx={{
            mt: 3,
            color: "text.disabled",
          }}
        >
          {POST_INFO.map((info, index) => (
            <TextIconLabel
              key={index}
              icon={
                <Iconify
                  icon={info.icon}
                  sx={{ width: 16, height: 16, mr: 0.5 }}
                />
              }
              value={fShortenNumber(info.number)}
              sx={{ typography: "caption", ml: index === 0 ? 0 : 1.5 }}
            />
          ))}
        </Stack>
      </CardContent>
    </>
  );
}
