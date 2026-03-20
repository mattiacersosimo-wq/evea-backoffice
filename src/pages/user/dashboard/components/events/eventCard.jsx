import { Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const EventCard = ({ children }) => {
  const { palette } = useTheme();
  return (
    <Card
      sx={{
        backgroundColor: palette.primary.main,
        padding: "1rem",
        color: "#fff",
      }}
    >
      {children}
    </Card>
  );
};

export default EventCard;
