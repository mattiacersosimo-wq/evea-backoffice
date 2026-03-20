import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import Iconify from "src/components/Iconify";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";

const Search = ({ fetchData }) => {
  const methods = useForm({ defaultValues: { product_name: "" } });
  const { handleSubmit, watch, setValue } = methods;
  const onSubmit = async (inputData) => {
    const { product_name } = inputData;
    if (Boolean(product_name)) {
      fetchData(1, { product_name });
    } else {
      fetchData(1);
    }
  };

  const productName = watch("product_name");

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing={2}>
        <RHFTextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{
                    color: productName.length > 0 ? "default" : "transparent",
                  }}
                  onClick={() => {
                    setValue("product_name", "");
                    onSubmit();
                  }}
                  size="small"
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <Iconify
                    sx={{
                      color: productName.length > 0 ? "default" : "transparent",
                    }}
                    icon="iconamoon:close"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          name="product_name"
          size="small"
          label="global.product_name"
        />
        <LoadingButton
          size="small"
          variant="contained"
          type="submit"
          loading={methods.formState.isSubmitting}
        >
          <Translate>search.search</Translate>
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export default Search;
