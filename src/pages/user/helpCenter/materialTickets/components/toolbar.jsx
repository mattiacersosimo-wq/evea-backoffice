import { Box, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";
import InputStyle from "src/components/InputStyle";
import useResponsive from "src/hooks/useResponsive";

const RootStyle = styled("div")(({ theme }) => ({
  height: 84,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
}));

const Toolbar = ({ onOpenSidebar, onToggleDense, ...other }) => {
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");

  return (
    <RootStyle {...other}>
      {!mdUp && (
        <IconButton onClick={onOpenSidebar}>
          <Iconify icon={"eva:menu-fill"} />
        </IconButton>
      )}

      {smUp && (
        <>
          <Tooltip title="Dense">
            <IconButton onClick={onToggleDense}>
              <Iconify icon={"eva:collapse-fill"} width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter">
            <IconButton>
              <Iconify icon={"akar-icons:filter"} width={20} height={20} />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <InputStyle
        stretchStart={180}
        size="small"
        placeholder="Search tickets…"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={"eva:search-fill"}
                sx={{ color: "text.disabled", width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </RootStyle>
  );
};

Toolbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  onToggleDense: PropTypes.func,
};

export default Toolbar;
