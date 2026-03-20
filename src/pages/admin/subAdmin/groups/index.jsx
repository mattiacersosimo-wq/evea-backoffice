import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Ternary from "src/components/ternary";

import { PATH_DASHBOARD } from "src/routes/paths";
import AddGroup from "./components/addGroup";
import AddGroupButton from "./components/addGroupButton";
import EditGroup from "./components/editGroup";
import GroupTable from "./components/groupTable";

const Index = () => {
  const [openAdd, setOpenAdd] = useState(false);

  const [reload, setReload] = useState(false);

  const onSuccess = () => {
    setOpenAdd(false);
    setReload(true);
  };
  const onClose = () => {
    setReload(false);
    setOpenAdd(false);
  };

  const { sid } = useParams();

  useEffect(() => {
    if (sid) {
      setOpenAdd(true);
    }
  }, [sid]);

  return (
    <div>
      <Page title={"sub_admin.add_user_group"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"sub_admin.add_user_group"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "sub_admin.sub_admin",
                href: PATH_DASHBOARD.subAdmin.root,
              },
              { name: "sub_admin.add_user_group" },
            ]}
            action={
              <AddGroupButton
                openAdd={openAdd}
                onOpen={() => setOpenAdd(true)}
                onClose={onClose}
              />
            }
          />

          <Ternary
            when={sid}
            then={<EditGroup open={openAdd} onClose={onSuccess} />}
            otherwise={<AddGroup open={openAdd} onClose={onSuccess} />}
          />

          <GroupTable reload={reload} />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
