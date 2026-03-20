import { Grid } from "@mui/material";
import { FormProvider } from "react-hook-form";
import LeftGrid from "./components/leftGrid";
import RightGrid from "./components/rightGrid";
import Wrapper from "./components/wrapper";

const BlogForm = ({ methods, onSubmit, isEdit }) => {
  return (
    <>
      <Wrapper isEdit={isEdit}>
        <FormProvider {...methods}>
          <Grid container spacing={3}>
            <LeftGrid />
            <RightGrid onSubmit={onSubmit} />
          </Grid>
        </FormProvider>
      </Wrapper>
    </>
  );
};

export default BlogForm;
