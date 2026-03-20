import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";

import Translate from "src/components/translate";
import useGetDocument from "./hooks/use-get-documents";

const Index = () => {
  const { state, selectedCategory, setSelectedCategory, categories, ...rest } =
    useGetDocument();
  const { data, ...dataProps } = state;

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          height: "500px",
        }}
      >
        <Grid item md={3}>
          <Scrollbar
            sx={{
              height: "500px",
            }}
          >
            <Stack spacing={1}>
              <Button
                onClick={() => setSelectedCategory("all")}
                variant={selectedCategory === "all" ? "contained" : "text"}
              >
                <Translate>global.all</Translate>
              </Button>
              <Map
                list={categories}
                render={({ id, name }) => (
                  <Button
                    variant={selectedCategory === id ? "contained" : "text"}
                    onClick={() => setSelectedCategory(id)}
                  >
                    {name}
                  </Button>
                )}
              />
            </Stack>
          </Scrollbar>
        </Grid>

        <Grid item md={9} sx={{ width: "100%", height: "100%" }}>
          <Scrollbar
            sx={{
              height: "500px",
            }}
          >
            <DataHandlerList dataProps={{ ...dataProps }}>
              <Grid container spacing={3}>
                <Map
                  list={data}
                  render={(item) => (
                    <Grid item xs={12} md={4} key={item.id}>
                      <Card
                        sx={{ display: "flex", alignItems: "center", p: 3 }}
                      >
                        <IconButton
                          sx={{ backgroundColor: "#ebebeb" }}
                          name="document"
                        >
                          <Iconify
                            icon={"et:document"}
                            width={24}
                            height={24}
                          />
                        </IconButton>
                        <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
                          <Typography variant="subtitle2" noWrap>
                            {item.doc_title}
                          </Typography>
                        </Box>
                        <Button
                          LinkComponent={Link}
                          to="/pdf"
                          state={{
                            docURI:
                              "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
                          }}
                          size="small"
                          startIcon={<Iconify icon={"carbon:view"} />}
                          name="view"
                        >
                          <Translate>global.view</Translate>
                        </Button>
                      </Card>
                    </Grid>
                  )}
                />
              </Grid>
            </DataHandlerList>
          </Scrollbar>
        </Grid>
      </Grid>
      <PaginationButtons {...rest} />
    </>
  );
};

export default Index;
