import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FormProvider } from "src/components/hook-form";

import { useEffect } from "react";
import UsersSearch from "src/components/autoComplete/users";
import useUpdateOwner from "../hook/useUpdateOwner";
import Transition from "src/utils/dialog-animation";

const UpdateOwner = ({
  openDialogue,
  onCloseDialogue,
  fetchTicket,
  selectedId,
  ticketNumber,
}) => {
  const { methods, onSubmit } = useUpdateOwner((id) => {
    fetchTicket(id);
    onCloseDialogue();
  });
  useEffect(() => {
    methods.setValue("user_id", selectedId);
  }, [selectedId]);

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDialogue}
        onClose={onCloseDialogue}
        aria-labelledby="delete-Subscription"
        TransitionComponent={Transition}
      >
        <DialogTitle id="delete-Subscription">
          Change Owner For Ticket : {ticketNumber}
        </DialogTitle>
        <FormProvider methods={methods} onSubmit={onSubmit}>
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
                <UsersSearch name="user_id" />
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseDialogue}>Cancel</Button>
            <Button variant="contained" type="submit">
              update
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </div>
  );
};

export default UpdateOwner;
