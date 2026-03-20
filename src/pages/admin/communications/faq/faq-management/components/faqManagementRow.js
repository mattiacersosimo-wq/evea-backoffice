import { IconButton, TableCell, TableRow } from "@mui/material";
import ReactQuill from "react-quill";
import Iconify from "src/components/Iconify";

const faqManagementRow =
  (handleOpenMenu, row) =>
  ({ id, question, answer }, i) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + row}</TableCell>
        <TableCell>{question} </TableCell>
        <TableCell>
          <ReactQuill
            value={answer}
            theme="bubble"
            modules={{
              toolbar: null,
            }}
            readOnly
          />
        </TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu(id)} name="more-button">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default faqManagementRow;
