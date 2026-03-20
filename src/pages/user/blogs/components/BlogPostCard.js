import { Box, Card, CardContent, Link, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import Image from "src/components/Image";
import TextMaxLine from "src/components/TextMaxLine";
import ParseDate from "src/components/date";
import EmptyPage from "src/images/blog-demo-img.jpg";
import { PATH_USER } from "src/routes/paths";

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  const {
    id,
    image_url: cover,
    title,
    content: view,
    comment,
    share,
    short_description,
    created_at: createdAt,
  } = post;
  const linkTo = PATH_USER.blogs.view(id);

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Image alt="cover" src={cover ?? EmptyPage} ratio="4/3" />
        </Link>
      </Box>

      <PostContent
        title={title}
        view={view}
        comment={comment}
        share={share}
        createdAt={createdAt}
        short_description={short_description}
        id={id}
      />
    </Card>
  );
}

PostContent.propTypes = {
  comment: PropTypes.number,
  createdAt: PropTypes.string,
  share: PropTypes.number,
  short_description: PropTypes.string,
  title: PropTypes.string,
  view: PropTypes.number,
};

export function PostContent({ title, id, createdAt, short_description }) {
  const linkTo = PATH_USER.blogs.view(id);

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
          <ParseDate date={createdAt} />
        </Typography>

        <Link to={linkTo} color="inherit" component={RouterLink}>
          <TextMaxLine
            variant="subtitle2"
            line={1}
            persistent
            sx={{ height: "29px", fontSize: "15px" }}
          >
            {title}
          </TextMaxLine>
        </Link>
        <Typography variant="p" className="blogCntnt" sx={{ mt: 1, mb: 1 }}>
          {short_description}
        </Typography>
      </CardContent>
    </>
  );
}
