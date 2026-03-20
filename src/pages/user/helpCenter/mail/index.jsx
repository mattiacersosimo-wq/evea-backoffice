import { Card, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import useSettings from "src/hooks/useSettings";
import { getLabelsMinimal } from "src/redux/slices/mail";
import { useDispatch } from "src/redux/store";
import { PATH_DASHBOARD } from "src/routes/paths";
import {
  MailCompose,
  MailDetails,
  MailList,
  MailSidebar,
} from "src/sections/@dashboard/mail";

const Mail = () => {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { mailId } = useParams();

  const [openSidebar, setOpenSidebar] = useState(false);

  const [openCompose, setOpenCompose] = useState(false);

  useEffect(() => {
    dispatch(getLabelsMinimal());
  }, [dispatch]);

  return (
    <Page sx={{ p: { md: 0, lg: 0, md: "10px", xs: "10px" } }} title="Mail">
      <Box>
        <HeaderBreadcrumbs sx={{mb:0, pl:1}}
          heading="Mail"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            { name: "Mail" },
          ]}
        />
        <Card sx={{ height: { md: "72vh" }, display: { md: "flex" } }}>
          <MailSidebar
            isOpenSidebar={openSidebar}
            onCloseSidebar={() => setOpenSidebar(false)}
            onOpenCompose={() => setOpenCompose(true)}
          />
          {mailId ? (
            <MailDetails />
          ) : (
            <MailList onOpenSidebar={() => setOpenSidebar(true)} />
          )}
          <MailCompose
            isOpenCompose={openCompose}
            onCloseCompose={() => setOpenCompose(false)}
          />
        </Card>
      </Box>
    </Page>
  );
};

export default Mail;
