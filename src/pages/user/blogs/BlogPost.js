import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import ReactQuill from "react-quill";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import { SkeletonPost } from "src/components/skeleton";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import EmptyPage from "src/images/blog-demo-img.jpg";
import { PATH_USER } from "src/routes/paths";
import { BlogPostHero } from "src/sections/@dashboard/blog";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import useFetchBlog from "./hooks/useFetchBlog";
import useFetchBlogComments from "./hooks/useFetchBlogComments";
import BlogPostRecent from "./recentPosts";

const BlogPost = () => {
  const post = useFetchBlog();

  const { title, short_description, content, doc_url, image_url } = post;
  const { comments, fetchData } = useFetchBlogComments();
  const modules = {
    toolbar: null,
  };

  return (
    <Page title={post.title}>
      <HeaderBreadcrumbs
        heading="blogs.view.title"
        links={[
          { name: "global.dashboard", href: PATH_USER.root },
          { name: "blogs.view.title", href: PATH_USER.blogs.root },
          { name: title },
        ]}
      />
      <Grid container spacing={3}>
        <Ternary
          when={post}
          then={
            <Grid item xs={12} sm={7} md={8}>
              <Card>
                <BlogPostHero cover={image_url ?? EmptyPage} />

                <Box sx={{ p: { xs: 3, md: 5 } }}>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {title}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    {short_description}
                  </Typography>
                  <ReactQuill
                    value={content}
                    theme="bubble"
                    modules={modules}
                    readOnly
                  />
                  {doc_url ? (
                    <Button
                      LinkComponent="a"
                      href={doc_url}
                      target="_blank"
                      download
                      size="small"
                      startIcon={<Iconify icon="material-symbols:download" />}
                    >
                      <Translate>global.view_document</Translate>
                    </Button>
                  ) : null}

                  <Divider sx={{ my: 5 }} />
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography variant="subtitle2">
                      <Translate>global.comments</Translate>
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "text.disabled" }}
                    >
                      &nbsp; ({comments?.length})
                    </Typography>
                  </Box>
                  <CommentList comments={comments} />
                  <CommentForm reload={fetchData} />
                </Box>
              </Card>
            </Grid>
          }
        />

        <Grid item xs={12} sm={5} md={4}>
          <Ternary when={!post} then={<SkeletonPost />} />
          <BlogPostRecent />
        </Grid>
      </Grid>
    </Page>
  );
};

export default BlogPost;
