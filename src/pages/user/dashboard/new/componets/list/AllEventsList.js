import {
  Box,
  Button,
  Card,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";

import { PATH_USER } from "src/routes/paths";
import EventList from "./EventList";
import "./style.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    value: index,
  };
}

const findTodays = (events = []) => {
  const dayStart = moment().startOf("day");
  const dayEnd = moment().endOf("day");

  return events.filter(({ converted_date }) => {
    const currentDate = moment(converted_date);
    return currentDate.isAfter(dayStart) && currentDate.isBefore(dayEnd);
  });
};

const filter = (data, arg) => {
  const filterData = (arg) =>
    data.filter(
      ({ access_scope }) => access_scope.toLowerCase() === arg.toLowerCase()
    );

  switch (arg) {
    case "all":
      return data;
    case "active":
      return filterData("private");
    case "public":
      return filterData("public");

    case "today":
      return findTodays(data);
    default:
      return [];
  }
};

const AllEventsList = ({ events }) => {
  const [value, setValue] = useState("today");
  const [show, setShow] = useState([]);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setShow(filter(events, value));
  }, [value, events]);

  return (
    <>
      <Card sx={{ p: 0, borderRadius: "7px" }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", p: 2, pb: 0 }}>
            <Tabs
              variant="scrollable"
              value={value}
              scrollButtons
              allowScrollButtonsMobile
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label={"todays"} {...a11yProps("today")} />
              <Tab
                label={"userDashboard.activeSubscriptionEvents"}
                {...a11yProps("active")}
              />
              <Tab
                label={"userDashboard.publicEvents"}
                {...a11yProps("public")}
              />
              <Tab label={"userDashboard.allEvents"} {...a11yProps("all")} />
            </Tabs>
          </Box>
          <EventList events={show} tab={value} />
        </Box>
        <Divider />

        {/* <Box sx={{ p: 2, textAlign: "right" }}>
          <Button
            LinkComponent={Link}
            to={PATH_USER.events}
            size="small"
            color="primary"
            endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
          >
            {("viewMore")}
          </Button>
        </Box> */}
      </Card>
    </>
  );
};

export default AllEventsList;
