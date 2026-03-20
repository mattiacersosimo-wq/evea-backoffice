import { Box, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import AddDialog from "./components/addDialog";
import NotesList from "./components/notesList";

import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import DataHandlerTable from "src/components/data-handler/table";
import Ternary from "src/components/ternary";
import { useMemberProfileContext } from "src/pages/admin/members/Profile/index.jsx";

const Index = () => {
  const { palette } = useTheme();
  const { memberProfile } = useMemberProfileContext();
  // const memberId = memberProfile?.user_profile?.id;
  const { mid } = useParams();
  const [notes, setNotes] = useState([]);
  const [editNotes, setEditNotes] = useState(null);
  const [addNotes, setAddNotes] = useState(null);

  const { count, onChange, page, seed } = usePagination();
  const [state, actions] = useDataHandler();
  const { data, ...dataProps } = state;
  const fetchNotes = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/member-notes/${mid}?page=${page}`
        // `/api/admin/notes?page=${page}&id=${memberId}`
      );
      const { status, data: notes } = data;
      if (status) {
        const { last_page, data: list } = notes;
        seed(last_page);
        setNotes(list);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes(page);
  }, [page]);

  return (
    <div>
      <Box>
        {/* <Box sx={{ p: 2, display: "flex", justifyContent: "right" }}>
            <AddDialog fetchNotes={fetchNotes} addNotes={addNotes} />
          </Box> */}

        <DataHandlerTable dataProps={{ ...dataProps }}>
          <NotesList
            notes={notes}
            fetchNotes={fetchNotes}
            setEditNotes={setEditNotes}
          />
        </DataHandlerTable>

        <Ternary
          when={!dataProps.isArrayEmpty}
          then={
            <PaginationButtons count={count} onChange={onChange} page={page} />
          }
        />
      </Box>
    </div>
  );
};

export default Index;
