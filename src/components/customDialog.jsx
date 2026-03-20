import { Dialog } from "@mui/material";
import { createContext, useContext } from "react";
import Transition from "src/utils/dialog-animation";

const DialogContext = createContext("");
export const { Provider: DialogProvider } = DialogContext;

export const useDialogContext = () => useContext(DialogContext);
export const CustomDialog = ({ name, children }) => {
  const { openDialog, open } = useDialogContext();

  return (
    <Dialog
      TransitionComponent={Transition}
      open={openDialog === name}
      onClose={() => open("")}
    >
      {children}
    </Dialog>
  );
};
