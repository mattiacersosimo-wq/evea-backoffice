import { Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { forwardRef } from "react";

const options = [
  "Overdue",
  "Open",
  "Resolved",
  "Closed",
  "Archived",
  "Deleted",
  "Unverified",
  "Request Approval",
  "In Progress",
  "Responded",
];

const StatusPopup = forwardRef(
  ({ open, onClose, selectedIndex, changeStatus }, ref) => {
    return (
      <Popper
        open={open}
        anchorEl={ref.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={onClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      onClick={() => changeStatus(option)}
                      key={option}
                      selected={index === selectedIndex}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  }
);
export default StatusPopup;
