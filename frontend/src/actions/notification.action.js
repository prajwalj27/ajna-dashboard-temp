import axios from "axios";
import { SHOW_NOTIFICATIONS } from "../constants/actionTypes";
import Config from "../config/Config";
import { setAlert } from "./alert.actions";
import setAuthToken from "../utils/setAuthToken.js";

// show notifications
export const showNotifications = (data, id) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = axios.post(Config.hostName + `/api/users/notification/` + id, {
      notification: data,
    });
    dispatch({
      type: SHOW_NOTIFICATIONS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
    }
  }
};
