import { Button, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { paramCase } from "change-case";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";

import { PATH_USER } from "src/routes/paths";
import objectToQueryString from "src/utils/object-to-query-string";
import squashPathAndQueryString from "src/utils/squash-path-and-query-string";

const ActionButton = ({ icon, color, label, href, variant, name, slug }) => {
  const { palette } = useTheme();
  const { mode } = palette;

  const linkTo = squashPathAndQueryString(
    href,
    objectToQueryString({ name: slug })
  );
  return (
    <Tooltip title={label}>
      <Button
        LinkComponent={Link}
        to={linkTo}
        startIcon={<Iconify icon={icon} />}
        variant={variant}
        name={name}
        size="small"
        sx={{
          color: color[mode],
          borderColor: color[mode],
          "&:hover": {
            backgroundColor: `${color[mode]}10`,
            borderColor: color[mode],
          },
        }}
      >
        <Translate>{label}</Translate>
      </Button>
    </Tooltip>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  href: PropTypes.string,
  isFirst: PropTypes.bool.isRequired,
};

export default ({ product_id, name }) => {
  const view = PATH_USER.subscriptions.view(product_id);
  const actionButtons = [
    {
      icon: "bi:check-lg",
      label: "user.subscriptions.labels.review",
      color: { light: "#00c853", dark: "#69f0ae" },
      href: PATH_USER.subscriptions.view(product_id)("comment"),
      variant: "outlined",
      name: "comment",
    },
    {
      icon: "akar-icons:link-chain",
      label: "user.subscriptions.labels.blog",
      color: { light: "#0091ea", dark: "#40c4ff" },
      href: `${PATH_USER.subscriptions.blog(product_id)}`,
      variant: "outlined",
      name: "blog",
    },
    {
      icon: "uil:calender",
      label: "user.subscriptions.labels.events",
      color: { light: "#25223e", dark: "#eeff41" },
      href: PATH_USER.subscriptions.view(product_id)("events"),
      variant: "outlined",
    },
    {
      icon: "healthicons:i-documents-accepted-outline",
      label: "user.subscriptions.labels.documents",
      color: { light: "#d50000", dark: "#ff4081" },
      href: PATH_USER.subscriptions.view(product_id)("documents"),
      variant: "outlined",
      name: "documents",
    },
    {
      icon: "akar-icons:play",
      label: "user.subscriptions.labels.videos",
      color: { light: "#ff6d00", dark: "#ffd740" },
      href: PATH_USER.subscriptions.view(product_id)("videos"),
      variant: "outlined",
      name: "videos",
    },
    {
      icon: "carbon:view",
      label: "user.subscriptions.labels.view",
      color: "",
      href: view("home"),
      variant: "contained",
      name: "view",
    },
  ];

  return (
    <Stack spacing={1} direction="row">
      {actionButtons.map((v) => (
        <ActionButton {...v} slug={paramCase(name)} />
      ))}
    </Stack>
  );
};
