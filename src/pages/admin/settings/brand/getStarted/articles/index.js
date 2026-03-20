import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { useSnackbar } from "notistack";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import EmptyTable from "src/components/emptyTable";
import PaginationButtons from "src/components/pagination";

import axiosInstance from "src/utils/axios";
import Actions from "../../../../../../components/Actions";
import TableMenu from "../../../../../../components/tableMenu";
import EditForm from "./EditForm";
import AddForm from "./addForm";
import articlesRow from "./articlesRow";
import useGetAllArticles from "./hooks/useGetAllArticles";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

// const headers = [

//   <TableCell>{("settings.brand.no")}</TableCell>
//   <TableCell>
//     {("settings.brand.sectionName")}
//   </TableCell>
//   <TableCell>
//     {("settings.brand.menuName")}
//   </TableCell>
//   <TableCell>
//     {("settings.brand.sortOrder")}
//   </TableCell>
//   <TableCell>{("settings.brand.action")}</TableCell>

// ];

const Articles = () => {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const { articlesList, state, fetchArticles, rowStart, ...rest } =
    useGetAllArticles();
  const { data, dataProps } = state;
  const [openMenu, setOpenMenuActions] = useState(null);
  const [openAddArticles, setOpenAddArticles] = useState(false);
  const [openDeleteArticle, setOpenDeleteArticle] = useState(false);
  const [openEditArticles, setOpenEditArticles] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setSelectedArticleId(id);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
    setSelectedArticleId(null);
  };

  const openDeleteDialog = () => setOpenDeleteArticle(true);
  const closeDeleteDialog = () => {
    setOpenDeleteArticle(false);
    handleCloseMenu();
  };

  const handleClickOpenAddArticles = () => {
    setOpenAddArticles(true);
  };
  const handleClickOpenEditArticles = () => {
    setOpenEditArticles(true);
  };

  const handleCloseAddArticles = () => {
    setOpenAddArticles(false);
  };
  const handleCloseEditArticles = () => {
    setOpenEditArticles(false);
  };

  const deleteArticle = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/brand-get-started-articles/${selectedArticleId}`,
        reqData
      );
      if (status === 200) {
        fetchArticles();
        enqueueSnackbar(data.message);
        closeDeleteDialog();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isEmpty = !Boolean(articlesList?.length);

  return (
    <div>
      <Grid container>
        <Grid item sm={12} mr={1} mb={2}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon={"carbon:add"} />}
              onClick={handleClickOpenAddArticles}
              name="add"
            >
              <Translate>{"settings.brand.addArticles"}</Translate>
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Translate>{"settings.brand.no"}</Translate>
                </TableCell>
                <TableCell>
                  <Translate>{"settings.brand.article_name"}</Translate>
                </TableCell>
                <TableCell>
                  <Translate>{"settings.brand.menu_name"}</Translate>
                </TableCell>
                <TableCell>
                  <Translate>{"settings.brand.sortOrder"}</Translate>
                </TableCell>
                <TableCell>
                  <Translate>{"settings.brand.action"}</Translate>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            {isEmpty ? (
              <BodyRow>
                <TableCell colSpan={7} align="center">
                  <EmptyTable title="No Data Available" />
                </TableCell>
              </BodyRow>
            ) : (
              <TableBody>
                {articlesList.map(articlesRow(handleOpenMenu, rowStart))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <Actions
          openEdit={handleClickOpenEditArticles}
          openDelete={openDeleteDialog}
        />
      </TableMenu>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAddArticles}
        onClose={handleCloseAddArticles}
        aria-labelledby="add-articles"
        TransitionComponent={Transition}
      >
        <DialogTitle id="add-articles">
          <Translate>{"settings.brand.addArticles"}</Translate>
        </DialogTitle>
        <AddForm
          fetchArticles={fetchArticles}
          onClose={handleCloseAddArticles}
        />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEditArticles}
        onClose={handleCloseEditArticles}
        aria-labelledby="edit-articles"
        TransitionComponent={Transition}
      >
        <DialogTitle id="edit-articles">
          <Translate> {"settings.brand.editArticles"}</Translate>
        </DialogTitle>
        <EditForm
          fetchArticles={fetchArticles}
          onClose={handleCloseEditArticles}
          articleId={selectedArticleId}
        />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDeleteArticle}
        onClose={closeDeleteDialog}
        aria-labelledby="edit-articles"
        TransitionComponent={Transition}
      >
        <DialogTitle id="edit-articles">
          <Translate>{"settings.brand.deleteArticles"}</Translate>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {" "}
            <Translate>{"settings.brand.areYouSure"}</Translate>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeleteDialog}
            autoFocus
            color="error"
            name="cancel"
          >
            <Translate>{"settings.brand.cancel"}</Translate>
          </Button>
          <LoadingButton
            onClick={deleteArticle}
            type="submit"
            variant="contained"
            name="submit"
          >
            <Translate>{"settings.brand.delete"}</Translate>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <PaginationButtons {...rest} />
    </div>
  );
};

export default Articles;
