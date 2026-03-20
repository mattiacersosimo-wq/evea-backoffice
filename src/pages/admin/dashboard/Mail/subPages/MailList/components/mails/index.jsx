import { Box } from "@mui/material";
import { useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import Map from "src/components/map";
import { useSelectedMails, useSelectedMailsDispatch } from "../../context";
import { selectMail } from "../../context/actions";
import DeleteDialog from "./components/deleteDialog";
import Item from "./components/item";

const Mails = ({ fetchMails, deleteMail, linkTo, dense, mails }) => {
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

  return (
    <>
      <Scrollbar>
        <Box sx={{ minWidth: { md: 800 } }}>
          <Map
            list={mails.allIds}
            render={(mailId) => (
              <Item
                linkTo={linkTo}
                key={mailId}
                isDense={dense}
                mail={mails.byId[mailId]}
                isSelected={data ? data.includes(mailId) : false}
                onSelect={() => handleToggleMailSelection(mailId)}
                openDelete={handleOpenDelete}
              />
            )}
          />
        </Box>
      </Scrollbar>

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
