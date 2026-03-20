import { Box, Card, CardContent, Link, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import Image from "src/components/Image";
import SvgIconStyle from "src/components/SvgIconStyle";
import TextMaxLine from "src/components/TextMaxLine";
import ParseDate from "src/components/date";
import useResponsive from "src/hooks/useResponsive";
import { PATH_USER } from "src/routes/paths";

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  const isDesktop = useResponsive("up", "md");
  const {
    image_url: cover,
    title,
    id,
    created_at: createdAt,
    short_description: description,
  } = post;
  const linkTo = PATH_USER.blogs.view(id);
  const latestPost = index === 0 || index === 1 || index === 2;

  if (isDesktop && latestPost) {
    return null;
  }

  return (
    <Card
      sx={{ display: "flex", mb: 2, flexWrap: "wrap", alignItems: "center" }}
    >
      <Box sx={{ position: "relative", width: "100px", p: 2 }}>
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
        {/* <Avatar
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Admin"
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: "absolute",
          }}
        /> */}
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Image
            sx={{ borderRadius: "8px" }}
            alt="cover"
            src={cover}
            ratio="4/3"
          />
        </Link>
      </Box>

      <PostContent
        title={title}
        createdAt={createdAt}
        linkTo={linkTo}
        description={description}
      />
    </Card>
  );
}

PostContent.propTypes = {
  createdAt: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export function PostContent({ title, createdAt, linkTo, description }) {
  const POST_INFO = [
    { number: Math.random() * 10000, icon: "eva:message-circle-fill" },
    { number: Math.random() * 100000, icon: "eva:eye-fill" },
    { number: Math.random() * 1000, icon: "eva:share-fill" },
  ];

  return (
    <>
      <CardContent
        sx={{
          p: "15px 10px 0 0",
          width: "calc(100% - 120px)",
        }}
      >
        <Typography
          gutterBottom
          variant="caption"
          component="div"
          sx={{
            color: "text.disabled",
            pb: 0,
            mb: 0,
          }}
        >
          <ParseDate date={createdAt} />
        </Typography>

        <Link to={linkTo} color="inherit" component={RouterLink}>
          <TextMaxLine variant="subtitle2" line={1} persistent>
            {title}
          </TextMaxLine>
        </Link>
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "12px",
          }}
        >
          {" "}
          {description}{" "}
        </Typography>

        {/* <Stack
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
        </Stack> */}
      </CardContent>
    </>
  );
}
