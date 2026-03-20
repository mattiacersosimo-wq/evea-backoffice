import React, { useState } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import {
  Box,
  Table,
  Button,
  Divider,
  TableBody,
  TableHead,
  TableContainer,
  TableRow,
  MenuItem,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  useMediaQuery,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// form
import { useForm } from "react-hook-form";

// components
import Scrollbar from "../../../components/Scrollbar";
import { TableMoreMenu } from "../../../components/table";
import Iconify from "../../../components/Iconify";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import Transition from "src/utils/dialog-animation";

const UserGroup = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [openMenu, setOpenMenuActions] = useState(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const [state, setState] = useState({
    // store
    productCat: false,
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [openEditGroup, setOpenEditGroup] = useState(false);
  const handleClickOpenEditGroup = () => {
    setOpenEditGroup(true);
    handleCloseMenu(true);
  };
  const handleCloseEditGroup = () => {
    setOpenEditGroup(false);
  };

  const defaultValues = {
    group: "",
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      reset();
      enqueueSnackbar("Update success!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Sidebar URL</TableCell>
                <TableCell>Action</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Test</TableCell>
                <TableCell>
                  Dashboard Binary Genealogy Financial Report Ecommerce Manager
                </TableCell>
                <TableCell>
                  <TableMoreMenu
                    open={openMenu}
                    onOpen={handleOpenMenu}
                    onClose={handleCloseMenu}
                    actions={
                      <>
                        <MenuItem
                          sx={{ color: "default.main" }}
                          onClick={handleClickOpenEditGroup}
                        >
                          <Iconify icon={"akar-icons:edit"} />
                          Edit
                        </MenuItem>

                        <Divider />
                        <MenuItem sx={{ color: "error.main" }}>
                          <Iconify icon={"eva:trash-2-outline"} />
                          Delete
                        </MenuItem>
                      </>
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      {/* dialog  */}

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEditGroup}
        onClose={handleCloseEditGroup}
        aria-labelledby="add-usergroup"
        TransitionComponent={Transition}
      >
        <DialogTitle id="edit-usergroup">Edit Usergroup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                <RHFTextField name="group" label="Group" />
                <FormProvider>
                  <FormGroup>
                    <FormLabel component="store">Store</FormLabel>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.productCat}
                          onChange={handleChange}
                          name="productCat"
                        />
                      }
                      label="Product Categories"
                    />
                  </FormGroup>
                </FormProvider>
              </Box>
            </FormProvider>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            onClick={handleCloseEditGroup}
            loading={isSubmitting}
          >
            Update
          </LoadingButton>

          <Button onClick={handleCloseEditGroup} autoFocus color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserGroup;
