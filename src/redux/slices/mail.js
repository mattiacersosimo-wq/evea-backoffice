import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "src/utils/axios";
// utils

//
import { dispatch } from "../store";

// ----------------------------------------------------------------------

export function objFromArray(array, key = "id") {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: null,
  mails: { byId: {}, allIds: [] },
  labels: [],
};

const slice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET LABELS
    getLabelsSuccess(state, action) {
      state.isLoading = false;
      state.labels = action.payload;
    },

    // GET MAILS
    getMailsSuccess(state, action) {
      const mails = action.payload;
      state.isLoading = false;
      state.mails.byId = objFromArray(mails);
      state.mails.allIds = Object.keys(state.mails.byId);
    },

    // GET MAIL
    getMailSuccess(state, action) {
      const mail = action.payload;

      state.mails.byId[mail.id] = mail;
      if (!state.mails.allIds.includes(mail.id)) {
        state.mails.allIds.push(mail.id);
      }
    },
  },
});

// Reducer
export default slice.reducer;

export function getLabels() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await axiosInstance.get("api/admin/mail/labels");
      dispatch(slice.actions.getLabelsSuccess(data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getMails(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data, status } = await axiosInstance.get("api/admin/mail", {
        params,
      });
      if (status === 200) {
        dispatch(slice.actions.getMailsSuccess(data.data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getMail(mailId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        "https://minimal-assets-api.vercel.app/api/mail/mails",
        {
          params: { mailId },
        }
      );
      dispatch(slice.actions.getMailSuccess(response.data.mail));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getMailsMinimal(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data, status } = await axiosInstance.get(
        "https://minimal-assets-api.vercel.app/api/mail/mails",
        {
          params,
        }
      );
      if (status === 200) {
        dispatch(slice.actions.getMailsSuccess(data.mails));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getLabelsMinimal() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await axios.get(
        "https://minimal-assets-api.vercel.app/api/mail/labels"
      );
      dispatch(slice.actions.getLabelsSuccess(data.labels));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
