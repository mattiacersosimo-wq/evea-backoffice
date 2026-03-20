import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
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
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import TableMenu from "src/components/tableMenu";

import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";
import axiosInstance from "src/utils/axios";
import Actions from "../coupons/actions";
import EditForm from "./EditForm";
import useEditReviews from "./hooks/useEditReview";
import useGetProductsReviews from "./hooks/useGetProductsReviews";
import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    edit: test("edit"),
    remove: test("delete"),
  };
};

const ReviewView = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { productReviews, fetchReviewsOfSingleProduct } =
    useGetProductsReviews();
  const [selectedId, setSelectedId] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => {
    setOpenEdit(false);
    handleCloseMenu();
  };

  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = (id) => (e) => {
    setSelectedId(id);
    setOpenMenu(e.currentTarget);
  };
  const handleCloseMenu = () => {
    setSelectedId(null);
    setOpenMenu(false);
  };

  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => {
    setOpenDelete(false);
    handleCloseMenu();
  };

  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/user-reviews/${selectedId}`,
        reqData
      );
      if (status === 200) {
        fetchReviewsOfSingleProduct();
        enqueueSnackbar(data.message);
        handleCloseDelete();
      }
    } catch (err) {
      handleCloseDelete();
      enqueueSnackbar("Failed to delete", { variant: "error" });
    }
  };

  const status = genStatus("nav.store.title", "nav.store.user_review");
  const { remove, edit } = status;
  const { t } = useTranslation();
  return (
    <>
      <div>
        <Page title={"user_review.review_view_title"}>
          <Box sx={{ p: 2 }}>
            <HeaderBreadcrumbs
              heading={"user_review.review_view"}
              links={[
                { name: "global.dashboard", href: PATH_DASHBOARD.root },
                {
                  name: "user_review.user_review",
                  href: PATH_DASHBOARD.store.user_reviews,
                },
                { name: "user_review.review_view" },
              ]}
            />
            <Card sx={{ p: 3 }}>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 720 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("user_review.no")}</TableCell>
                        <TableCell>{t("user_review.user_name")}</TableCell>
                        <TableCell>{t("user_review.comment")}</TableCell>
                        <TableCell>{t("user_review.rating")}</TableCell>
                        <TableCell>{t("user_review.action")}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productReviews?.map((row, i) => {
                        return (
                          <TableRow key={row.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{row.username}</TableCell>
                            <TableCell>{row.comment}</TableCell>
                            <TableCell>{row.rating}</TableCell>
                            <TableCell>
                              <IconButton
                                disabled={!(remove || edit)}
                                onClick={handleOpenMenu(row.id)}
                                name="more-button"
                              >
                                <Iconify
                                  icon={"eva:more-vertical-fill"}
                                  width={20}
                                  height={20}
                                  name="more-button"
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Box>
        </Page>
      </div>

      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <Actions
          status={status}
          openDelete={handleOpenDelete}
          openEdit={handleOpenEdit}
        />
      </TableMenu>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="delete-review"
        TransitionComponent={Transition}
      >
        <DialogTitle id="delete-review">
          <Translate>user_review.delete_review</Translate>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                },
              }}
            >
              <Typography>
                <Translate>user_review.are_you_sure</Translate>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} name="cancel">
            <Translate>user_review.cancel</Translate>
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            name="delete"
          >
            <Translate>user_review.delete</Translate>
          </Button>
        </DialogActions>
      </Dialog>
      <EditDialog
        onClose={handleCloseEdit}
        open={openEdit}
        selectedId={selectedId}
        fetchReviewsOfSingleProduct={fetchReviewsOfSingleProduct}
      />
    </>
  );
};

const EditDialog = ({
  open,
  onClose,
  selectedId,
  fetchReviewsOfSingleProduct,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { methods, fetchReviewById, onSubmit } = useEditReviews(
    selectedId,
    onClose,
    fetchReviewsOfSingleProduct
  );

  useEffect(() => {
    if (open) fetchReviewById(selectedId);
  }, [selectedId, open]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-review"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-review">
        <Translate>user_review.edit_review</Translate>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <EditForm methods={methods} onSubmit={onSubmit} onClose={onClose} />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewView;
