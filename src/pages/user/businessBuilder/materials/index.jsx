import { Box, Card, Container, Stack } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import useDataHandler, {
  defaultHandlerData,
} from "src/components/data-handler/hooks/use-data-handler";

import { PATH_USER } from "src/routes/paths";
import fetchUser from "src/utils/fetchUser";
import NavButton from "./components/navButton";
const defaultState = { docs: [], videos: [] };

const useMaterials = () => {
  const [state, actions] = useDataHandler(defaultState);

  useEffect(() => {
    const fetchData = async () => {
      actions.loading();
      try {
        const { status, data } = await (await fetchUser("bb-materials")).data;
        if (status) {
          const {
            business_builder_material_doc: docs,
            business_builder_material_video: videos,
          } = data;

          actions.success({ docs, videos }, true);
          return;
        }
        actions.success(defaultState, true);
      } catch (err) {
        actions.error();
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return state;
};

const MaterialContext = createContext(defaultHandlerData);

export const useMaterialContext = () => useContext(MaterialContext);

const listItems = [
  {
    label: "business_builder.materials.menu.document",
    to: "documents",
    icon: "humbleicons:documents",
    name: "documents",
  },

  {
    label: "business_builder.materials.menu.video",
    to: "videos",
    icon: "akar-icons:video",
    name: "videos",
  },
];
const Materials = () => {
  const materials = useMaterials();

  return (
    <MaterialContext.Provider value={materials}>
      <Page title="business_builder.materials.title">
        <Container maxWidth="100%">
          <HeaderBreadcrumbs
            heading="business_builder.materials.title"
            links={[
              { name: "global.dashboard", href: PATH_USER.root },
              { name: "business_builder.materials.title" },
            ]}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "20% 80%" },
              columnGap: 3,
              rowGap: 3,
            }}
          >
            <Box>
              <Card sx={{ p: 2 }}>
                <Stack spacing={1}>
                  {listItems.map(({ icon, label, to, name }) => (
                    <NavButton icon={icon} to={to} label={label} name={name} />
                  ))}
                </Stack>
              </Card>
            </Box>
            <Outlet />
          </Box>
        </Container>
      </Page>
    </MaterialContext.Provider>
  );
};

export default Materials;
