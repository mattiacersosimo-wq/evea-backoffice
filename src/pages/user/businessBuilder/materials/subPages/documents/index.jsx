import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { paramCase } from "change-case";
import { useNavigate } from "react-router";
import Iconify from "src/components/Iconify";
import DataHandlerList from "src/components/data-handler/list";
import Loop from "src/components/loop";

import Translate from "src/components/translate";
import { useMaterialContext } from "../..";

const Documents = () => {
  const navigate = useNavigate();
  const state = useMaterialContext();
  const { data, ...dataProps } = state;
  const { docs } = data;

  return (
    <Card sx={{ p: 2.5 }}>
      <Stack spacing={2.5}>
        <Typography variant="subtitle2">
          <Translate>business_builder.materials.menu.document</Translate>
        </Typography>

        <DataHandlerList
          dataProps={{ ...dataProps }}
          forceEmpty={docs.length === 0}
        >
          <Stack
            sx={{
              flexDirection: "row",
              flexWrap: "wrap",
            }}
            columnGap={1}
            spacing={1}
          >
            <Loop
              list={docs}
              render={({ id, doc_title: name, doc_url: url }) => (
                <Grid
                  sx={{
                    width: {
                      xl: "calc(100% / 4 - 6px)",
                      lg: "calc(100% / 3 - 6px)",
                      sm: "calc(100% / 2 - 6px)",
                      xs: "calc(100% / 2 - 6px)",
                    },
                    mt: 1,
                  }}
                  key={id}
                >
                  <Card
                    sx={{
                      display: "block",
                      alignItems: "center",
                      p: 2,
                      borderRadius: "4px",
                    }}
                  >
                    <IconButton sx={{ backgroundColor: "#f6effe" }}>
                      <Iconify icon={"et:document"} width={20} height={20} />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, minWidth: 0, pt: 2, pb: 1 }}>
                      <Typography variant="subtitle2" noWrap>
                        {name}
                      </Typography>
                    </Box>

                    <Divider />
                    <Button
                      onClick={() => {
                        navigate(`/document/${paramCase(name)}`, {
                          state: { href: url },
                        });
                      }}
                      target="_blank"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      startIcon={<Iconify icon={"carbon:view"} />}
                    >
                      {"userBusinessBuilder.material.view"}
                    </Button>
                  </Card>
                </Grid>
              )}
            />
          </Stack>
        </DataHandlerList>
      </Stack>
    </Card>
  );
};

export default Documents;
