import { Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import FilterBar from "src/components/filterBar";
import { FormProvider } from "src/components/hook-form";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";
import MobileMenu from "src/pages/user/helpCenter/materialTickets/components/mobileMenu.js";
import { PATH_DASHBOARD } from "src/routes/paths";
import Filter from "./components/Filter";
import ListItem from "./components/listItem";
import Sidebar from "./components/sidebar";
import useFetchTickets from "./hooks/useFetchTickets";

const RootStyle = styled("div")({
  flexGrow: 1,
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
});

const MaterialTickets = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const {
    state,
    rowStart,
    fetchData,
    methods,
    handleFilter,
    timeOut,
    ...rest
  } = useFetchTickets();

  const { isArrayEmpty } = state;

  return (
    <Page title="support_tickets.title">
      <HeaderBreadcrumbs
        sx={{ pl: 1 }}
        heading="support_tickets.title"
        links={[
          {
            name: "global.dashboard",
            href: PATH_DASHBOARD.root,
          },
          { name: "support_tickets.title" },
        ]}
      />
      <Card
        sx={{
          // height: { md: "calc(100vh - 50px)" },
          display: { md: "flex" },
        }}
      >
        <Sidebar
          isOpenSidebar={openSidebar}
          onCloseSidebar={() => setOpenSidebar(false)}
        />

        <RootStyle>
          <Box sx={{ p: 2 }}>
            <MobileMenu />
            <FormProvider methods={methods} onSubmit={handleFilter}>
              <FilterBar sx={{ boxShadaw: "none" }}>
                <Filter />
              </FilterBar>
            </FormProvider>
            <Card>
              <ListItem state={state} rowStart={rowStart} />
            </Card>
          </Box>
        </RootStyle>
      </Card>
      <Ternary when={!isArrayEmpty} then={<PaginationButtons {...rest} />} />
    </Page>
  );
};

export default MaterialTickets;
