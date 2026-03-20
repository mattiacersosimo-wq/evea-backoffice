import { LoadingButton } from "@mui/lab";
import {
  Box,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import DataHandlerList from "src/components/data-handler/list";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import useErrors from "src/hooks/useErrors";

import axiosInstance from "src/utils/axios";
import useGetData from "./hooks/useGetData";
import Translate from "src/components/translate";
import useRanks from "./hooks/useRanks";
import RankList from "./rank-list";

const ResidualMatching = () => {
  const { state, handleUpdate, onSubmit } = useGetData();
  const { data, ...dataProps } = state;
  const ranks = useRanks();
  return (
    <Scrollbar>
      <DataHandlerList dataProps={{ ...dataProps }}>
        {/* <TableContainer sx={{ maxWidth: 500 }}> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Translate>settings.network.rank_name</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.levels_unlocked</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.percentage</Translate>
                (%){" "}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <Map
              list={data}
              render={(item) => (
                <Row
                  key={item.id}
                  {...item}
                  onSubmit={onSubmit}
                  handleUpdate={handleUpdate}
                  {...item}
                  rankList={ranks}
                />
              )}
            />
          </TableBody>
        </Table>
        {/* </TableContainer> */}
        <Box textAlign="right">
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton onClick={onSubmit} type="submit" variant="contained">
              <Translate>{"settings.network.update"}</Translate>
            </LoadingButton>
          </Stack>
        </Box>
      </DataHandlerList>
    </Scrollbar>
  );
};

const Row = ({
  id,
  level,
  percentage,
  rank_id,
  rankList,
  rank,
  handleUpdate,
}) => {
  return (
    <TableRow>
      <TableCell>
        <RankList
          handleUpdate={handleUpdate(id)}
          value={rank_id}
          name="rank_id"
          rankList={rankList}
        />
      </TableCell>
      <TableCell>
        <TextField type="text" size="small" value={` ${level}`} />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={percentage}
          name="percentage"
        />
      </TableCell>
    </TableRow>
  );
};

const LoadingTextField = ({ value, name, handleUpdate }) => {
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setLoading(true);
    handleUpdate(e);
  };

  return (
    <TextField
      onWheel={(e) => e.target.blur()}
      type="number"
      onChange={onChange}
      size="small"
      value={value}
      name={name}
    />
  );
};

export default ResidualMatching;
