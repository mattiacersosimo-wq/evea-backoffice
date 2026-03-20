import { Dialog, DialogTitle, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Form from "./Form";
import useEditDialog from "./hooks/useEditDialog";
import Translate from "src/components/translate";
import { useTranslation } from "react-i18next";
import Transition from "src/utils/dialog-animation";

const EditDialog = ({ data, onClose, fetchData }) => {
  const theme = useTheme();
  const onSubmit = useEditDialog(() => {
    onClose();
    fetchData();
  });
  const { t } = useTranslation();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(data)}
      onClose={onClose}
      aria-labelledby="edit-video"
      TransitionComponent={Transition}
    >
      <DialogTitle id="edit-video">
        <Translate> {"products.video.edit_video"}</Translate>
      </DialogTitle>
      <Form
        onClose={onClose}
        onSubmit={onSubmit}
        data={data}
        buttonLabel={t("products.video.update")}
      />
    </Dialog>
  );
};

export default EditDialog;
