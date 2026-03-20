import PropTypes from "prop-types";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import {
  FormProvider,
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";
import Translate from "src/components/translate";

const Form = (props) => {
  const { methods, onClose } = props;
  return (
    <FormProvider {...props}>
      <DialogContent>
        <DialogContentText>
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              marginTop: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <RHFTextField
              name="name"
              label={"assign_subscriptions.category_name"}
            />
            <RHFEditor
              name="description"
              label={"assign_subscriptions.category_description"}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus color="error" name="close">
          <Translate>{"assign_subscriptions.close"}</Translate>
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={methods.formState.isSubmitting}
          name="submit"
        >
          <Translate> {"assign_subscriptions.submit"}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

Form.propTypes = {
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form;
