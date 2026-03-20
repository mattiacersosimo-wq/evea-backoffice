import { Box, CircularProgress, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

import DataHandlerList from "src/components/data-handler/list";
import Ternary from "src/components/ternary";
import { DeleteDialog, Toolbar } from "./components";
import EmptyMail from "./components/emptyMail";
import Mails from "./components/mails";

const RootStyle = styled("div")({
  flexGrow: 1,
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
});

const MailList = ({
  mails,
  fetchMails,
  deleteMail,
  allMailDelete,
  linkTo,
  pagination,
  dataProps,
  isRefreshLoading,
  setRefreshIsLoading,
  selectedMails,
  setSelectedMails,
}) => {
  const [dense, setDense] = useState(false);
  const isEmpty = mails?.allIds?.length === 0;
  const [openDelete, setOpenDelete] = useState(false);
  const [allDelete, setAllDelete] = useState([]);

  const handleCloseDelete = () => setOpenDelete(false);
  const handleToggleDense = () => {
    setDense((prev) => !prev);
  };
  const handleAllDelete = () => {
    allMailDelete(allDelete)(() => {
      fetchMails();
      handleCloseDelete();
    });
    setSelectedMails(0);
  };
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <RootStyle>
        <Toolbar
          isRefreshLoading={isRefreshLoading}
          setRefreshIsLoading={setRefreshIsLoading}
          selectedMails={selectedMails}
          setSelectedMails={setSelectedMails}
          allIds={mails}
          onToggleDense={handleToggleDense}
          fetchMails={fetchMails}
          handleAllDelete={() => setOpenDelete(true)}
          setAllDelete={setAllDelete}
          allDelete={allDelete}
          allMails={mails}
        />

        <Divider />
        {isLoading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", padding: "5rem" }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Ternary
            when={!isEmpty}
            then={
              <>
                <DataHandlerList
                  name="category-table"
                  dataProps={{ ...dataProps }}
                >
                  <Mails
                    deleteMail={deleteMail}
                    dense={dense}
                    fetchMails={fetchMails}
                    linkTo={linkTo}
                    mails={mails || []}
                    handleAllDelete={setAllDelete}
                    allDelete={allDelete}
                    pagination={pagination}
                  />
                </DataHandlerList>
              </>
            }
            otherwise={<EmptyMail />}
          />
        )}
      </RootStyle>

      <DeleteDialog
        handleDelete={handleAllDelete}
        onClose={handleCloseDelete}
        open={openDelete}
        allDelete={allDelete}
        fetchData={fetchMails}
      />
    </>
  );
};

export default MailList;
