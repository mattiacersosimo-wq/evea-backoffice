import { Box, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import FilterBar from "src/components/filterBar";
import { FormProvider } from "src/components/hook-form";
import Loop from "src/components/loop";
import PaginationButtons from "src/components/pagination";
import { SkeletonPostItem } from "src/components/skeleton";
import Ternary from "src/components/ternary";

import { PATH_USER } from "src/routes/paths";
import BlogFilter from "./BlogFilter";
import { BlogPostCard } from "./components";
import useFilterForm from "./hooks/filter/useFilterForm";
import useGetBlogs from "./hooks/useGetBlogs";
import { useTheme } from "@mui/material/styles";


const BlogPosts = () => {
  const methods = useFilterForm();

  const { watch } = methods;
  const filter = watch();

  const { state, fetchData, rowStart, ...rest } = useGetBlogs(filter);

  const { data, ...dataProps } = state;

  const onFilter = methods.handleSubmit((inputData) => fetchData(1, inputData));
  const theme = useTheme();

  return (
    <Page title="blogs.title">
      <Box>
        <HeaderBreadcrumbs
          sx={{ mb: 1, pl: 1 }}
          heading="blogs.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.user_dashboard },
            { name: "blogs.title" },
          ]}
        />

        <FilterBar>
          <FormProvider methods={methods} onSubmit={onFilter}>
            <BlogFilter />
          </FormProvider>
        </FilterBar>
        <DataHandlerList dataProps={dataProps}>
          <Box>
            <Box
              sx={{
                display: "grid", backgroundColor: theme.palette.background.paper,
                p: 2,
                columnGap: 2,
                borderRadius:1,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)",
                },
              }}
            >
              <Loop
                list={data}
                render={(post, index) => (
                  <Ternary
                    when={post}
                    then={
                      <Grid key={post.id} item>
                        <BlogPostCard post={post} index={index} />
                      </Grid>
                    }
                    otherwise={<SkeletonPostItem key={index} />}
                  />
                )}
              />
            </Box>
            <PaginationButtons {...rest} />
          </Box>
        </DataHandlerList>
      </Box>
    </Page>
  );
};

export default BlogPosts;
