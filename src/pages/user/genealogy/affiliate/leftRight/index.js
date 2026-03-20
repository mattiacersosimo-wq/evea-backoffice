import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
// @mui
import { alpha, styled } from "@mui/material/styles";
import {
  Box,
  Stack,
  Card,
  Avatar,
  CardHeader,
  Typography,
} from "@mui/material";
// utils
import { fShortenNumber } from "src/utils/formatNumber";
// _mock_
import { _appAuthors } from "src/_mock";
// components
import Iconify from "src/components/Iconify";

// ----------------------------------------------------------------------

const IconWrapperStyle = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
}));

// ----------------------------------------------------------------------

export default function LeftRightCard({ title, caption }) {
  const displayAuthor = orderBy(_appAuthors, ["favourite"], ["desc"]);

  return (
    <Card>
      <CardHeader title={title} />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt="image" src="sasas" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">{caption}</Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              587
            </Typography>
          </Box>
          <IconWrapperStyle>
            <Iconify icon={"bi:arrow-bar-right"} width={20} height={20} />
          </IconWrapperStyle>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

AuthorItem.propTypes = {
  author: PropTypes.shape({
    avatar: PropTypes.string,
    favourite: PropTypes.number,
    name: PropTypes.string,
  }),
  index: PropTypes.number,
};

function AuthorItem({ author, index, icon }) {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={author.name} src={author.avatar} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">lorem content</Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            587
          </Typography>
        </Box>
        <IconWrapperStyle>
          <Iconify icon={icon} width={20} height={20} />
        </IconWrapperStyle>
      </Stack>
    </>
  );
}
