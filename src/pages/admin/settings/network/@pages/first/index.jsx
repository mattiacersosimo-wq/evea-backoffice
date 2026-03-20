import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import DataHandlerList from "src/components/data-handler/list";
import EmptyTable from "src/components/emptyTable";
import { FormProvider } from "src/components/hook-form";
import Map from "src/components/map";
import useErrors from "src/hooks/useErrors";

import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";
import useFirstOrder from "./hooks/useFirstOrder";

const DataTable = () => {
  const { state, handleUpdate, onSubmit, loading } = useFirstOrder();
  const { data, ...dataProps } = state;

  return (
    <div>
      <DataHandlerList dataProps={{ ...dataProps }}>
        <Scrollbar>
          <FormProvider>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Translate> {"settings.network.products"}</Translate>
                    </TableCell>
                    <TableCell>
                      <Translate> {"global.first_order_percentage"}</Translate>{" "}
                      (%){" "}
                    </TableCell>
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
              onClick={onSubmit}
              type="submit"
              variant="contained"
              loading={loading}
            >
              <Translate>{"settings.network.update"}</Translate>
            </LoadingButton>
          </Stack>
        </Box>
      </DataHandlerList>
    </div>
  );
};

const Item = ({ id, name, product_fob_price, handleUpdate }) => {
  return (
    <>
      <TableRow key={id}>
        <TableCell>
          <TextField type="text" size="small" value={name} disabled />
        </TableCell>
        <TableCell>
          <LoadingTextField
            handleUpdate={handleUpdate(id)}
            value={product_fob_price.percentage}
            name="percentage"
          />
        </TableCell>
      </TableRow>
    </>
  );
};

const LoadingTextField = ({ value, name, handleUpdate }) => {
  const onChange = (e) => {
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

export default DataTable;
