import { Box, Button } from "@mui/material";
import React from "react";
import Iconify from "./Iconify";
import * as XLSX from "xlsx"; // Use '*' to import all exports from 'xlsx'

const ExcelDownload = ({ newArray, excelName }) => {
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(newArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, `${excelName}.xlsx`);
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          onClick={handleDownload}
          variant="outlined"
          size="small"
          startIcon={<Iconify icon={"ri:file-excel-2-line"} />}
          sx={{ m: 1 }}
          name="excel"
        >
          Excel
        </Button>
      </Box>
    </div>
  );
};

export default ExcelDownload;
