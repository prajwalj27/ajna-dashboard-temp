import axios from "axios";
import Config from "../config/Config";

import { GET_PROFILE, PROFILE_ERROR } from "../constants/actionTypes";
// Get current client profile
export const getCurrentProfile = (id) => async (dispatch) => {
  try {
    const res = await axios.get(Config.hostName + "/api/clients/" + id);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err && err.response && err.response.statusText,
        status: err && err.response && err.response.status,
      },
    });
  }
};
