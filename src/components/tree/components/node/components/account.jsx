import styled from "@emotion/styled";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {
  Avatar,
  Box,
  Card,
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
  useTheme,
} from "@mui/material";
import { useDrag } from "react-dnd";
import ParseDate from "src/components/date";
import Translate from "src/components/translate";
import useStyles from "src/components/tree/components/node/hooks/useStyles.js";
import UserIcon from "src/images/tree-tooltip.png";
import PersonPinIcon from "@mui/icons-material/PersonPin";
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(12),
    padding: "0.5rem",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
}));

const Account = ({
  join_date,
  unique_id,
  country,
  pv,
  rank_name,
  bv,
  ev,
  qv,
  dqv,
  pqv,
  tv,
  gv,
  user_type,
  smartship_status,
  name,
  profile,
  onClick,
}) => {
  const classes = useStyles();
  const { palette } = useTheme();
  const [{ isDragging }, drag] = useDrag({
    type: "account",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.4 : 1;

  const isDark = palette.mode === "dark";

  return (
    <>
      <HtmlTooltip
        title={
          <>
            {/* <Card sx={{ p: 1 }}> */}

            <Stack width={1} direction="row" mt={2}>
              <Stack textAlign="left">
                <Box
                  sx={{
                    marginTop: "-40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    className={classes.avatar}
                    src={profile}
                    sx={{
                      border: `2px solid ${palette.primary.light}`,
                      backgroundColor: palette.primary.light,
                      borderRadius: "50%",
                      p: "0 !important",
                    }}
                  >
                    <PersonPinIcon />
                  </Avatar>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>network_members.rank</Translate> : &nbsp;
                  </span>
                  {rank_name}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>network_members.unique_id</Translate> : &nbsp;
                  </span>
                  {unique_id}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.doj</Translate>  &nbsp; :
                    &nbsp;
                  </span>
                  <ParseDate date={join_date} />
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>global.country</Translate> : &nbsp;
                  </span>
                  {country}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.user_type</Translate>  &nbsp;
                    : &nbsp;
                  </span>
                  {user_type}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.smartship_status</Translate> 
                    &nbsp; : &nbsp;
                  </span>
                  <span
                    style={{
                      fontWeight: "200",
                      fontSize: "12px",
                    }}
                  >
                    {smartship_status === 1 ? "YES" : "NO"}
                  </span>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.bv</Translate>  &nbsp; :
                    &nbsp;
                  </span>
                  {bv}
                </Typography>
                {/* <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.ev</Translate> : &nbsp; :
                    &nbsp;
                  </span>
                  {ev} 
                </Typography> */}
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.qv</Translate>  &nbsp; :
                    &nbsp;
                  </span>
                  {qv}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.dqv</Translate> &nbsp; :
                    &nbsp;
                  </span>
                  {dqv}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.pqv</Translate>  &nbsp; :
                    &nbsp;
                  </span>
                  {pqv}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.tv</Translate> &nbsp; :
                    &nbsp;
                  </span>
                  {tv}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#000", padding: "2px" }}
                >
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <Translate>genealogy.legends.gv</Translate>  &nbsp; :
                    &nbsp;
                  </span>
                  {gv}
                </Typography>
              </Stack>
            </Stack>

            {/* </Card> */}
          </>
        }
      >
        <Box
          onClick={onClick}
          variant="outlined"
          className={classes.root}
          ref={drag}
          style={{ cursor: "pointer" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              className={classes.avatar}
              src={profile}
              sx={{
                backgroundColor: palette.primary.lighter,
                borderRadius: "50%",
                p: "0 !important",
              }}
            >
              <AccountCircleOutlinedIcon />
            </Avatar>
          </Box>
          <Card
            sx={{
              backgroundColor: isDark ? "#000" : "#ededed",
              borderRadius: "10px",
            }}
          >
            <Typography variant="body">{name ? name : "no name"}</Typography>
          </Card>
        </Box>
      </HtmlTooltip>
    </>
  );
};
export default Account;
