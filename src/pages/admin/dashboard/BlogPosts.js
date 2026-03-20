import { Box, Grid, Stack } from "@mui/material";
import orderBy from "lodash/orderBy";
import { useCallback, useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { SkeletonPostItem } from "src/components/skeleton";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { PATH_USER } from "src/routes/paths";
import {
  BlogPostCard,
  BlogPostsSearch,
  BlogPostsSort,
} from "src/sections/blog";
import axios from "src/utils/axios";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

const applySort = (posts, sortBy) => {
  if (sortBy === "latest") {
    return orderBy(posts, ["createdAt"], ["desc"]);
  }
  if (sortBy === "oldest") {
    return orderBy(posts, ["createdAt"], ["asc"]);
  }
  if (sortBy === "popular") {
    return orderBy(posts, ["view"], ["desc"]);
  }
  return posts;
};

export default function BlogPosts() {
  const isMountedRef = useIsMountedRef();

  const [posts, setPosts] = useState([]);

  const [filters, setFilters] = useState("latest");

  const sortedPosts = applySort(posts, filters);

  const getAllPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://minimal-assets-api.vercel.app/api/blog/posts/all"
      );

      if (isMountedRef.current) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleChangeSort = (value) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Page title="Blog: Posts">
      <Box sx={{ p: 2 }}>
        <HeaderBreadcrumbs
          heading="Blog"
          links={[
            { name: "Dashboard", href: PATH_USER.user_dashboard },
            { name: "Blogs" },
          ]}
        />

        <Stack
          mb={5}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <BlogPostsSearch />
          <BlogPostsSort
            query={filters}
            options={SORT_OPTIONS}
            onSort={handleChangeSort}
          />
        </Stack>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid
                key={post.id}
                item
                xs={12}
                sm={6}
                md={(index === 0 && 6) || 3}
              >
                <BlogPostCard post={post} index={index} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Box>
    </Page>
  );
}
