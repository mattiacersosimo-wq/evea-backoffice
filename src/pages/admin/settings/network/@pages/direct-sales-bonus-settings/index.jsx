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
import usePackages from "./hooks/useGetPackageName";
import PackageList from "./package-list";

const DirectSalesBonus = () => {
  const { state, handleUpdate, onSubmit } = useGetData();
  const { data, ...dataProps } = state;
  const packages = usePackages();
  
  return (
    <Scrollbar>
      <DataHandlerList dataProps={{ ...dataProps }}>
        {/* <TableContainer sx={{ maxWidth: 500 }}> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Translate>settings.network.packages_name</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.min_pqv_previous_month</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.bonus_percentage</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.qualification_days</Translate>
              </TableCell>
              {/* <TableCell>
                <Translate>Craeted AT</Translate>
              </TableCell> */}
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
                  packageList={packages}
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
  min_pqv_previous_month,
  bonus_percentage,
  package_name,
  qualification_days,
  handleUpdate,
  packageList,
}) => {
  return (
    <TableRow>
      <TableCell>
        <PackageList
          handleUpdate={handleUpdate(id)}
          value={package_name}
          name="package_name"
          packageList={packageList}
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          // type="text"
          // size="small"
          value={min_pqv_previous_month}
          name="min_pqv_previous_month"
          handleUpdate={handleUpdate(id)}
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={bonus_percentage}
          name="bonus_percentage"
        />
      </TableCell>
      {/* <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={created_at}
          name="created_at"
        />
      </TableCell> */}
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={qualification_days}
          name="qualification_days"
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

export default DirectSalesBonus;
