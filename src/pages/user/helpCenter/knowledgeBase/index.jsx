import { Box, Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";

import { PATH_USER } from "src/routes/paths";
import useGetArticle from "./hook/useGetArticle";
import DataList from "./list/dataList";
const KnowledgeBase = () => {
  const { state, rowStart, ...rest } = useGetArticle();
  const { data, ...dataProps } = state;

  return (
    <Page title="knowledge_base.title">
      <Box>
        <HeaderBreadcrumbs
          sx={{ mb: 1, pl: 1 }}
          heading="knowledge_base.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "knowledge_base.title" },
          ]}
        />
        <Card>
          <DataHandlerList dataProps={{ ...dataProps }}>
            <Box
              sx={{
                display: "block",
                gridTemplateColumns: {
                  md: "repeat(2, 1fr)",
                  sm: "repeat(2, 1fr)",
                },

                columnCount: { sx: 1, md: 2 },
                padding: "10px",
              }}
            >
              <Map
                list={data}
                render={(knowledge, i) => <DataList knowledge={knowledge} />}
              />
            </Box>
          </DataHandlerList>
        </Card>
        <Ternary
          when={!dataProps.isArrayEmpty}
          then={<PaginationButtons {...rest} />}
        />
      </Box>
    </Page>
  );
};

export default KnowledgeBase;
