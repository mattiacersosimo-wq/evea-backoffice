import {
  DESELECT_ALL_MAIL,
  SELECT_ALL_MAIL,
  SELECT_MAIL,
} from "./actionConstants";

export const selectMail = (payload) => ({ type: SELECT_MAIL, payload });
export const selectAllMail = (payload) => ({ type: SELECT_ALL_MAIL, payload });
export const deselectAllMail = () => ({ type: DESELECT_ALL_MAIL });
