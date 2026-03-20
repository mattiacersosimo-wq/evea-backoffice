import { IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import { isMenuActive } from "src/utils/actionProtector";

const RootStyle = styled("div")(({ theme }) => ({
  height: 40,
  zIndex: 99,
  opacity: 0,
  margin: "auto",
  display: "flex",
  position: "absolute",
  alignItems: "center",
  top: theme.spacing(1),
  right: theme.spacing(1),
  bottom: theme.spacing(1),
  justifyContent: "center",
  padding: theme.spacing(0, 0.75),
  boxShadow: theme.customShadows.z12,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create("opacity"),
}));

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    remove: test("delete"),
  };
};

const Action = ({
  handleArchive,
  handleDelete,
  handleMarkRead,
  handleHidden,
  ...other
}) => {
  const { remove } = genStatus(
    "nav.communication.title",
    "nav.communication.mails"
  );
  return (
    <Ternary
      when={remove}
      then={
        <RootStyle {...other}>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                mx: 0.75,
                "&:hover": {
                  color: "text.primary",
                },
              }}
            >
              <Iconify icon="eva:trash-2-outline" width={24} height={24} />
            </IconButton>
          </Tooltip>
        </RootStyle>
      }
    />
  );
};

Action.propTypes = {
  handleArchive: PropTypes.func,
  handleDelete: PropTypes.func,
  handleMarkRead: PropTypes.func,
  handleHidden: PropTypes.func,
};

export default Action;
