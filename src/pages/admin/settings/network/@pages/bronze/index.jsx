import {
  CircularProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import EmptyTable from "src/components/emptyTable";
import { FormProvider } from "src/components/hook-form";

import useRank from "./hooks/useRank";

const DataTable = () => {
  const { data, handleUpdate, onSubmit } = useRank();

  const isEmpty = !Boolean(data?.length);

  return (
    <div>
      <Scrollbar>
        <FormProvider>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{"adminSettings.network.rank"}</TableCell>
                  <TableCell>{"adminSettings.network.bonusAmount"}</TableCell>
                </TableRow>
              </TableHead>
              {isEmpty ? (
                <BodyRow>
                  <TableCell colSpan={7} align="center">
                    <EmptyTable />
                  </TableCell>
                </BodyRow>
              ) : (
                <TableBody>
                  {data.map((item) => (
                    <Item
                      handleUpdate={handleUpdate}
                      onSubmit={onSubmit}
                      {...item}
                    />
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </FormProvider>
      </Scrollbar>
      <Box textAlign="right">
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton onClick={onSubmit} type="submit" variant="contained">
            Update
          </LoadingButton>
        </Stack>
      </Box>
    </div>
  );
};

const Item = ({
  id,
  rank_name: rankName,
  bonus_amount: bonusAmount,
  onSubmit,
  handleUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setLoading(true);
    handleUpdate(id, e);
  };
  const handleSubmit = async () => {
    const isSuccess = await onSubmit(id);
    setLoading(!isSuccess);
  };
  return (
    <TableRow key={id}>
      <TableCell>
        <TextField type="text" size="small" value={rankName} disabled />
      </TableCell>
      <TableCell>
        <TextField
          onBlur={handleSubmit}
          onChange={onChange}
          type="number"
          size="small"
          value={bonusAmount}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                {loading ? (
                  <CircularProgress size={10} />
                ) : (
                  <CircularProgress size={10} variant="determinate" value={0} />
                )}
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default DataTable;
