import { Box, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import DataHandlerTable from "src/components/data-handler/table";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";
import Ternary from "src/components/ternary";

import axiosInstance from "src/utils/axios";
import AddDialog from "./components/addDialog";
import NotesList from "./components/notesList";

const Index = () => {
  const { palette } = useTheme();
  const isDark = palette.mode === "dark";

  const [notes, setNotes] = useState([]);
  const [editNotes, setEditNotes] = useState(null);
  const [addNotes, setAddNotes] = useState(null);

  const { count, onChange, page, seed } = usePagination();
  const [state, actions] = useDataHandler();

  const { data, ...dataProps } = state;
  const fetchNotes = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(`/api/user/notes?page=${page}`);
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
        <Box sx={{ p: 2, display: "flex", justifyContent: "right" }}>
          <AddDialog fetchNotes={fetchNotes} addNotes={addNotes} />
        </Box>

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
