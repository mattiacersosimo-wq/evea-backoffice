import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";

const headers = [
  "profile.referral.table.no",
  "profile.referral.table.user",
  "profile.referral.table.email",
  "profile.referral.table.active",
  "profile.referral.table.date",
];

const useReferrals = () => {
  const { mid } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const [state, actions] = useDataHandler();

  const fetchData = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance(`/api/referrals-of-user/${mid}`, {
        params: { page },
      });
      const { status, referrals } = data;
      if (status) {
        const { last_page, from, data: list } = referrals;
        actions.success(list);
        seed(last_page, from);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };
  useEffect(() => {
    fetchData(page);
  }, [page]);

  return { state, count, onChange, page, rowStart };
};

const ProfileReferrals = () => {
  const { state, count, onChange, page, rowStart } = useReferrals();
  const { data, ...dataProps } = state;
  return (
    <div>
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          <Translate> {"profile.referrals"}</Translate>
        </Typography>
        <Scrollbar>
          <DataHandlerTable
            name="category-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(item, i) => (
                <TableRow>
                  <TableCell>{rowStart + i}</TableCell>
                  <TableCell>{item?.username} </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{Boolean(item.active) ? "Yes" : "No"}</TableCell>
                  {/* <TableCell>{item.rank_id > 1 ? "Yes" : "No"}</TableCell> */}
                  <TableCell>
                    <ParseDate date={item.created_at} />
                  </TableCell>
                </TableRow>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>
      <PaginationButtons count={count} onChange={onChange} page={page} />
    </div>
  );
};

export default ProfileReferrals;
