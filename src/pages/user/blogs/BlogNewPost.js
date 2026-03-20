import { Container } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import useSettings from "src/hooks/useSettings";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import { BlogNewPostForm } from "src/sections/@dashboard/blog";

export default function BlogNewPost() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Blog: New Post">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="Create a new post"
          links={[
            { name: "Dashboard", href: PATH_USER.root },
            { name: "Blog", href: PATH_USER.blogs.root },
            { name: "New Post" },
          ]}
        />

        <BlogNewPostForm />
      </Container>
    </Page>
  );
}
