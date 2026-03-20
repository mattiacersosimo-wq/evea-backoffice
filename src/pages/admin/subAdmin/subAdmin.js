import { Box, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { last } from "lodash";
import { Outlet, useLocation, useNavigate } from "react-router";
import Iconify from "src/components/Iconify";

import useSubAdmins from "./hooks/useGetSubAdmins";
import { useTranslation } from "react-i18next";

const SUB_ADMINS_TABS = [
  {
    href: "active",
    value: "sub_admin.active",
    icon: (
      <Iconify icon={"carbon:intent-request-active"} width={20} height={20} />
    ),
  },
  {
    href: "in-active",
    value: "sub_admin.inactive",
    icon: (
      <Iconify icon={"carbon:intent-request-inactive"} width={20} height={20} />
    ),
  },
  {
    href: "trashed",
    value: "sub_admin.trashed",
    icon: <Iconify icon={"akar-icons:trash-can"} width={20} height={20} />,
  },
];

const SubAdmin = () => {
  const { subAdmins, fetchData } = useSubAdmins();
  const { pathname } = useLocation();
  const activeTab = last(pathname.split("/"));

  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Box>
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={activeTab}
        onChange={(_, v) => {
          navigate(v);
        }}
      >
        {SUB_ADMINS_TABS.map((tab) => (
          <Tab
            disableRipple
            key={tab.href}
            label={t(tab.value)}
            icon={tab.icon}
            value={tab.href}
          />
        ))}
      </Tabs>
      <Box sx={{ mb: 2 }} />
      <Outlet context={{ data: subAdmins, fetchData }} />
    </Box>
  );
};

export default SubAdmin;
