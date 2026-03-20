import { makeStyles } from "@material-ui/core/styles";
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
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import InputStyle from "src/components/InputStyle";
import { NAVBAR } from "src/config";

import useResponsive from "src/hooks/useResponsive";

import { LoadingButton } from "@mui/lab";
import { useOutletContext } from "react-router";
import MailSideBar from "../../../components/MailSideBar/mailSideBar";
import { useSelectedMails, useSelectedMailsDispatch } from "../context";
import { deselectAllMail, selectAllMail } from "../context/actions";

const RootStyle = styled("div")(({ theme }) => ({
  height: 84,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
}));
const useStyles = makeStyles((theme) => ({
  button: {
    position: "relative",
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const Toolbar = ({
  allIds,
  onToggleDense,
  fetchMails,
  handleAllDelete,
  setAllDelete,
  allDelete,
  allMails,
  setSelectedMails,
  selectedMails,
  isRefreshLoading,
  setRefreshIsLoading,
  ...other
}) => {
  const [allEmailIds, setAllEmailIds] = useState([]);

  const [isChecked, setIsChecked] = useState(false);
  // const [selectedMails, setSelectedMails] = useState(0);
  const [allSelected, setAllSelected] = useState(false);
  const mails = allIds?.length;
  const data = useSelectedMails();

  useEffect(() => {
    setSelectedMails(data ? data?.length : 0);
    if (selectedMails === selectedMails) {
      setAllSelected(true);
    }
  }, [data]);
  const dispatch = useSelectedMailsDispatch();
  const { labels, fetchData } = useOutletContext();
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");

  useEffect(() => {
    const array = Object.values(allMails).map((item) => item?.email_id);
    setAllEmailIds(array);
  }, [allMails]);

  const handleSelectChange = (checked) => {
    setAllSelected(checked);
    if (checked) dispatch(selectAllMail(allIds));
    else dispatch(deselectAllMail());
    if (checked) {
      const ids = allIds.map(({ id }) => id);
      setAllDelete(ids);
    } else {
      setAllDelete([]);
    }
  };

  const selectedSomeMails = selectedMails > 0 && selectedMails < mails;

  const [open, setOpen] = useState(false);

  // const refreshPage = () => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     fetchMails();
  //     setIsLoading(false);
  //     setAllSelected(false);
  //     setIsChecked(false);
  //     selectAllMail("");
  //     setSelectedMails(0);
  //   }, 2000);
  // };
  const refreshPage = () => {
    setRefreshIsLoading(true);
    setTimeout(() => {
      setRefreshIsLoading(false);
    }, 2000);
    fetchMails();
    fetchData();
  };

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
        <MailSideBar
          onClick={() => setOpen(false)}
          labels={labels}
          fetchData={fetchData}
        />
      </Drawer>

      {smUp && (
        <>
          <Checkbox
            checked={selectedMails != 0 ? allSelected : ""}
            indeterminate={selectedSomeMails}
            onChange={(event) => {
              handleSelectChange(event.target.checked);
            }}
          />
          {selectedMails ? (
            ""
          ) : (
            <Tooltip title="Refresh">
              <LoadingButton
                onClick={refreshPage}
                style={{
                  borderRadius: "50%",
                  minWidth: "40px",
                  height: "40px",
                }}
                loading={isRefreshLoading}
              >
                <Iconify icon={"eva:refresh-fill"} width={20} height={20} />
              </LoadingButton>
            </Tooltip>
          )}

          {/* <Tooltip title="Dense">
            <IconButton onClick={onToggleDense}>
              <Iconify icon={"eva:collapse-fill"} width={20} height={20} />
            </IconButton>
          </Tooltip> */}
          {selectedMails ? (
            <Tooltip title="Delete">
              <IconButton onClick={handleAllDelete}>
                <Iconify icon={"ic:baseline-delete"} width={20} height={20} />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
        </>
      )}

      <Box sx={{ flexGrow: 1 }} />

      {/* <InputStyle
        stretchStart={180}
        size="small"
        placeholder={("adminCommunication.mail.searchMail")}
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
      /> */}

      {/* {smUp && (
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
      )} */}
    </RootStyle>
  );
};

Toolbar.propTypes = {
  allIds: PropTypes.array.isRequired,
  onToggleDense: PropTypes.func,
};

export default Toolbar;
