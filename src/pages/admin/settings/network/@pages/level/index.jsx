import { LoadingButton } from "@mui/lab";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import useGetData from "./hooks/useGetData";
import Translate from "src/components/translate";
import RankList from "./rank-list";
import useRanks from "./hooks/useRanks";

const Level = () => {
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
                <Translate>settings.network.level</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.rank_name</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.level_bonus</Translate>
                (%){" "}
              </TableCell>
              <TableCell>
                <Translate>settings.network.minimumpqv</Translate>
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
  required_rank_id,
  rankList,
  percentage,
  min_pqv,
  handleUpdate,
}) => {
  return (
    <TableRow>
      <TableCell>
        <TextField type="text" size="small" value={`Level ${level}`} disabled />
      </TableCell>
      <TableCell>
        <RankList
          handleUpdate={handleUpdate(id)}
          value={required_rank_id}
          name="required_rank_id"
          rankList={rankList}
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={percentage}
          name="percentage"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={min_pqv}
          name="min_pqv"
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

export default Level;
