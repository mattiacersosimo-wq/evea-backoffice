import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import buildPath from "src/utils/build-path";
import Transition from "src/utils/dialog-animation";
import { leadSchema } from "../../register";
import useGetLead from "./hooks/use-get-lead";

const headers = [
  "lead_capture.no",
  "lead_capture.name",
  "lead_capture.email",
  "lead_capture.mobile",
  "lead_capture.created_at",
];

const LeadList = () => {
  const { state, fetchData, rowStart, ...rest } = useGetLead();

  const { data, ...dataProps } = state;

  const [openEdit, setOpenEdit] = useState(null);

  const methods = useForm({
    resolver: yupResolver(leadSchema),
    defaultValues: {
      username: "",
      email: "",
      mobile: "",
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const { data } = await axiosInstance.get(
          `api/admin/lead-capture/${id}`
        );
        const { status, data: lead } = data;
        if (status) {
          const { email, username, mobile } = lead;
          methods.reset({
            email,
            username,
            mobile,
          });
        }
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err);
      }
    };
    if (openEdit) {
      fetchData(openEdit);
    }
  }, [openEdit]);

  const { handleSubmit, setError } = methods;
  const onSubmit = handleSubmit(async (inputData) => {
    const reqData = new FormData();

    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));

    reqData.append("_method", "PUT");

    try {
      const { data } = await axiosInstance.post(
        `/api/admin/lead-capture/${openEdit}`,
        reqData
      );

      const { status, message } = data;
      if (status) {
        fetchData();
        enqueueSnackbar(message);
        handleClose();
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  });

  const handleClose = () => {
    setOpenEdit(null);
  };

  const { user } = useAuth();
  const copyLink = () => {
    try {
      navigator.clipboard.writeText(
        buildPath(window.location.origin, "lead", user.username)
      );
      enqueueSnackbar("Copied to clipboard");
    } catch (err) {
      enqueueSnackbar("Something went wrong", { variant: "error" });

      console.log(err);
    }
  };

  return (
    <Page title="user_nav.leads">
      <HeaderBreadcrumbs
        heading="user_nav.leads"
        links={[
          { name: "global.dashboard", href: PATH_DASHBOARD.dashboard.root },
          { name: "user_nav.leads" },
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button onClick={copyLink}>copy referral link</Button>
            <Button variant="contained" LinkComponent={Link} to="default">
              edit template
            </Button>
          </Stack>
        }
      />

      <DataHandlerTable headers={headers} dataProps={dataProps} sx={{ pt: 1 }}>
        <Map
          list={data}
          render={({ mobile, name, email, created_at, id }, i) => {
            return (
              <TableRow key={i + rowStart}>
                <TableCell>{i + rowStart}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{mobile}</TableCell>
                <TableCell>
                  <ParseDate date={created_at} />
                </TableCell>
                {/* <TableCell>
                  <IconButton
                    onClick={() => {
                      setOpenEdit(id);
                    }}
                  >
                    <Iconify icon="material-symbols:edit-outline" />
                  </IconButton>
                </TableCell> */}
              </TableRow>
            );
          }}
        />
      </DataHandlerTable>

      <PaginationButtons {...rest} />

      <Dialog
        maxWidth="sm"
        open={openEdit}
        fullWidth
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>Edit Lead</DialogTitle>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <RHFTextField label="Username" name="username" />
              <RHFTextField label="Email" name="email" />
              <RHFTextField label="Mobile" name="mobile" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              type="submit"
              loading={methods.formState.isSubmitting}
            >
              Submit
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Page>
  );
};

export default LeadList;
