import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import useErrors from "src/hooks/useErrors";

import axiosInstance from "src/utils/axios";
import TableBody from "./components/tableBody";
import useRankSettings from "./components/tableBody/hooks/useRankSettings";
import TableHeader from "./components/tableHeader";
import "./style.css";

const DataTable = () => {
  const { enqueueSnackbar } = useSnackbar();
  const handleError = useErrors();
  const { data } = useRankSettings();
  const [dataProduct, setDataProduct] = useState([]);

  const onSubmit = async () => {
    const reqData = new FormData();
    const datass = JSON.stringify(dataProduct);
    reqData.append("data", datass);
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/settings-rank`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleError(err);
    }
  };
  return (
    <div className="rank">
      <Scrollbar>
        <table
          className="table table-hover"
          style={{ height: "20px", overflowY: "scroll" }}
        >
          <TableHeader />

          <TableBody
            data={data}
            dataProduct={dataProduct}
            setDataProduct={setDataProduct}
          />
        </table>
      </Scrollbar>
      <Box textAlign="right">
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton onClick={onSubmit} type="submit" variant="contained">
            {"adminSettings.network.update"}
          </LoadingButton>
        </Stack>
      </Box>
    </div>
  );
};

export default DataTable;
