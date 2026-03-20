import { Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import Iconify from "src/components/Iconify";
import { FormProvider } from "src/components/hook-form";

import Translate from "src/components/translate";
import { defaultValues } from "../hooks/useAddCategory";
import useAddDialog from "../hooks/useAddDialog";
import Form from "./Form";
import Transition from "src/utils/dialog-animation";

const AddDialog = ({ open, onClose, reload }) => {
  const { methods, onSubmit } = useAddDialog(() => {
    reload();
    onClose();
  });

  useEffect(() => {
    methods.reset(defaultValues);
    return () => methods.reset(defaultValues);
  }, []);
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="add-Category"
      TransitionComponent={Transition}
    >
      <DialogTitle
        variant="h5"
        id="add-Category"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="span">
          <Translate>blogs.categories.create.title</Translate>
        </Typography>
        {/* <IconButton aria-label="close" onClick={onClose}>
          <Iconify icon="ic:baseline-close" />
        </IconButton> */}
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Form onClose={onClose} />
      </FormProvider>
    </Dialog>
  );
};

export default AddDialog;
