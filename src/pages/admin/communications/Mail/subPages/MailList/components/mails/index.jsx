import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import Loop from "src/components/loop";
import PaginationButtons from "src/components/pagination";
import { useSelectedMails, useSelectedMailsDispatch } from "../../context";
import { selectMail } from "../../context/actions";
import DeleteDialog from "./components/deleteDialog";
import Item from "./components/item";

const Mails = ({
  fetchMails,
  deleteMail,
  linkTo,
  dense,
  mails,
  handleAllDelete,
  allDelete,
  pagination,
}) => {
  const data = useSelectedMails();
  const dispatch = useSelectedMailsDispatch();

  const handleToggleMailSelection = (mailId) => dispatch(selectMail(mailId));

  const [selectedId, setSelectedId] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = (id) => () => {
    setOpenDelete(true);
    setSelectedId(id);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleDelete = () => {
    deleteMail(selectedId)(() => {
      fetchMails();
      handleCloseDelete();
    });
  };
  const handleAllIds = (id) => {
    let prev = [...allDelete];
    const index = prev.findIndex((item) => item === id);
    if (index > -1) {
      prev.splice(index, 1);
    } else {
      prev = [...prev, id];
    }
    handleAllDelete(prev);
  };

  return (
    <>
      <Scrollbar>
        <Box sx={{ minWidth: { md: 800 } }}>
          <Loop
            list={mails}
            render={(mailId) => {
              return (
                <Item
                  linkTo={linkTo}
                  key={mailId}
                  isDense={dense}
                  mail={mailId}
                  isSelected={data ? data.includes(mailId) : false}
                  onSelect={(id) => {
                    handleToggleMailSelection(mailId);
                    handleAllIds(id);
                  }}
                  openDelete={handleOpenDelete}
                />
              );
            }}
          />
        </Box>
      </Scrollbar>

      <Box
        sx={{
          p: 3,
          width: "100%",
        }}
      >
        <PaginationButtons {...pagination} />
      </Box>

      <DeleteDialog
        handleDelete={handleDelete}
        onClose={handleCloseDelete}
        open={openDelete}
        selectedId={selectedId}
        fetchData={fetchMails}
      />
    </>
  );
};

export default Mails;
