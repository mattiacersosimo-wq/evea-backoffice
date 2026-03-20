import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, MenuItem } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import * as yup from "yup";
import DataList from "./dataList";
import DeleteDialog from "./deleteDialog";
import VideoEditDialog from "./editDialog";
import VideoCard from "./videoCard";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  video_tool_url: yup.string().required("Video URL is required"),
});

const defaultValues = {
  video_tool_url: "",
  title: "",
};
const headers = [
  "tools.documents.no",
  "global.Video_title",
  "global.View",
  "tools.documents.created",
  "tools.documents.action",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
    edit: test("edit"),
    remove: test("delete"),
  };
};
const VideoList = ({ rowStart, dataProps, fetchVideo, videos }) => {
  const { add, edit, remove } = genStatus(
    "nav.tools.title",
    "nav.tools.videos"
  );
  const [selectedId, setSelectedId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const videoList = videos.find((video) => video.id === selectedId);
  const openEdit = () => {
    const { title, video_url, id } = videoList;
    setIsEditOpen(true);
    handleCloseMenu();
    methods.reset({
      title: title,
      video_tool_url: video_url,
      id: id,
    });
  };
  const { t } = useTranslation();
  const closeVideo = () => {
    setIsEditOpen(false);
  };
  const [openMenu, setOpenMenuActions] = useState(false);
  const handleOpenMenu = (id) => (event) => {
    setSelectedId(id);
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(false);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleCloseMenu();
  };

  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <Page title={"tools.videos.videos_tool"}>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Scrollbar>
          <DataHandlerTable
            name="documents"
            headers={headers}
            dataProps={dataProps}
          >
            <Map
              list={videos}
              render={(videos, i) => (
                <DataList
                  disabledActions={!(edit || remove)}
                  handleOpenMenu={handleOpenMenu}
                  rowNumber={rowStart + i}
                  videos={videos}
                />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Box>
      <TableMenu open={openMenu} onClose={handleCloseMenu}>
        <Ternary
          when={edit}
          then={
            <MenuItem
              sx={{ color: "default.main" }}
              onClick={openEdit}
              name="edit"
            >
              <Iconify icon={"akar-icons:edit"} />
              <Translate>tools.documents.edit</Translate>
            </MenuItem>
          }
        />
        <Ternary
          when={remove}
          then={
            <MenuItem
              sx={{ color: "error.main" }}
              onClick={handleOpenDelete}
              name="delete"
            >
              <Iconify icon={"eva:trash-2-outline"} />
              <Translate>tools.documents.delete</Translate>
            </MenuItem>
          }
        />
      </TableMenu>
      <DeleteDialog
        open={openDelete}
        deleteId={selectedId}
        onClose={handleCloseDelete}
        reload={fetchVideo}
      />
      <VideoEditDialog
        fetchVideos={fetchVideo}
        selectedId={selectedId}
        open={isEditOpen}
        onClose={closeVideo}
        methods={methods}
        title={t("edit_Video")}
      />
    </Page>
  );
};

export default VideoList;
