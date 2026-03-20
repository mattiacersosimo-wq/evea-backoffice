import { PATH_DASHBOARD } from "src/routes/paths";

const topLink = [
  {
    primary: "help_center.side_bar.dashboard",
    to: PATH_DASHBOARD.communication.help_center_tickets,
    icon: {
      icon: "ic:round-dashboard",
      color: "#009688",
    },
    name: "ticket-dashboard",
  },
  {
    primary: "help_center.side_bar.all",
    to: "all",
    icon: {
      icon: "bi:ticket-perforated",
      color: "#ffc107",
    },
    name: "all-tickets",
  },
  {
    primary: "help_center.side_bar.overdue",
    to: "overdue",
    icon: {
      icon: "healthicons:i-schedule-school-date-time",
      color: "#ff5722",
    },
    name: "overdue",
  },
  {
    primary: "help_center.side_bar.open",
    to: "open",
    icon: {
      icon: "ant-design:folder-open-outlined",
      color: "#795548",
    },
    name: "open",
  },
  {
    primary: "help_center.side_bar.resolved",
    to: "resolved",
    icon: {
      icon: "el:ok-circle",
      color: "#4caf50",
    },
    name: "resolved",
  },
  {
    primary: "help_center.side_bar.closed",
    to: "closed",
    icon: {
      icon: "ant-design:close-circle-outlined",
      color: "#f44336",
    },
    name: "closed",
  },
  {
    primary: "help_center.side_bar.in_progress",
    to: "inprogress",
    icon: {
      icon: "quill:loading-spin",
      color: "#00e676",
    },
    name: "in-progress",
  },
  {
    primary: "help_center.side_bar.responded",
    to: "responded",
    icon: {
      icon: "carbon:list-boxes",
      color: "#651fff",
    },
    name: "responded",
  },
];

export default topLink;
