import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
} from "@mui/material";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import { Delete, Edit } from "src/components/Icons";
import PaginationButtons from "src/components/pagination";
import Scrollbar from "src/components/Scrollbar";
import { object, string } from "yup";

import { LoadingButton } from "@mui/lab";
import moment from "moment";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";

import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import serializeDate from "src/utils/serialize-date";
import useMaterialDelete from "../hooks/useMaterialDelete";
import useMaterialEdit from "../hooks/useMaterialEdit";
import useMaterialVideo from "../hooks/useMaterialVideo";
import Transition from "src/utils/dialog-animation";

const headers = [
  "tools.documents.no",
  "tools.videos.video",
  "tools.videos.title",
  "material.add_material.expiry_date",
  "tools.videos.edit",
  "tools.videos.delete",
];

const schema = object().shape({
  video_title: string()
    .typeError("Video title is required")
    .required("Video title is required"),

  video_access_time: string()
    .typeError("Expiry date is required")
    .test("is-valid", "errors.date.valid_date.test", (v) =>
      moment(v, "DD/MM/YYYY").isValid()
    )
    .transform((v) => serializeDate(v))
    .required("Expiry date is required"),
  video_url: string()
    .typeError("Video url is required")
    .required("Video url is required"),
});

const defaultValues = {
  active: 1,
  id: "",
  video_title: "",
  video_access_time: "",
  video_url: "",
};

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    editVideo: test("edit-video"),
    deleteVideo: test("delete-video"),
  };
};

const Index = () => {
  const { state, rowStart, fetchVideos, ...rest } = useMaterialVideo();
  const { data, ...dataProps } = state;

  const { closeDelete, deleteId, openDelete, onDelete } =
    useMaterialDelete(fetchVideos);
  const { closeEdit, isEditOpen, onSubmit, openEdit, methods } =
    useMaterialEdit({
      reset: fetchVideos,
      path: "api/admin/materials-video-show",
      defaultValues: defaultValues,
      schema: schema,
    });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const onEdit = handleSubmit(onSubmit("api/admin/materials-video"));
  const { editVideo, deleteVideo } = genStatus(
    "nav.store.title",
    "nav.store.materials"
  );
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Scrollbar>
          <DataHandlerTable
            name="category-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(category, i) => (
                <TableRow>
                  <TableCell>{i + rowStart}</TableCell>
                  <TableCell component="a" href={category.video_url}>
                    {category.video_url}
                  </TableCell>
                  <TableCell>{category.video_title}</TableCell>
                  <TableCell>
                    <ParseDate date={category.video_access_time} />
                  </TableCell>
                  <TableCell>
                    <Edit
                      disabled={!editVideo}
                      color="primary"
                      onClick={openEdit(category.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Delete
                      disabled={!deleteVideo}
                      onClick={openDelete(category.id)}
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
          <Translate>{"tools.videos.deleteVideos"}</Translate>
        </DialogTitle>
        <DialogContent>
          {" "}
          <Translate>{"tools.videos.areYouSure"}</Translate>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDelete}>
            {" "}
            <Translate>{"tools.videos.close"}</Translate>
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={onDelete("api/admin/materials-video")}
          >
            <Translate> {"tools.documents.delete"}</Translate>
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditOpen}
        onClose={closeEdit}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate>{"products.video.edit_video"}</Translate>
        </DialogTitle>

        <FormProvider methods={methods} onSubmit={onEdit}>
          <DialogContent
            sx={{
              "& *": {
                margin: "0.4rem 0",
              },
            }}
          >
            <RHFTextField name="video_title" label={"tools.videos.title"} />
            <RHFDatePicker
              name="video_access_time"
              label={"material.add_material.expiry_date"}
            />
            <RHFTextField name="video_url" label={"tools.videos.videoURLs"} />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEdit} color="error">
              <Translate>{"tools.videos.cancel"}</Translate>
            </Button>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              type="submit"
            >
              <Translate> {"tools.videos.update"}</Translate>
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default Index;
