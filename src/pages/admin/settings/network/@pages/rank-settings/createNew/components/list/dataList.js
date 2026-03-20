import { IconButton, TableCell, TableRow } from "@mui/material";
import ReactQuill from "react-quill";
import Iconify from "src/components/Iconify";

const DataList = ({ faq, handleOpenMenu, rowNumber, disableAction }) => {
  const { id, question, answer } = faq;

  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
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
        <IconButton
          disabled={disableAction}
          onClick={handleOpenMenu(id)}
          name="more-button"
        >
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default DataList;
