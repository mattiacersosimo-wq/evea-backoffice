import {
  Box,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Scrollbar from "src/components/Scrollbar";
import { Link as RouterLink } from "react-router-dom";
import { PATH_USER } from "src/routes/paths";

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up("md")]: { display: "flex", alignItems: "center" },
  "&:hover": {
    zIndex: 999,
    position: "relative",
    boxShadow: theme.customShadows.z24,
    "& .showActions": { opacity: 1 },
  },
}));

const WrapStyle = styled(Link)(({ theme }) => ({
  minWidth: "100%",
  display: "flex",
  padding: theme.spacing(2, 0),
  transition: theme.transitions.create("padding"),
}));

const ListItem = ({ data, isDense, ...other }) => {
  return (
    <>
      <RootStyle {...other}>
        <WrapStyle
          color="inherit"
          underline="none"
          sx={{ ...(isDense && { py: 1 }) }}
        >
          <Scrollbar>
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket Number </TableCell>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">Subject</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Priority</TableCell>
                    <TableCell align="left">Department</TableCell>
                    <TableCell align="left">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Link
                          to="href"
                          color="inherit"
                          sx={{ cursor: "pointer" }}
                        >
                          {row.ticket_number}
                        </Link>
                      </TableCell>
                      <TableCell align="left">
                        {new Date(`${row.created_at}`).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell align="left">{row.subject}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">
                        {row.support_ticket_priorities?.name}
                      </TableCell>
                      <TableCell align="left">
                        {row.support_ticket_departments.name}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          disableFocusRipple={false}
                          size="small"
                          component={RouterLink}
                          to={`${PATH_USER.helpCenter.createTicket.new}/test`}
                        >
                          view
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </WrapStyle>
      </RootStyle>
    </>
  );
};

ListItem.propTypes = {
  isDense: PropTypes.bool,
};

export default ListItem;
