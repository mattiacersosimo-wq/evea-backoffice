import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";

const AlertText = ({ children }) => {
  const theme = useTheme();

  return (
    <Typography
      variant="p"
      sx={{
        fontSize: ".7rem",
        "@media (max-width:380px)": {
          fontSize: ".49rem",
        },
        [theme.breakpoints.up("md")]: {
          fontSize: ".7rem",
        },
      }}
    >
      {children}
    </Typography>
  );
};

export default AlertText;
