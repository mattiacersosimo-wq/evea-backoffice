import { IconButton } from "@mui/material";
import Iconify from "../Iconify";

export const Edit = (props) => (
  <IconButton {...props}>
    <Iconify icon="akar-icons:edit" />
  </IconButton>
);

export const Delete = (props) => (
  <IconButton {...props}>
    <Iconify icon="fluent:delete-32-regular" />
  </IconButton>
);

export const View = (props) => (
  <IconButton {...props}>
    <Iconify icon="carbon:view" />
  </IconButton>
);
