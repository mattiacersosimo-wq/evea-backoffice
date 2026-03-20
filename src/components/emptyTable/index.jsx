import { Box, Typography } from "@mui/material";
import EmptyContent from "src/components/EmptyContent";
import Iconify from "../Iconify";
import Ternary from "../ternary";
import Translate from "../translate";

const EmptyTable = ({ error = false }) => {
  return (
    <Box>
      <Ternary
        when={error}
        then={
          <Box sx={{ p: 4 }}>
            <Box
              sx={{ justifyContent: "center", display: "flex", mt: 4, mb: 2 }}
            >
              <Box
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "16px",
                  backgroundColor: "#ffeeef",
                  textAlign: "center",
                  lineHeight: "80px",
                  display: "flex",
                  margin: "15px auto",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 
                <Iconify
                  icon="clarity:info-solid"
                  style={{ color: "#ff9595", fontSize: "45px" }}
                />
              </Box>
            </Box>
            <Typography
              variant="h3"
              sx={{ color: "#ff6767", textAlign: "center" }}
            >
              <Translate>global.oops</Translate>
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", color: "#637381" }}
            >
              <Translate>global.something_wrong</Translate>
            </Typography>
          </Box>
        }
        otherwise={
          <EmptyContent
            title={
              <Typography variant="subtitle2">
                <Translate>global.no_data</Translate>
              </Typography>
            }
            sx={{
              "& span.MuiBox-root": { height: 160 },
              color: "#b2b2b2",
            }}
          />
        }
      />
    </Box>
  );
};

export default EmptyTable;
