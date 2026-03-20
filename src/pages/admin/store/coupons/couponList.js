import { useState } from "react";

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
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";

import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import Actions from "./actions";
import useCoupons from "./hooks/useCoupons";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const headers = [
  "coupons.no",
  "coupons.couponName",
  "coupons.code",
  "coupons.type",
  "coupons.used_available",
  "coupons.discountFix",
  "coupons.startDate",
  "coupons.endDate",
  "coupons.active",
  "coupons.created_at",
  "coupons.action",
];

const CouponList = ({ status }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { state, fetchCouponList, rowStart, ...rest } = useCoupons();
  const { data, ...dataProps } = state;
  const navigate = useNavigate();
  const [openMenu, setOpenMenuActions] = useState(null);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setSelectedCouponId(id);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
    setSelectedCouponId(null);
  };

  const navigateToEdit = () =>
    navigate(`${PATH_DASHBOARD.store.coupons_edit}/${selectedCouponId}`);

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    handleCloseMenu();
  };

  const deleteCoupon = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { data, status } = await axiosInstance.post(
        `api/admin/coupons/${selectedCouponId}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        handleCloseDelete();
        fetchCouponList();
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const { remove, edit } = status;

  return (
    <>
      <Card sx={{ pt: 1 }}>
        <Scrollbar>
          <DataHandlerTable
            name="faq-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(item, i) => (
                <TableRow key={item.id}>
                  <TableCell>{i + rowStart}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {item.total_coupon_count} / {item.uses_per_coupon}
                  </TableCell>
                  <TableCell>{item.discount}</TableCell>
                  <TableCell>
                    <ParseDate date={item.start_date} />
                  </TableCell>
                  <TableCell>
                    <ParseDate date={item.end_date} />
                  </TableCell>

                  <TableCell>{item.active ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <ParseDate date={item.created_at} />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={!(remove || edit)}
                      onClick={handleOpenMenu(item.id)}
                      name="more-button"
                    >
                      <Iconify
                        icon={"eva:more-vertical-fill"}
                        width={20}
                        height={20}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>

      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <Actions
          status={status}
          openEdit={navigateToEdit}
          openDelete={handleOpenDelete}
        />
      </TableMenu>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="delete-video"
        TransitionComponent={Transition}
      >
        <DialogTitle id="delete-video">
          <Translate>coupons.deleteCoupon</Translate>
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
                <Translate>coupons.areYouSure</Translate>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDelete}
            name="cancel"
            sx={{ color: theme.palette.error.main }}
          >
            <Translate>coupons.cancel</Translate>
          </Button>
          <Button
            onClick={deleteCoupon}
            variant="contained"
            color="error"
            name="delete"
          >
            <Translate>coupons.delete</Translate>
          </Button>
        </DialogActions>
      </Dialog>
      <PaginationButtons {...rest} />
    </>
  );
};

export default CouponList;
