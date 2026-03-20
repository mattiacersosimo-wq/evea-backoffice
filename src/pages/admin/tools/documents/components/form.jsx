import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";

import { FormControl } from "@mui/material";
import { useTranslation } from "react-i18next";

import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";

const Form = ({ methods, onSubmit, onClose }) => {
  const {
    formState: { errors },
  } = methods;
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogContent>
        <DialogContentText>
          <Box mt={3}>
            <FormControl fullWidth>
              <RHFTextField
                name="title"
                id="doc-title"
                label={"tools.documents.docTitle"}
                variant="outlined"
                inputProps={{ maxLength: 50 }}
              />
            </FormControl>
          </Box>

          <Box mt={3}>
            <FormControl fullWidth>
              <RHFTextField
                onWheel={(e) => e.target.blur()}
                name="sort_order"
                id="sort-order"
                label={"tools.documents.sortOrders"}
                variant="outlined"
                type="number"
              />
            </FormControl>
          </Box>
          <Box mt={3}>
            <FormControl fullWidth>
              <TextField
                type="file"
                inputProps={{ accept: ".xlsx, .xls, .pdf" }}
                {...methods.register("document_url")}
                label={t("tools.documents.uploadDocument")}
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.document_url)}
                helperText={t(errors.document_url?.message)}
                name="document_url"
              />
            </FormControl>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus color="error" name="close">
          <Translate>tools.documents.close</Translate>
        </Button>
        <LoadingButton
          loading={methods.formState.isSubmitting}
          type="submit"
          variant="contained"
          autoFocus
          name="submit"
        >
          <Translate>tools.documents.submit</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export default Form;
