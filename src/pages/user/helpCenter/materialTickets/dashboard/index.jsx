import { Box, Pagination } from "@mui/material";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import Scrollbar from "src/components/Scrollbar";
import PaginationButtons from "src/components/pagination";
import ListItem from "./listItem";
import useFetchIncome from "../hooks/useFetchTickets";

const List = () => {
  const [searchParams] = useSearchParams();
  const isDense = Boolean(parseInt(searchParams.get("isDense")));
  const { data, fetchData, rowStart, ...rest } = useFetchIncome();

  return (
    <>
      <Scrollbar>
        <Box sx={{ minWidth: { md: 800 } }}>
          <ListItem isDense={isDense} data={data} />
        </Box>
      </Scrollbar>
      <Box sx={{ p: 2 }}>
        <PaginationButtons
          {...rest}
          variant="outlined"
          color="primary"
          sx={{ float: "right" }}
        />
      </Box>
    </>
  );
};

List.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default List;
