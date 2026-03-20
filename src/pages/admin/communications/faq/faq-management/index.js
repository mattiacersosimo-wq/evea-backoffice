import { Box, Button, Card, Dialog, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import Actions from "./components/Actions";
import { AddFaqForm, EditFaqForm } from "./components/form";
import DataList from "./components/list/dataList";
import useFetchFaqList from "./hooks/useFetchFaqList";
import Transition from "src/utils/dialog-animation";

const headers = [
  "faq.faqs.table.no",
  "faq.faqs.table.question",
  "faq.faqs.table.answer",
  "faq.faqs.table.action",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);

  return {
    add: test("add-faq"),
    edit: test("edit-faq"),
    delete: test("delete-faq"),
    category: test("category"),
  };
};
const FaqManagement = () => {
  const [faqId, setFaqId] = useState([]);
  const status = genStatus("nav.communication.title", "nav.communication.faqs");
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

  const { state, faqList, fetchFaqList, rowStart, ...rest } = useFetchFaqList();
  const { data, ...dataProps } = state;

  return (
    <>
      <Card>
        <Grid container>
          <Grid item sm={12} mr={1} mb={1} mt={1}>
            <Box display="flex" justifyContent="flex-end">
              <Ternary
                when={status.add}
                then={
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon={"carbon:add"} />}
                    onClick={handleClickOpenFaq}
                    name="add-faq"
                  >
                    <Translate>faq.faqs.add</Translate>
                  </Button>
                }
              />
            </Box>
          </Grid>
        </Grid>

        <Scrollbar>
          <DataHandlerTable
            name="faq-table"
            headers={headers}
            dataProps={dataProps}
          >
            <Map
              list={data}
              render={(faq, i) => (
                <DataList
                  disableAction={!(status.edit || status.delete)}
                  handleOpenMenu={handleOpenMenu}
                  faq={faq}
                  rowNumber={rowStart + i}
                />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>

        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Actions
            status={status}
            faqId={faqId}
            fetchFaqList={fetchFaqList}
            close={handleCloseMenu}
            openEdit={handleClickOpenViewFaq}
            {...rest}
          />
        </TableMenu>
      </Card>
      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />

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
          {...rest}
        />
      </Dialog>
    </>
  );
};

export default FaqManagement;
