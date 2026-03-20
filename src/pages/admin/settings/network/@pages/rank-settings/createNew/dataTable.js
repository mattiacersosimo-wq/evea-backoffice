import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";

import useFetchFaqList from "../hooks/useFetchFaqList";
import Actions from "./Actions";
import faqManagementRow from "./faqManagementRow";
import { AddFaqForm, EditFaqForm } from "./form";
import TableMenu from "./tableMenu";
import Transition from "src/utils/dialog-animation";

const DataTable = () => {
  const [faqId, setFaqId] = useState([]);

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setFaqId(id);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const theme = useTheme();
  const [openFaq, setOpenFaq] = useState(false);
  const [openViewFaq, setOpenViewFaq] = useState(false);

  const handleClickOpenFaq = () => {
    handleCloseMenu();
    setOpenFaq(true);
  };
  const handleClickOpenViewFaq = () => {
    handleCloseMenu();
    setOpenViewFaq(true);
  };

  const handleCloseFaq = () => {
    setOpenFaq(false);
  };
  const handleCloseViewFaq = () => {
    setOpenViewFaq(false);
  };

  const { faqList, fetchFaqList } = useFetchFaqList();

  return (
    <Page title="FAQ's Management: Tools">
      <Card>
        <Grid container>
          <Grid item sm={12} mr={1} mb={1} mt={1}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Iconify icon={"carbon:add"} />}
                onClick={handleClickOpenFaq}
              >
                FAQ's
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{"adminCommunication.faqs.no"}</TableCell>
                  <TableCell>{"adminCommunication.faqs.questions"}</TableCell>
                  <TableCell>{"adminCommunication.faqs.action"}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {faqList.map(faqManagementRow(handleOpenMenu))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Actions
            faqId={faqId}
            fetchFaqList={fetchFaqList}
            close={handleCloseMenu}
            openEdit={handleClickOpenViewFaq}
          />
        </TableMenu>

        <Divider />
      </Card>

      <Dialog
        open={openFaq}
        onClose={handleCloseFaq}
        aria-labelledby="add-faqs"
        TransitionComponent={Transition}
      >
        <AddFaqForm cancel={handleCloseFaq} fetchFaqList={fetchFaqList} />
      </Dialog>

      <Dialog
        open={openViewFaq}
        onClose={handleCloseViewFaq}
        aria-labelledby="faqs-category"
        TransitionComponent={Transition}
      >
        <EditFaqForm
          selectedId={faqId}
          cancel={handleCloseViewFaq}
          fetchFaqList={fetchFaqList}
        />
      </Dialog>
    </Page>
  );
};

export default DataTable;
