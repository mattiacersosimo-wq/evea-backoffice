import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import { Delete, Edit, View } from "src/components/Icons";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import serializeDate from "src/utils/serialize-date";
import { object, string } from "yup";
import useMaterial from "../hooks/useMaterial";
import useMaterialDelete from "../hooks/useMaterialDelete";
import useMaterialEdit from "../hooks/useMaterialEdit";
import Transition from "src/utils/dialog-animation";

const headers = [
  "tools.documents.no",
  "tools.documents.docTitle",
  "material.add_material.expiry_date",
  "material.view",
  "tools.documents.edit",
  "tools.documents.delete",
];

const schema = object().shape({
  doc_title: string()
    .typeError("Document title is required")
    .required("Document title is required"),
  doc_access_time: string()
    .typeError("Expiry date is required")
    .test("is-valid", "errors.date.valid_date.test", (v) =>
      moment(v, "DD/MM/YYYY").isValid()
    )
    .transform((v) => serializeDate(v))
    .required("Expiry date is required"),
});

const defaultValues = {
  active: 1,
  id: "",
  doc_title: "",
  doc_access_time: "",
  doc: "",
};

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    viewDocument: test("view-document"),
    editDocument: test("edit-document"),
    deleteDocument: test("delete-document"),
  };
};

const Index = () => {
  const { state, rowStart, fetchDocuments, ...rest } = useMaterial();
  const { data, ...dataProps } = state;

  const { closeDelete, deleteId, openDelete, onDelete } =
    useMaterialDelete(fetchDocuments);
  const { closeEdit, isEditOpen, onSubmit, openEdit, methods } =
    useMaterialEdit({
      reset: fetchDocuments,
      path: "api/admin/materials-doc-show",
      defaultValues: defaultValues,
      schema: schema,
    });

  const handleSubmit = methods.handleSubmit(
    onSubmit("api/admin/materials-doc")
  );

  const { viewDocument, editDocument, deleteDocument } = genStatus(
    "nav.store.title",
    "nav.store.materials"
  );
  const { t } = useTranslation();
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Scrollbar>
          <DataHandlerTable
            name="category-table"
            headers={headers}
            dataProps={dataProps}
          >
            <Map
              list={data}
              render={(document, i) => (
                <TableRow key={document.id}>
                  <TableCell>{i + rowStart}</TableCell>
                  <TableCell>{document.doc_title}</TableCell>
                  <TableCell>
                    <ParseDate date={document.doc_access_time} />
                  </TableCell>
                  <TableCell>
                    <View
                      disabled={!viewDocument}
                      component={Link}
                      to={`/document/${document.doc_title}`}
                      state={{ href: document.doc_url }}
                    />
                  </TableCell>
                  <TableCell>
                    <Edit
                      disabled={!editDocument}
                      color="primary"
                      onClick={openEdit(document.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Delete
                      disabled={!deleteDocument}
                      onClick={openDelete(document.id)}
                      color="error"
                    />
                  </TableCell>
                </TableRow>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>
      <PaginationButtons {...rest} />

      <Dialog
        open={Boolean(deleteId)}
        onClose={closeDelete}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate>{"tools.documents.deleteDocument"}</Translate>
        </DialogTitle>
        <DialogContent>
          <Translate>{"tools.documents.areYousure"}</Translate>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>
            <Translate> {"tools.documents.cancel"}</Translate>
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={onDelete("api/admin/materials-doc")}
          >
            <Translate>{"tools.documents.delete"}</Translate>
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditOpen}
        onClose={closeEdit}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate> {"tools.documents.uploadDocument"}</Translate>
        </DialogTitle>

        <FormProvider methods={methods} onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              "& *": {
                margin: "0.4rem 0",
              },
            }}
          >
            <RHFTextField name="doc_title" label={"tools.documents.docTitle"} />
            <RHFDatePicker
              name="doc_access_time"
              label={"user.subscriptions.expiry_date"}
            />

            <TextField
              {...methods.register("doc")}
              fullWidth
              label={t("tools.documents.fileUpload")}
              type="file"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEdit} color="error">
              <Translate> {"tools.documents.cancel"}</Translate>
            </Button>
            <Button variant="contained" type="submit">
              <Translate> {"tools.documents.submit"}</Translate>
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default Index;
