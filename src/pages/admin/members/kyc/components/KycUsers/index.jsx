import {
  Button,
  Card,
  IconButton,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import { capitalCase } from "change-case";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { buildApiUrl } from "src/config";
import { isMenuActive } from "src/utils/actionProtector";
import useKyc from "../../hooks/useKyc";
import ActionDialog from "../ActionDialog";
import EditDialog from "../EditKyc";
import EditDialogProof from "../EditKycProof";
import DataFilter from "../filter";
import ReasonForm from "../reasonForm";
import useFilter from "./hooks/use-filter";

const headers = [
  "financial.payout.admin.request.table.no",
  "financial.payout.admin.request.table.user_name",
  "businessBuilder.email",
  "search.status",
  "financial.payout.admin.request.table.date",
  "global.Identity_proof",
  "global.proof_of_address",
  "financial.payout.admin.request.table.action",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    approve: test("approve"),
    reject: test("reject"),
    edit: test("edit"),
    download: test("download"),
  };
};
const KycUsers = () => {
  const status = genStatus("nav.members.title", "nav.members.kyc_details");
  const methods = useFilter();

  const filter = methods.watch();
  const onFilter = methods.handleSubmit((inputData) => {
    fetchData(1, inputData);
  });
  const { state, fetchData, rowStart, ...rest } = useKyc(filter);
  const { data, ...dataProps } = state;
  const [approved, setApproved] = useState();
  const [rejected, setRejected] = useState();

  const [openEdit, setOpenEdit] = useState();
  const [openEditProof, setOpenEditProof] = useState();
  const [selectedId, setSelectedId] = useState();
  const handleOpenApproved = (id) => {
    setSelectedId(id);
    setApproved(true);
  };
  const handleCloseApproved = () => {
    setApproved(false);
  };
  const handleOpenRejected = (id) => {
    setSelectedId(id);
    setRejected(true);
  };
  const handleCloseRejected = () => {
    setRejected(false);
  };
  const handleOpenEdit = (id) => {
    setSelectedId(id);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenEditProof = (id) => {
    setSelectedId(id);
    setOpenEditProof(true);
  };
  const handleCloseEditProof = () => {
    setOpenEditProof(false);
  };
  const { t } = useTranslation();
  return (
    <>
      <Card sx={{ pt: 1 }}>
        <DataFilter onFilter={onFilter} methods={methods} />
        <DataHandlerTable
          name="category-table"
          dataProps={{ ...dataProps }}
          headers={headers}
        >
          <Map
            list={data}
            render={(item, i) => (
              <TableRow key={item.id}>
                <TableCell>{i + rowStart}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  {capitalCase(item?.user_profile?.kyc_status) || ""}
                </TableCell>
                <TableCell>
                  <ParseDate date={item?.user_profile?.kyc_date} />
                </TableCell>
                <TableCell>
                  <IconButton disabled={!status.download}>
                    <a
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        color: "gray",
                      }}
                      href={buildApiUrl(`api/download-kyc/${item.id}/identity`)}
                    >
                      <Iconify icon={"tabler:download"} />
                    </a>
                  </IconButton>
                  <IconButton
                    disabled={
                      item?.user_profile?.kyc_status === "approved" ||
                      item?.user_profile?.kyc_status === "rejected" ||
                      !status.edit
                    }
                    onClick={() => handleOpenEdit(item?.id)}
                  >
                    <Iconify icon={"akar-icons:edit"} />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton disabled={!status.download}>
                    <a
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        color: "gray",
                      }}
                      href={buildApiUrl(`api/download-kyc/${item.id}/address`)}
                    >
                      <Iconify icon={"tabler:download"} />
                    </a>
                  </IconButton>
                  <IconButton
                    disabled={
                      item?.user_profile?.kyc_status === "approved" ||
                      item?.user_profile?.kyc_status === "rejected" ||
                      !status.edit
                    }
                    onClick={() => handleOpenEditProof(item?.id)}
                  >
                    <Iconify icon={"akar-icons:edit"} />
                  </IconButton>
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Ternary
                      when={status.approve}
                      then={
                        <Button
                          size="small"
                          disabled={
                            item?.user_profile?.kyc_status === "approved"
                          }
                          onClick={() => handleOpenApproved(item.id)}
                          startIcon={<Iconify icon="akar-icons:check" />}
                          variant="contained"
                          name="payout-approve"
                        >
                          <Translate>
                            financial.payout.admin.request.approve
                          </Translate>
                        </Button>
                      }
                    />

                    <Ternary
                      when={status.reject}
                      then={
                        <Button
                          disabled={
                            item?.user_profile?.kyc_status === "approved" ||
                            item?.user_profile?.kyc_status === "rejected"
                          }
                          size="small"
                          onClick={() => handleOpenRejected(item.id)}
                          startIcon={
                            <Iconify icon="ant-design:delete-outlined" />
                          }
                          color="error"
                          variant="contained"
                          name="payout-reject"
                        >
                          <Translate>
                            financial.payout.admin.request.reject
                          </Translate>
                        </Button>
                      }
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          />
        </DataHandlerTable>
      </Card>
      <PaginationButtons {...rest} />

      <ActionDialog
        fetchData={fetchData}
        title={t("global.approve")}
        statusKyc="approved"
        selectedId={selectedId}
        onClose={handleCloseApproved}
        open={approved}
      />
      <ReasonForm
        fetchData={fetchData}
        title={t("global.reject")}
        selectedId={selectedId}
        onClose={handleCloseRejected}
        open={rejected}
      />
      <EditDialog
        title={t("global.Identity_proof")}
        selectedId={selectedId}
        onClose={handleCloseEdit}
        open={openEdit}
        fetchData={fetchData}
      />
      <EditDialogProof
        title={t("global.proof_of_address")}
        selectedId={selectedId}
        onClose={handleCloseEditProof}
        open={openEditProof}
        fetchData={fetchData}
      />
    </>
  );
};

export default KycUsers;
