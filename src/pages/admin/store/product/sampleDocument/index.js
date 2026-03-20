import { useState } from "react";

import { Box, Button, Card, Grid } from "@mui/material";

import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";

import DeleteDialog from "../document/components/DeleteDialog";
import AddDialog from "../document/components/addDialog";
import DocumentCard from "../document/components/documentCard";
import EditDialog from "./components/edit";
import useGetSampleDocuments from "./hooks/use-get-sample-documents";
import Translate from "src/components/translate";

const SampleDocument = () => {
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const { state, fetchDocs, ...rest } = useGetSampleDocuments();
  const handleOpen = (isEdit) => (id) =>
    isEdit ? setEditId(id) : setDeleteId(id);

  const { data, ...dataProps } = state;

  return (
    <div>
      <Page title={"products.sample_doc.title"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"products.sample_doc.sample_doc"}
            links={[
              { name: "dashboard", href: PATH_DASHBOARD.root },
              {
                name: "products.sample_doc.products",
                href: PATH_DASHBOARD.store.products,
              },
              { name: "products.sample_doc.sample_doc" },
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
                <Translate> {"products.sample_doc.add"}</Translate>
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
                      handleOpen={handleOpen}
                      doc={doc}
                      key={doc.id}
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
          isSampleDocs
          fetchData={fetchDocs}
          docId={deleteId}
          onClose={() => setDeleteId(null)}
        />
        <AddDialog
          isSampleDocs
          name="sample_doc"
          fetchDocs={fetchDocs}
          open={openAdd}
          onClose={() => setOpenAdd(false)}
        />
      </Page>
    </div>
  );
};

export default SampleDocument;
