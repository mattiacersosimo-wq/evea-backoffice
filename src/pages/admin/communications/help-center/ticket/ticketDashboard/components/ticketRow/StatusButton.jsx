import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, ButtonGroup } from "@mui/material";

const StatusButton = ({ selectedItem, handleToggle, enableUpdateStatus }) => (
  <ButtonGroup
    size="small"
    aria-label="split button"
    disabled={!enableUpdateStatus}
  >
    <Button disableRipple disableFocusRipple>
      {selectedItem}
    </Button>
    <Button
      aria-label="select merge strategy"
      aria-haspopup="menu"
      onClick={handleToggle}
    >
      <ArrowDropDownIcon />
    </Button>
  </ButtonGroup>
);

export default StatusButton;
