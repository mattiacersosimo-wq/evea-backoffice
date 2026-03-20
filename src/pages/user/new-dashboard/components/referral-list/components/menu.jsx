import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { PLANS } from "src/CONSTANTS";
import Map from "src/components/map";
import Translate from "src/components/translate";
import { PATH_USER } from "src/routes/paths";
import { usePlan } from "src/store/plan";
import objectToQueryString from "src/utils/object-to-query-string";
import squashPathAndQueryString from "src/utils/squash-path-and-query-string";

const menus = [
  {
    name: "user_dashboard.referral_menu.matrix",
    link: PATH_USER.genealogy.matrix,
    plans: [PLANS.matrix],
  },
  {
    name: "user_dashboard.referral_menu.binary",
    link: PATH_USER.genealogy.binary,
    plans: [PLANS.binary, PLANS.roi],
  },
  {
    name: "user_dashboard.referral_menu.mono_line",
    link: PATH_USER.genealogy.monoLine,
    plans: [PLANS.monoLine],
  },
  {
    name: "user_dashboard.referral_menu.sponsor",
    link: PATH_USER.genealogy.sponsor,
  },
];

const ReferralMenu = ({ anchorEl = null, onClose = () => null, username }) => {
  const plan = usePlan();

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <Map
        list={menus}
        render={({ name, link, plans }) => {
          const linkTo = squashPathAndQueryString(
            link,
            objectToQueryString({ uname: username })
          );

          if (!plans)
            return (
              <MenuItem
                component={Link}
                to={linkTo}
                sx={{ fontSize: "14px", fontWeight: "300" }}
              >
                <Translate>{name}</Translate>
              </MenuItem>
            );

          if (plans.indexOf(plan) > -1)
            return (
              <MenuItem
                component={Link}
                to={linkTo}
                sx={{ fontSize: "14px", fontWeight: "300" }}
              >
                <Translate>{name}</Translate>
              </MenuItem>
            );
        }}
      />
    </Menu>
  );
};

export default ReferralMenu;
