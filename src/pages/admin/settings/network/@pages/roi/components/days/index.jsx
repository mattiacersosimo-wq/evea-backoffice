import { LoadingButton } from "@mui/lab";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { FormProvider } from "src/components/hook-form";
import Map from "src/components/map";
import useUpdate from "./hooks/use-update";
import LabelStyle from "src/components/label-style";
import Translate from "src/components/translate";

const Days = () => {
  const { field, methods, onSubmit } = useUpdate();
  const {
    register,
    formState: { isSubmitting },
  } = methods;
  const { fields, update } = field;

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ p: 2 }}>
          <LabelStyle>
            <Translate>global.days</Translate>
          </LabelStyle>
          <FormGroup row>
            <Map
              list={fields}
              render={(data, i) => {
                const { id, name, active } = data;
                return (
                  <FormControlLabel
                    key={id}
                    control={
                      <Checkbox
                        onClick={() => {
                          update(i, { ...data, active: !active });
                        }}
                        checked={active}
                        {...register(`day.${i}.value`)}
                      />
                    }
                    label={name}
                  />
                );
              }}
            />
          </FormGroup>
        </Box>
        <Box
          sx={{
            p: 2,
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <LoadingButton
            variant="contained"
            loading={isSubmitting}
            type="submit"
          >
            <Translate>settings.network.update</Translate>
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
};

export default Days;
