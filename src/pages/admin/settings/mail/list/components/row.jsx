import { IconButton, TableCell, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { PATH_DASHBOARD } from "src/routes/paths";

const Row = ({ data, rowNumber }) => {
  const { email, language, email_template_id, subject, id } = data;

  return (
    <TableRow>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{email_template_id ? email_template_id : "-"}</TableCell>
      <TableCell>{language}</TableCell>
      <TableCell>{subject}</TableCell>
      <TableCell>
        <IconButton
          LinkComponent={Link}
          to={PATH_DASHBOARD.settings.email_settings.view(id, { name: email })}
        >
          <Iconify icon="material-symbols:edit-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Row;
