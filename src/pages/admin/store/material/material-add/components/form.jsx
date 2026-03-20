import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
import { FormProvider } from "react-hook-form";

import useMaterialsAdd from "../hooks/useMaterialsAdd";
import { Document, Video } from "./item";
import Main from "./main";
import Translate from "src/components/translate";

const Form = () => {
  const { methods, onSubmit } = useMaterialsAdd();

  return (
    <Card sx={{ p: 5 }}>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <Main />

          <Video />
          <Document />

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={methods.formState.isSubmitting}
            >
              <Translate>material.add_material.submit</Translate>
            </LoadingButton>
          </Stack>
        </form>
      </FormProvider>
    </Card>
  );
};

export default Form;
