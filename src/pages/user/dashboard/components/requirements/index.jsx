import { Divider, Stack, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import LabeledPaper from "src/components/LabeledPaper";
import { PATH_USER } from "src/routes/paths";

const Requirements = () => (
  <LabeledPaper label="Business Builder: Requirements">
    <Stack spacing={1}>
      <RequirementItem label="1 active product subscription" isActive />
      <RequirementItem label="1 active product subscription" />
    </Stack>
  </LabeledPaper>
);

const RequirementItem = ({ label, isActive = false }) => {
  const {
    palette: { primary },
  } = useTheme();
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          color={!isActive && "primary.light"}
          component={!isActive && Link}
          to={PATH_USER.root}
        >
          {label}
        </Typography>
        <Iconify
          sx={{ fontSize: "1.5rem" }}
          icon="bi:check-circle-fill"
          color={isActive && primary.main}
        />
      </Stack>
      <Divider />
    </>
  );
};

export default Requirements;
