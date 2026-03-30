import { Button } from "@mui/material";
import moment from "moment";
import { exportToExcel } from "react-json-to-excel";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";
import { getUrl } from "../config";
import { verifyInput } from "../hooks/use-filter";
import helper from "./helper";
import Translate from "src/components/translate";

const Export = ({ type, methods }) => {
  const handleExport = async () => {
    const URI = `api/admin/${getUrl(type)}`;

    const filter = await verifyInput(methods.getValues());
    const fileName = `${type}_report-${moment().format("DD-MMM-YYYY:HH:mm")}`;

    try {
      const { data } = await axiosInstance.get(URI, {
        params: {
          excel: 1,
          ...filter,
        },
      });
      const handler = helper(type);
      const exportData = data.data?.map((item, i) => handler(item, i + 1));
      exportToExcel(exportData, fileName);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Button
      onClick={handleExport}
      startIcon={<Iconify icon="uil:export" />}
      variant="contained"
      size="small"
    >
      <Translate>global.export</Translate>
    </Button>
  );
};

export default Export;
