import {
  Box,
  Checkbox,
  Drawer,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import InputStyle from "src/components/InputStyle";
import { NAVBAR } from "src/config";
import useResponsive from "src/hooks/useResponsive";

import MailSideBar from "src/pages/admin/dashboard/Mail/components/MailSideBar/mailSideBar";

import { useOutletContext } from "react-router";
import { useSelectedMails, useSelectedMailsDispatch } from "../context";
import { deselectAllMail, selectAllMail } from "../context/actions";

const RootStyle = styled("div")(({ theme }) => ({
  height: 84,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
}));

const Toolbar = ({ allIds, onToggleDense, ...other }) => {
  const mails = allIds.length;
  const data = useSelectedMails();
  const selectedMails = data ? data.length : 0;
  const dispatch = useSelectedMailsDispatch();
  const { labels, fetchData } = useOutletContext();

  const [allSelected, setAllSelected] = useState(false);
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");

  const handleSelectChange = (checked) => {
    setAllSelected(checked);
    if (checked) dispatch(selectAllMail(allIds));
    else dispatch(deselectAllMail());
  };

  const selectedSomeMails = selectedMails > 0 && selectedMails < mails;
  const [open, setOpen] = useState(false);
  return (
    <RootStyle {...other}>
      {!mdUp && (
        <IconButton onClick={() => setOpen(true)}>
          <Iconify icon={"eva:menu-fill"} />
        </IconButton>
      )}

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH } }}
      >
        <MailSideBar onClick={() => setOpen(false)} labels={labels} />
      </Drawer>

      {smUp && (
        <>
          <Checkbox
            checked={allSelected}
            indeterminate={selectedSomeMails}
            onChange={(event) => {
              handleSelectChange(event.target.checked);
            }}
          />
          <Tooltip title="Refresh">
            <IconButton>
              <Iconify icon={"eva:refresh-fill"} width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dense">
            <IconButton onClick={onToggleDense}>
              <Iconify icon={"eva:collapse-fill"} width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="More">
            <IconButton>
              <Iconify
                icon={"eva:more-vertical-fill"}
                width={20}
                height={20}
                name="more-button"
              />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <InputStyle
        stretchStart={180}
        size="small"
        placeholder={"adminCommunication.mail.searchMail"}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={"eva:search-fill"}
                sx={{ color: "text.disabled", width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />

      {smUp && (
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Typography variant="body2" sx={{ mx: 2, color: "text.secondary" }}>
            1 - {mails} of {mails}
          </Typography>
          <Tooltip title="Next page">
            <IconButton>
              <Iconify
                icon={"eva:arrow-ios-back-fill"}
                width={20}
                height={20}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Previous page">
            <IconButton>
              <Iconify
                icon={"eva:arrow-ios-forward-fill"}
                width={20}
                height={20}
              />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </RootStyle>
  );
};

Toolbar.propTypes = {
  allIds: PropTypes.array.isRequired,
  onToggleDense: PropTypes.func,
};

export default Toolbar;
