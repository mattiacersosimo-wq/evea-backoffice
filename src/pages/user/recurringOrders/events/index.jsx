import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Tab,
  Tabs,
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router";
import DataHandlerList from "src/components/data-handler/list";
import useQueryTabs from "src/hooks/use-query-tabs";

import { useTranslation } from "react-i18next";
import EventCard from "./components/eventCard";
import useFetchEvents from "./hooks/useFetchEvents";

const Index = () => {
  const [scope, setScope] = useQueryTabs("private", "scope");
  const [eventType, setEventType] = useQueryTabs("upcoming");
  const { id } = useParams();

  const isPublic = scope === "public";

  const { data, state, actions } = useFetchEvents();

  useEffect(() => {
    if (data.length === 0) return;

    const filter = ({ event_status, access_scope }) => {
      if (isPublic) {
        return event_status === eventType;
      }

      return event_status === eventType && access_scope === "Private";
    };

    const filteredData = data.filter(filter);
    if (filteredData.length === 0) {
      actions.success();
      return;
    }
    if (eventType === "past") {
      actions.success(filteredData.reverse());
      return;
    }

    actions.success(filteredData);
    return;
  }, [eventType, data, isPublic, id]);
  const { data: filteredData, ...dataProps } = state;

  const { t } = useTranslation();
  return (
    <div>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <FormGroup
            sx={{
              width: "fit-content",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  disabled={state.error}
                  checked={isPublic}
                  onClick={(_) => {
                    actions.loading();
                    setScope(_, isPublic ? "private" : "public");
                  }}
                />
              }
              label={t("user.subscriptions.list_public_events")}
              labelPlacement="start"
            />
          </FormGroup>
        </Box>

        <Box sx={{ p: 0 }}>
          <Tabs
            allowScrollButtonsMobileTabs
            variant="scrollable"
            scrollButtons="auto"
            value={eventType}
            onChange={(e, v) => {
              if (state.error) return;
              actions.loading();
              setEventType(e, v);
            }}
          >
            <Tab
              disabled={state.error}
              label={t("global.upcoming")}
              value="upcoming"
            />
            <Tab disabled={state.error} label={t("global.past")} value="past" />
          </Tabs>
          <Box sx={{ mb: 1 }} />
          <DataHandlerList dataProps={{ ...dataProps }}>
            <EventCard data={filteredData} />
          </DataHandlerList>
        </Box>
      </Box>
    </div>
  );
};

export default Index;
