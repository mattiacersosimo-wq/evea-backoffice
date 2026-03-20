import { Button, TableCell, TableRow } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import Translate from "src/components/translate";

import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";

const headers = [
  "material.no",
  "material.product_name",
  "material.doc_count",
  "material.video_count",
  "material.view",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    viewMaterial: test("view-material"),
  };
};

const MaterialTable = ({ state, rowStart }) => {
  const { data, ...dataProps } = state;

  const { viewMaterial } = genStatus("nav.store.title", "nav.store.materials");

  return (
    <Scrollbar>
      <DataHandlerTable
        name="faq-table"
        headers={headers}
        dataProps={{ ...dataProps }}
      >
        <Map
          list={data}
          render={(item, i) => (
            <TableRow>
              <TableCell>{i + rowStart}</TableCell>
              <TableCell>{item?.name} </TableCell>
              <TableCell>{item?.material_docs_count}</TableCell>
              <TableCell>{item?.material_videos_count}</TableCell>

              <TableCell>
                <Button
                  disabled={!viewMaterial}
                  size="small"
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.store.material_view}/${item.id}`}
                  name="view"
                >
                  <Translate>{"material.view"}</Translate>
                </Button>
              </TableCell>
            </TableRow>
          )}
        />
      </DataHandlerTable>
    </Scrollbar>
  );
};

export default MaterialTable;
