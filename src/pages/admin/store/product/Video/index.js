import { useState } from "react";
import useDeleteVideo from "../hook/useDelete";
import AddDialog from "./AddDialog";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import useEditVideo from "./hooks/useEditVideo";
import useGetVideo from "./hooks/useGetVideo";
import VideoCard from "./VideoCard";
import Wrapper from "./Wrapper";
import DataHandlerTable from "src/components/data-handler/table";
import { Grid } from "@mui/material";
import Ternary from "src/components/ternary";
import PaginationButtons from "src/components/pagination";

const Video = () => {
  const { closeEdit, openEdit, videoData } = useEditVideo();
  const { closeDelete, openDelete, itemId } = useDeleteVideo();
  const { state, fetchVideos, rowStart, ...rest } = useGetVideo();
  const [openAdd, setOpenAdd] = useState(false);
  const { data, ...dataProps } = state;

  return (
    <Wrapper openAdd={() => setOpenAdd(true)}>
      <DataHandlerTable dataProps={{ ...dataProps }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          p={3}
        >
          {data?.map((item) => (
            <Grid item xs={3} sm={3} md={3}>
              <VideoCard
                key={item.id}
                item={item}
                openEdit={openEdit(item)}
                openDelete={openDelete(item.id)}
              />
            </Grid>
          ))}
        </Grid>
      </DataHandlerTable>

      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />

      <AddDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fetchData={fetchVideos}
      />
      <EditDialog
        fetchData={fetchVideos}
        data={videoData}
        onClose={closeEdit}
      />
      <DeleteDialog
        fetchData={fetchVideos}
        videoId={itemId}
        onClose={closeDelete}
      />
    </Wrapper>
  );
};

export default Video;
