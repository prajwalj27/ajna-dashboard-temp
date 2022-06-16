import axios from "axios";
import Config from "../config/Config";
import {
  PDF_DWELL_TIME_ANALYSIS,
  DWELL_TIME_ERROR,
  CLEAR_DWELL_TIME,
} from "../constants/actionTypes";
import setAuthToken from "../utils/setAuthToken.js";

export const pdfDwellTimeAnalysis = (id, data) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.post(
      Config.hostName + `/api/dwell-time-analysis/pdf/` + id,
      { data }
    );
    dispatch({
      type: PDF_DWELL_TIME_ANALYSIS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DWELL_TIME_ERROR,
      payload: {
        msg: err && err.response && err.response.statusText,
        status: err && err.response && err.response.status,
      },
    });
  }
};

export const clearDwell = () => async (dispatch) => {
  dispatch({
    type: CLEAR_DWELL_TIME,
    // payload: res.data,
  });
};
