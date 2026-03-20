import { Box, Card, Collapse, Grid, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { RHFEditor, RHFTextField } from "src/components/hook-form";

import LabelStyle from "src/components/label-style";

import Translate from "src/components/translate";
import BlogCategory from "./BlogCategory";
import Product from "./product";
import Scope from "./scope";

const LeftGrid = () => {
  const { watch } = useFormContext();
  const isPrivate = watch("type") === 1;
  return (
    <Grid item xs={12} md={7}>
      <Card sx={{ p: 3 }}>
        {/* <Stack spacing={0} mb={2}>
          <Scope />
        </Stack> */}
        <Stack spacing={3}>
          <RHFTextField name="title" label="blogs.create.form.blog_title" />
          <BlogCategory />
          <Collapse in={isPrivate}>
            <Product />
          </Collapse>
        </Stack>
        <Stack spacing={3} mt={2}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <Box name="meta-keywords">
              <RHFTextField
                name="meta_keywords"
                label="blogs.create.form.meta_key"
                multiline
                fullWidth
                rows={3}
              />
            </Box>
            <Box name="meta-description">
              <RHFTextField
                name="meta_description"
                label="blogs.create.form.meta_desc"
                multiline
                fullWidth
                rows={3}
              />
            </Box>
          </Box>
        </Stack>
        <Box mt={2}>
          <LabelStyle>
            <Translate>blogs.create.form.content</Translate>
          </LabelStyle>
          <RHFEditor simple name="content" cache />
        </Box>
      </Card>
    </Grid>
  );
};

export default LeftGrid;
