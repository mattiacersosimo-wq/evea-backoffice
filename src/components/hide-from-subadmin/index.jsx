import React from "react";
import isSubAdmin from "src/utils/is-sub-admin";
import Ternary from "../ternary";

const HideFromSubAdmin = ({ children }) => (
  <Ternary when={!isSubAdmin()} then={children} />
);

export default HideFromSubAdmin;
