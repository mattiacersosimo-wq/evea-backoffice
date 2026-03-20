import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useState } from "react";

import { Button, CircularProgress } from "@mui/material";

import { capitalCase } from "change-case";
import Ternary from "src/components/ternary";
import StatusMenu from "./components/status-menu";
import UpdateDialog from "./components/update-dialog";

const StatusButton = ({ ticketStatus, fetchTicket }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonGroup size="small" aria-label="split button" variant="outlined">
        <Button disableRipple disableFocusRipple>
          <Ternary
            when={Boolean(ticketStatus)}
            then={capitalCase(ticketStatus)}
            otherwise={<CircularProgress size={20} />}
          />
        </Button>
        <Button
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleClick}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <StatusMenu anchorEl={anchorEl} onClose={handleClose} />

      <UpdateDialog fetchTicket={fetchTicket} />
    </>
  );
};

export default StatusButton;
