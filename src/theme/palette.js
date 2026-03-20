import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const PRIMARY = {
  lighter: "#D1E9FC",
  light: "#76B0F1",
  main: "#348efe",
  dark: "#103996",
  darker: "#061B64",
};
const SECONDARY = {
  lighter: "#D6E4FF",
  light: "#84A9FF",
  main: "#3366FF",
  dark: "#1939B7",
  darker: "#091A7A",
};
const INFO = {
  lighter: "#D0F2FF",
  light: "#74CAFF",
  main: "#1890FF",
  dark: "#0C53B7",
  darker: "#04297A",
};
const SUCCESS = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#54D62C",
  dark: "#229A16",
  darker: "#08660D",
};
const WARNING = {
  lighter: "#FFF7CD",
  light: "#FFE16A",
  main: "#FFC107",
  dark: "#B78103",
  darker: "#7A4F01",
};
const ERROR = {
  lighter: "#FFE7D9",
  light: "#FFA48D",
  main: "#FF4842",
  dark: "#B72136",
  darker: "#7A0C2E",
};

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  250: "#ececec",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#59657E",
  650: "#59657E",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const CHART_COLORS = {
  violet: ["#826AF9", "#9E86FF", "#D0AEFF", "#F7D2FF"],
  blue: ["#2D99FF", "#83CFFF", "#A5F3FF", "#CCFAFF"],
  green: ["#2CD9C5", "#60F1C8", "#A4F7CC", "#C0F2DC"],
  yellow: ["#FFE700", "#FFEF5A", "#FFF7AE", "#FFF3D6"],
  red: ["#FF6C40", "#FF8F6D", "#FFBD98", "#FFF2D4"],
};

const WIDGET_COLORS_LIGHT = {
  green: {
    100: "#eafff2",
    200: "#def1ef",
    300: "#b0e4cc",
    400: "#00B13B",
    500: "#23C6A0",
  },
  red: {
    100: "#FFDEE3",
    300: "#dca8b0",
    400: "#FD3D84",
    500: "#fa4f16",
  },
  pink: {
    400: "#fd3b84",
  },
  purple: {
    5: "#ece7fd",
    10: "#e8e2ff",
    100: "#FFE4FD",
    300: "#d9aad6",
    400: "#B645FF",
    500: "#F4E9FF",
  },
  blue: {
    25: "#f4faff",
    50: "#EDF3FE",
    100: "#e1edff",
    150: "#dae6fb",
    200: "#eaf1fe",
    250: "#d2dff7",
    300: "#b6d1e4",
    400: "#2F85FF",
    500: "#E7F5F9",
  },
  yellow: {
    100: "#FFF4C2",
    300: "#e5d89a",
    500: "#F8EEE5",
  },
  black: {
    300: "#454F64",
  },
  white: {
    200: "#f7f7f7",
    300: "#fff",
  },
  grey: {
    300: "#59657E",
  },
  darkshadow: {
    300: "#dcdcdc",
  },
  menubgcolor: {
    300: "#E9EDF8",
  },
  treeinfobg: {
    300: "#E9EDF8",
  },
  tertiary: {
    200: "#7b869c",
    300: "#454F64",
    400: "#282a2e",
    450: "#8C95A7",
    500: "#919EAB",
    600: "#59657E",
  },
  cardBorder: {
    200: "#eceef3",
  },
  eventBg: {
    100: "#EDF3FE",
    200: "#f4faff",
    300: "#757575",
    400: "#8C95A7",
    500: "#fff",
  },
  border: {
    100: "#f1f1f1",
    300: "#e8e8e8",
  },
  tdcell: {
    300: "#282a2e",
  },
  grpahtext: {
    100: "#a0aabe",
  },
  // "#8C95A7" :
};

export const WIDGET_COLORS_DARK = {
  green: {
    100: "#294734",
    200: "#0a2a16",
    300: "#b0e4cc",
    400: "#00B13B",
    500: "#23C6A0",
  },
  red: {
    100: "#452f37",
    300: "#dca8b0",
    400: "#FD3D84",
    500: "#fa4f16",
  },
  pink: {
    400: "#fd3b84",
  },
  purple: {
    5: "#ece7fd",
    10: "#e8e2ff",
    100: "#FFE4FD",
    300: "#d9aad6",
    400: "#B645FF",
    500: "#2f1f3d",
  },
  blue: {
    25: "#f4faff",
    50: "#EDF3FE",
    100: "#112338",
    150: "#dae6fb",
    200: "#0e2c4e",
    250: "#d2dff7",
    300: "#b6d1e4",
    400: "#2F85FF",
    500: "#243b56",

  },
  yellow: {
    100: "#FFF4C2",
    300: "#e5d89a",
    500: "#352511",
  },
  black: {
    300: "#454F64",
  },
  white: {
    200: "#2e3b4b",
    300: "#f7f7f7",
  },
  grey: {
    300: "#59657E",
  },
  darkshadow: {
    300: "#222",
  },
  menubgcolor: {
    300: "#E9EDF8",
  },
  treeinfobg: {
    300: "#E9EDF8",
  },
  tertiary: {
    200: "#7b869c",
    300: "#d3d3d3",
    400: "#c9daed",
    450: "#c9daed",
    450: "#c9daed",
    500: "#959ca2",
    600: "#b0b9c3",
  },
  cardBorder: {
    200: "#eceef3",
  },
  eventBg: {
    100: "#284f7e",
    200: "#395f8d",
    300: "#dedede",
    400: "#a0aabe",
    500: "#2d5789",
  },
  border: {
    100: "#3c4752",
    300: "#3c4752",
  },
  tdcell: {
    300: "#c9daed",
  },
  grpahtext: {
    100: "#8C95A7",
  },
};

const COMMON = {
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY, contrastText: "#fff" },
  secondary: { ...SECONDARY, contrastText: "#fff" },
  info: { ...INFO, contrastText: "#fff" },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: "#fff" },
  grey: GREY,

  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  light: {
    ...COMMON,
    mode: "light",
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: "#fff", default: "#fff", neutral: GREY[200] },
    action: { active: GREY[600], ...COMMON.action },
    widgets: WIDGET_COLORS_LIGHT,
  },
  dark: {
    ...COMMON,
    mode: "dark",
    text: { primary: "#fff", secondary: "#fff", disabled: GREY[600] },
    background: { paper: GREY[800], default: GREY[900], neutral: GREY[500_16] },
    action: { active: GREY[500], ...COMMON.action },
    widgets: WIDGET_COLORS_DARK,
  },
  widgets: WIDGET_COLORS_LIGHT,
};

export { WIDGET_COLORS_LIGHT as WIDGET_COLORS };
export default palette;
