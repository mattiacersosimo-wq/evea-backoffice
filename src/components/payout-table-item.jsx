import { Typography } from "@mui/material";

const PayoutTableItem = ({ children }) => {
  return (
    <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
      {children}
    </Typography>
  );
};

export default PayoutTableItem;
