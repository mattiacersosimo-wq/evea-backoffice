import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Translate from "./translate";

const LeftAlignButton = ({
  label,
  linkTo,
  name,
  reset = () => null,
  isActive,
}) => {
  const { palette } = useTheme();
  const newStyle = isActive && {
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,
    "&:hover": {
      backgroundColor: palette.primary.main,
    },
  };

  return (
    <Button
      disableRipple
      startIcon={<Iconify icon="radix-icons:dot-filled" />}
      sx={{
        justifyContent: "flex-start",
        color: palette.text.disabled,
        paddingLeft: "1.3rem",
        "&:hover": {
          backgroundColor: "transparent",
        },
        ...newStyle,
      }}
      to={linkTo}
      onClick={reset}
      LinkComponent={Link}
      name={name}
    >
      <Translate>{label}</Translate>
    </Button>
  );
};

export default LeftAlignButton;
