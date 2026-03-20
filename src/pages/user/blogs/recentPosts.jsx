import { Box, Card, Chip, Grid, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Loop from "src/components/loop";

import Translate from "src/components/translate";
import { PATH_USER } from "src/routes/paths";
import BlogPostCard from "./blogPostCard";
import useGetBlogCategory from "./hooks/useGetBlogCategory";
import useGetRecentPosts from "./hooks/useRecentPosts";

const BlogPostRecent = ({}) => {
  const { posts } = useGetRecentPosts();

  const navigate = useNavigate();

  const categories = useGetBlogCategory();

  return (
    <>
      <Typography variant="subtitle2" sx={{ mt: 0, mb: 2 }}>
        <Translate>blogs.view.recent</Translate>
      </Typography>

      <Box>
        {posts.map((post) => (
          <Grid key={post.id} item xs={12}>
            <BlogPostCard post={post} />
          </Grid>
        ))}
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 0, mb: 2 }}>
        <Translate>blogs.view.latest_category</Translate>
      </Typography>

      <Box>
        <Grid item xs={12}>
          <Card
            component={Stack}
            direction="row"
            spacing={1}
            sx={{
              p: 2,
              mb: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Loop
              list={categories}
              render={({ name, id }) => {
                return (
                  <Chip
                    onClick={() =>
                      navigate(PATH_USER.blogs.category({ category_id: id }))
                    }
                    color="primary"
                    variant="outlined"
                    key={id}
                    label={name}
                    style={{
                      marginBottom: "10px",
                    }}
                  />
                );
              }}
            />
          </Card>
        </Grid>
      </Box>
    </>
  );
};

BlogPostRecent.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default BlogPostRecent;
