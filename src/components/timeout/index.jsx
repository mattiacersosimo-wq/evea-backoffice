import { Box, Typography } from "@mui/material";
import Ternary from "../ternary";
import useTimeOut from "./hooks/useTimeOut";

const TimeOut = ({
  length,
  children,
  component = null,
  timeOut = 1000,
  defaultLabel,
}) => {
  const [isTimedOut] = useTimeOut(length, timeOut);

  const defaultComponent = (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4">{defaultLabel}</Typography>
    </Box>
  );

  return (
    <Ternary
      when={isTimedOut}
      then={
        <Ternary
          when={component}
          then={component}
          otherwise={defaultComponent}
        />
      }
      otherwise={children}
    />
  );
};

export default TimeOut;
