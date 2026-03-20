import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
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

const IndirectSales = () => {
  const { state, handleUpdate, onSubmit } = useGetData();
  const { data, ...dataProps } = state;
  const ranks = useRanks();

  return (
    <Scrollbar>
      <DataHandlerList dataProps={{ ...dataProps }}>
        <Card sx={{ p: 4 }}>
          <Map
            list={data}
            render={(item) => (
              <Stack key={item.id} direction="row" spacing={3}>
                <LoadingTextField
                  handleUpdate={handleUpdate(item.id)}
                  value={item.max_level}
                  name="max_level"
                  label="Max Level"
                  disabled
                />
                <LoadingTextField
                  handleUpdate={handleUpdate(item.id)}
                  value={item.min_pqv}
                  name="min_pqv"
                  label="Minimum PQV"
                />
              </Stack>
            )}
          />
        </Card>
        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Translate>settings.network.min_required_rank</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.levels_unlocked</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.percentage</Translate>
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
  rankList,
  level1_rank,
  level2_rank,
  level3_rank,
  level_1_percentage,
  level_2_percentage,
  level_3_percentage,
  handleUpdate,
}) => {
  return (
    <>
      <TableRow>
        <TableCell>
          <RankList
            handleUpdate={handleUpdate(id)}
            value={level1_rank}
            name="level1_rank"
            rankList={rankList}
          />
        </TableCell>
        <TableCell>
          <LoadingTextField value={1} disabled />
        </TableCell>
        <TableCell>
          <LoadingTextField
            handleUpdate={handleUpdate(id)}
            value={level_1_percentage}
            name="level_1_percentage"
            size="small"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <RankList
            handleUpdate={handleUpdate(id)}
            value={level2_rank}
            name="level2_rank"
            rankList={rankList}
          />
        </TableCell>
        <TableCell>
          <LoadingTextField value={2} disabled />
        </TableCell>
        <TableCell>
          <LoadingTextField
            handleUpdate={handleUpdate(id)}
            value={level_2_percentage}
            name="level_2_percentage"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <RankList
            handleUpdate={handleUpdate(id)}
            value={level3_rank}
            name="level3_rank"
            rankList={rankList}
          />
        </TableCell>
        <TableCell>
          <LoadingTextField value={3} disabled />
        </TableCell>
        <TableCell>
          <LoadingTextField
            handleUpdate={handleUpdate(id)}
            value={level_3_percentage}
            name="level_3_percentage"
          />
        </TableCell>
      </TableRow>
    </>
  );
};

const LoadingTextField = ({
  value,
  name,
  handleUpdate,
  label,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setLoading(true);
    handleUpdate(e);
  };

  return (
    <TextField
      label={label}
      onWheel={(e) => e.target.blur()}
      type="number"
      onChange={onChange}
      size="small"
      value={value}
      name={name}
      disabled={disabled}
    />
  );
};

export default IndirectSales;
