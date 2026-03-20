import { CLEAR, LOAD } from "./types";

export const load = (payload) => ({ type: LOAD, payload });
export const clear = () => ({ type: CLEAR, payload: {} });
