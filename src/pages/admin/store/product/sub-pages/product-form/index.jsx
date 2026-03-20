import { Grid } from "@mui/material";
import { FormProvider } from "src/components/hook-form";
import LeftHandPane from "./components/left-hand-pane";
import RightHandPane from "./components/right-hand-pane";

const ProductForm = (props) => {
  const { methods, onSubmit } = props;

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <LeftHandPane />

        <RightHandPane />
      </Grid>
    </FormProvider>
  );
};

export default ProductForm;
