import { DialogContent } from "@material-ui/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import useTurnOfEmail from "./hooks/useTurnOfEmail";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const TurnOfMail = ({
  open,
  selectedId,
  onClose,
  fetchData,
  isMailTurnedOn,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const onTurnOfMail = useTurnOfEmail(selectedId, fetchData);

  const handleTurnedOf = async () => {
    const status = await onTurnOfMail();
    if (status) {
      fetchData();
      onClose();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="block-user"
      TransitionComponent={Transition}
    >
      <DialogTitle id="block-user">
        <Translate> {"network_members.turn_off_mail"}</Translate>
      </DialogTitle>
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
            <Typography>
              <Translate>{"network_members.are_you_sure"}</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} name="cancel" color="error">
          <Translate> {"network_members.cancel"}</Translate>
        </Button>
        <Button onClick={handleTurnedOf} variant="contained" name="turn-button">
          {isMailTurnedOn ? "Turn Off" : "Turn On"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TurnOfMail;
