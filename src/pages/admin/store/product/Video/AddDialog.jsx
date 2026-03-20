import { Dialog, DialogTitle, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Form from "./Form";
import useAddVideo from "./hooks/useAddVideo";
import Translate from "src/components/translate";
import { useTranslation } from "react-i18next";
import Transition from "src/utils/dialog-animation";

const AddDialog = ({ open, onClose, fetchData }) => {
  const theme = useTheme();
  const onSubmit = useAddVideo(() => {
    onClose();
    fetchData();
  });
  const { t } = useTranslation();
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="add-video"
      TransitionComponent={Transition}
    >
      <DialogTitle id="add-video">
        <Translate> {"products.video.addVideo"}</Translate>
      </DialogTitle>
      <Form
        onClose={onClose}
        onSubmit={onSubmit}
        buttonLabel={t("products.video.add")}
      />
    </Dialog>
  );
};

export default AddDialog;
