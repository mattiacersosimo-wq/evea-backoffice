import { useState } from "react";

import { Box, Button, Card, Grid } from "@mui/material";

import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";

import DeleteDialog from "./components/DeleteDialog";
import AddDialog from "./components/addDialog";
import DocumentCard from "./components/documentCard";
import EditDialog from "./components/editDialog";
import useFetchDocuments from "./hooks/useFetchDocuments";
import Translate from "src/components/translate";

const DocumentView = () => {
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { state, documents, fetchData, ...rest } = useFetchDocuments();
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpen = (isEdit) => (id) =>
    isEdit ? setEditId(id) : setDeleteId(id);

  const { data, ...dataProps } = state;

  return (
    <div>
      <Page title={"products.document.title"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"products.document.document"}
            links={[
              { name: "dashboard", href: PATH_DASHBOARD.root },
              {
                name: "products.document.products",
                href: PATH_DASHBOARD.store.products,
              },
              { name: "products.document.document" },
            ]}
            action={
              <Button
                onClick={() => setOpenAdd(true)}
                variant="contained"
                startIcon={
                  <Iconify icon={"eva:plus-fill"} width={20} height={20} />
                }
                name="add"
              >
                <Translate>{"products.document.add"}</Translate>
              </Button>
            }
          />
          <Card sx={{ p: 3 }}>
            <DataHandlerList dataProps={dataProps}>
              <Grid container spacing={3}>
                <Map
                  list={data}
                  render={(doc) => (
                    <DocumentCard
                      key={doc.id}
                      handleOpen={handleOpen}
                      doc={doc}
                    />
                  )}
                />
              </Grid>
            </DataHandlerList>
          </Card>
          <PaginationButtons {...rest} />
        </Box>
        <EditDialog editId={editId} onClose={() => setEditId(null)} />
        <DeleteDialog
          docId={deleteId}
          onClose={() => setDeleteId(null)}
          fetchData={fetchData}
        />
        <AddDialog
          name="doc"
          fetchDocs={fetchData}
          open={openAdd}
          onClose={() => setOpenAdd(false)}
        />
      </Page>
    </div>
  );
};

export default DocumentView;
