import {
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";

import { PATH_DASHBOARD } from "src/routes/paths";
import Actions from "./components/Actions";
import CategoryRow from "./components/Row";
import DataList from "./components/dataList";
import { AddForm, EditForm } from "./components/form";
import useList from "./hooks/useList";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const headers = [
  "products.question.no",
  "products.question.titles",
  "products.question.description",
  "products.question.action",
];

const Index = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { state, questionList, fetchQuestionList, rowStart, ...rest } =
    useList();
  const { data, ...dataProps } = state;
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [questionId, setQuestionId] = useState(null);

  const handleClickOpenAddQuestion = () => {
    setOpenAddQuestion(true);
  };

  const handleCloseAddQuestion = () => {
    setOpenAddQuestion(false);
  };

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setQuestionId(id);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true);
    handleCloseMenu();
  };

  const handleCloseEdit = () => setOpenEdit(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  return (
    <>
      <Page title={"products.question.title"}>
        <HeaderBreadcrumbs
          heading={"products.question.question"}
          links={[
            { name: "dashboard", href: PATH_DASHBOARD.root },
            {
              name: "products.question.products",
              href: PATH_DASHBOARD.store.products,
            },
            { name: "products.question.question" },
          ]}
          action={
            <Button
              {...buttonProps}
              variant="contained"
              startIcon={
                <Iconify icon={"eva:plus-fill"} width={20} height={20} />
              }
              onClick={handleClickOpenAddQuestion}
              name="add-questions"
            >
              <Translate>{"products.question.add_question"}</Translate>
            </Button>
          }
        />
        <Card sx={{ p: 2 }}>
          <Scrollbar>
            <DataHandlerTable
              name="documents"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(question, i) => (
                  <DataList
                    handleOpenMenu={handleOpenMenu}
                    question={question}
                    rowNumber={rowStart + i}
                  />
                )}
              />
            </DataHandlerTable>
          </Scrollbar>

          <TableMenu onClose={handleCloseMenu} open={openMenu}>
            <Actions
              openEdit={handleOpenEdit}
              questionId={questionId}
              reload={fetchQuestionList}
              close={handleCloseMenu}
            />
          </TableMenu>

          <Ternary
            when={!dataProps.isArrayEmpty}
            then={<PaginationButtons {...rest} />}
          />
        </Card>
      </Page>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAddQuestion}
        onClose={handleCloseAddQuestion}
        aria-labelledby="add-question"
        TransitionComponent={Transition}
      >
        <AddForm onClose={handleCloseAddQuestion} reload={fetchQuestionList} />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="edit-question"
        TransitionComponent={Transition}
      >
        <EditForm
          selectedId={questionId}
          onClose={handleCloseEdit}
          reload={fetchQuestionList}
        />
      </Dialog>
    </>
  );
};

export default Index;
