import { Box, CircularProgress } from "@mui/material";
import EmptyTable from "src/components/emptyTable";
import Ternary from "src/components/ternary";

const DataHandlerList = ({ children, dataProps, forceEmpty = false }) => {
  const { loading, error, isArrayEmpty } = dataProps;
  return (
    <Ternary
      when={loading}
      then={
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 3,
            marginBottom: 3,
          }}
        >
          <CircularProgress />
        </Box>
      }
      otherwise={
        <Ternary
          when={isArrayEmpty || forceEmpty}
          then={<EmptyTable error={error} />}
          otherwise={children}
        />
      }
    />
  );
};

export default DataHandlerList;
