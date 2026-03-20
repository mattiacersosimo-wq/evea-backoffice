// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  CircularProgress,
  InputAdornment,
  Stack,
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
import DataHandlerList from "src/components/data-handler/list";
import EmptyTable from "src/components/emptyTable";
import { FormProvider } from "src/components/hook-form";
import Map from "src/components/map";

import useBinary from "./hooks/useBinary";
import Translate from "src/components/translate";
import Configuration from "./binaryCriteria";
import useGetData from "./binaryCriteria/hooks/use-get-data";

const DataTable = () => {
  const { state, handleUpdate, onSubmit, loading } = useBinary();
  const { data, ...dataProps } = state;

  const { fetchData: fetchConfig, methods } = useGetData();
  const {
    formState: { isSubmitting },
  } = methods;
  return (
    <div>
      <Configuration methods={methods} fetchConfig={fetchConfig} />
      <DataHandlerList dataProps={{ ...dataProps }}>
        <Scrollbar>
          <FormProvider>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Translate> {"settings.network.rank"}</Translate>
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Translate> {"settings.network.bv_capping"}</Translate>
                    </TableCell>
                    <TableCell>
                      <Translate>
                        {" "}
                        {"settings.network.binary_bonus_capping"}
                      </Translate>
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Translate> {"global.binary_bonus"}</Translate>
                      (%){" "}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  <Map
                    list={data}
                    render={(item) => (
                      <Item
                        key={item.id}
                        onSubmit={onSubmit}
                        handleUpdate={handleUpdate}
                        {...item}
                      />
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </FormProvider>
        </Scrollbar>
        <Box textAlign="right">
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              loading={loading}
              onClick={onSubmit}
              type="submit"
              variant="contained"
            >
              <Translate>{"settings.network.update"}</Translate>
            </LoadingButton>
          </Stack>
        </Box>
      </DataHandlerList>
    </div>
  );
};

const Item = ({
  id,
  rank_name,
  binary_bonus_capping,
  binary_volume_capping,
  binary_bonus,
  onSubmit,
  handleUpdate,
}) => {
  return (
    <>
      <TableRow key={id}>
        <TableCell>
          <TextField type="text" size="small" value={rank_name} disabled />
        </TableCell>
        <TableCell>
          <LoadingTextField
            handleUpdate={handleUpdate(id)}
            value={binary_volume_capping}
            name="binary_volume_capping"
          />
        </TableCell>
        <TableCell>
          <LoadingTextField
            handleUpdate={handleUpdate(id)}
            value={binary_bonus_capping}
            name="binary_bonus_capping"
          />
        </TableCell>

        <TableCell>
          <LoadingTextField
            handleUpdate={handleUpdate(id)}
            value={binary_bonus}
            name="binary_bonus"
          />
        </TableCell>
      </TableRow>
    </>
  );
};

const LoadingTextField = ({ value, name, handleUpdate, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setLoading(true);
    handleUpdate(e);
  };

  return (
    <TextField
      sx={{
        touchAction: "none",
      }}
      type="number"
      onChange={onChange}
      size="small"
      onWheel={(e) => e.target.blur()}
      value={value}
      name={name}
    />
  );
};

export default DataTable;
