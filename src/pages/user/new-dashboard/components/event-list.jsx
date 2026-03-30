import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import Translate from "src/components/translate";
import useEventList from "./event-list/hooks/use-event-list";
import ParseDate from "src/components/date";
import dayjs from "dayjs";
import serializeDate from "src/utils/serialize-date";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import axiosInstance from "src/utils/axios";
import ReactQuill from "react-quill";
import Transition from "src/utils/dialog-animation";

const EventList = () => {
  const theme = useTheme();
  const ref = useRef(null);
  const [open, setOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();

  const handleClickOpenEvent = () => {
    setOpenEvent(true);
  };

  const handleCloseEvent = () => {
    setOpenEvent(false);
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    return moment();
  });
  const eventData = useEventList(serializeDate(selectedDate));
  const { data, ...dataProps } = eventData;

  const days = useMemo(() => {
    return new Array(moment(selectedDate).daysInMonth())
      .fill(null)
      .map((_, i) => {
        return moment(selectedDate).startOf("month").add(i, "day");
      });
  }, [selectedDate]);

  useEffect(() => {
    if (ref) ref?.current.scrollIntoView(false);
  }, [ref]);

  const currentMonth = useMemo(() => {
    return moment(selectedDate).format("MMMM");
  }, [selectedDate]);

  const goToNextMonth = () => {
    const nextMonth = moment(selectedDate).add(1, "month");
    setSelectedDate(nextMonth);
  };

  const goToPrevMonth = () => {
    const nextMonth = moment(selectedDate).subtract(1, "month");
    setSelectedDate(nextMonth);
  };

  const fetchDataEventId = async (id) => {
    try {
      const { status, data } = await axiosInstance.get(
        `api/user/events-list/${id}`
      );

      if (status === 200) {
        setSelectedEvent(data?.data);
        handleClickOpenEvent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card
      sx={{ backgroundColor: theme.palette.widgets.eventBg[100], pb: "20px" }}
    >
      <Typography
        onClick={() => {
          ref?.current.scrollIntoView({ behavior: "smooth" });
        }}
        variant="subtitle2"
        sx={{ p: "15px 20px" }}
      >
        <Translate>user_dashboard.events.title</Translate>
      </Typography>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <IconButton onClick={goToPrevMonth} size="small">
            <Iconify icon="ic:round-chevron-left" />
          </IconButton>
          <Typography>{currentMonth}</Typography>
          <IconButton onClick={goToNextMonth} size="small">
            <Iconify icon="ic:round-chevron-right" />
          </IconButton>
        </Stack>
      </Box>
      <Box sx={{ py: 0.5, px: "15px" }}>
        <Scrollbar sx={{ mb: 2, p: 1 }}>
          <Stack direction="row" spacing={1}>
            {days?.map((day) => {
              const isHighlighted = day
                .startOf("day")
                .isSame(selectedDate.startOf("day"));
              return (
                <Stack
                  ref={isHighlighted ? ref : null}
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    setSelectedDate(day);
                  }}
                  sx={{
                    cursor: "pointer",
                    px: 0.6,
                    py: 0.6,
                    borderRadius: "10px",
                    color: theme.palette.widgets.tertiary[600],
                    backgroundColor: isHighlighted
                      ? "primary.main"
                      : "transparent",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "13px", lineHeight: "1" }}
                    color={
                      isHighlighted
                        ? "primary.contrastText"
                        : `$(theme.palette.widgets.tertiary[600])`
                    }
                  >
                    {day.format("DD")}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "11px", fontWeight: "300" }}
                    color={
                      isHighlighted
                        ? "primary.contrastText"
                        : `$(theme.palette.widgets.tertiary[600])`
                    }
                  >
                    {day.format("ddd")}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Scrollbar>
      </Box>

      <Scrollbar
        sx={{
          height: { lg: "190px", xs: "auto" },
          overflowY: "auto",
          px: "20px",
        }}
      >
        <DataHandlerList dataProps={dataProps}>
          <Map
            list={data}
            render={({ start_date, topic, time, id }) => {
              return (
                <Stack
                  direction="row"
                  sx={{
                    mb: 1,
                    backgroundColor: theme.palette.widgets.eventBg[200],
                    p: 1,
                    borderRadius: "8px",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    fetchDataEventId(id);
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: theme.palette.widgets.eventBg[500],
                      height: "40px",
                      width: "40px",
                      borderRadius: "6px",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.primary.main,
                        pt: 1.2,
                        lineHeight: ".5",
                      }}
                    >
                      {dayjs(start_date).format("DD")}
                    </Typography>

                    <Typography
                      sx={{ fontSize: "13px", color: theme.palette.grey[500] }}
                    >
                      {new Date(start_date).toLocaleDateString("en-GB", {
                        month: "short",
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ ml: 1, width: "calc(100% - 50px)" }}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.widgets.eventBg[300],
                        lineHeight: "1",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {topic}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.widgets.eventBg[400],
                        fontWeight: "300",
                      }}
                    >
                      {time}
                    </Typography>
                  </Box>
                </Stack>
              );
            }}
          />
        </DataHandlerList>
      </Scrollbar>

      <Dialog
        open={open}
        onClose={handleCloseEvent}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <img src={selectedEvent?.image} />

          <Typography variant="caption">
            <ParseDate date={selectedEvent?.start_date} />
          </Typography>
          <Typography>
            <Translate>events.add_event.topic</Translate> :
            {selectedEvent?.topic}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ overflowY: "visible" }}>
          <Box>
            <ReactQuill
              value={selectedEvent?.description}
              theme="bubble"
              readOnly
              style={{ padding: 0 }}
            />
          </Box>

          <Divider />
          <Box mt={2} />
          <Box>
            <Typography
              variant="caption"
              fontSize={14}
              textTransform="capitalize"
              fontWeight={600}
            >
              {selectedEvent?.event_type}
            </Typography>
          </Box>
          <Typography variant="caption" fontSize={14}>
            <Translate>events.add_event.location_Zoom</Translate> :
            <span style={{ marginLeft: "10px", fontWeight: 500 }}>
              {selectedEvent?.location_url}
            </span>
          </Typography>

          <Box
            sx={{
              display: "grid",
              columnGap: 1,
              marginTop: 2,
              rowGap: 1,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <Box>
              <Typography variant="caption" fontSize={14}>
                <Translate>events.add_event.host</Translate> :
                <Chip label={selectedEvent?.host} size="small" />
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontSize={14}>
                <Translate>events.add_event.duration</Translate> :
                <Chip label={selectedEvent?.duration} size="small" />
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontSize={14}>
                <Translate>events.add_event.time</Translate> :
                <Chip label={selectedEvent?.time} size="small" />
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontSize={14}>
                <Translate>events.add_event.time_zone</Translate> :{" "}
                <Chip label={selectedEvent?.timezone} size="small" />
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                fontSize={14}
                textTransform="capitalize"
              >
                Status :
                <Chip label={selectedEvent?.event_status} size="small" />
              </Typography>
            </Box>
            <Box>
              {selectedEvent?.zoom_password !== "" && (
                <Typography variant="caption" fontSize={14}>
                  <Translate>events.add_event.zoomPassword</Translate> :
                  <Chip label={selectedEvent?.zoom_password} size="small" />
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="error" onClick={handleCloseEvent}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EventList;
