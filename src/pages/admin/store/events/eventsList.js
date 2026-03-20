import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import Actions from "./Actions";
import EventsRow from "./eventsRow";
import TableMenu from "./tableMenu";

const headers = [
  "events.no",
  "events.events_type",
  "URL",
  "events.zoom_password",
  "events.from",
  "events.time",
  "events.duration",
  "events.host",
  "events.topic",
  "events.action",
];

const EventsList = ({ status }) => {
  const [eventId, setEventId] = useState(null);
  const { count, onChange, page, rowStart, seed } = usePagination();
  const [state, actions] = useDataHandler();
  const { data, ...dataProps } = state;
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setEventId(id);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const fetchEventsList = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/events?page=${page}`
      );
      const { status, data: events } = data;
      if (status) {
        const { data: list, last_page, from } = events;
        seed(last_page, from);
        if (Boolean(list.length)) {
          actions.success(list);
          return;
        }
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventsList(page);
  }, [page]);

  return (
    <div>
      <Card sx={{ p: 3 }}>
        <Scrollbar>
          <DataHandlerTable
            name="faq-table"
            headers={headers}
            dataProps={dataProps}
          >
            <Map
              list={data}
              render={(item, i) => (
                <EventsRow
                  disableAction={!(status.edit || status.delete)}
                  handleOpenMenu={handleOpenMenu}
                  events={item}
                  row={rowStart + i}
                />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>

      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <Actions
          status={status}
          eventId={eventId}
          fetchEventsList={fetchEventsList}
          close={handleCloseMenu}
        />
      </TableMenu>
      <PaginationButtons count={count} onChange={onChange} page={page} />
    </div>
  );
};

export default EventsList;
