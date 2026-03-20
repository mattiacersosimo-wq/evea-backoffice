import { Box, IconButton, Link, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "src/components/Avatar";
import Iconify from "src/components/Iconify";
import useResponsive from "src/hooks/useResponsive";
import { PATH_DASHBOARD } from "src/routes/paths";
import createAvatar from "src/utils/createAvatar";
import { fDateTimeSuffix } from "src/utils/formatTime";

const RootStyle = styled("div")(({ theme }) => ({
  height: 84,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  justifyContent: "space-between",
}));

const Toolbar = ({ createdAt, from, to, ...other }) => {
  const navigate = useNavigate();
  const { systemLabel, customLabel } = useParams();
  const isDesktop = useResponsive("up", "sm");

  const baseUrl = PATH_DASHBOARD.mail.root;

  const handleBack = () => {
    if (systemLabel) {
      return navigate(`${baseUrl}/${systemLabel}`);
    }
    if (customLabel) {
      return navigate(`${baseUrl}/label/${customLabel}`);
    }
    return navigate(`${baseUrl}/inbox`);
  };

  return (
    <RootStyle {...other}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Back">
          <IconButton onClick={handleBack}>
            <Iconify icon={"eva:arrow-ios-back-fill"} width={20} height={20} />
          </IconButton>
        </Tooltip>
        <Avatar
          alt={from?.name}
          src={from?.avatar || ""}
          color={createAvatar(from?.name)?.color}
        >
          {createAvatar(from?.name)?.name}
        </Avatar>

        <Box sx={{ ml: 2 }}>
          <Typography display="inline" variant="subtitle2">
            {from?.name}
          </Typography>
          <Link variant="caption" sx={{ color: "text.secondary" }}>
            &nbsp; {`<${from?.email}>`}
          </Link>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            To:&nbsp;
            {to?.map((person) => (
              <Link color="inherit" key={person.email}>
                {person.email}
              </Link>
            ))}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isDesktop && (
          <>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {fDateTimeSuffix(createdAt)}
            </Typography>
            <Tooltip title="Reply">
              <IconButton>
                <Iconify icon={"ic:round-reply"} width={20} height={20} />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Tooltip title="More options">
          <IconButton name="more-button">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </Tooltip>
      </Box>
    </RootStyle>
  );
};

Toolbar.propTypes = {
  mail: PropTypes.object,
};

export default Toolbar;
