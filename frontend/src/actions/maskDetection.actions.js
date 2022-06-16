import axios from "axios";
import Config from "../config/Config";
import {
  GET_MASKDETECTION_TODAY_COUNT,
  LOADING,
  MASKDETECTION_ERROR,
  CLEAR_MASKDETECTION,
  MASKPUSHER,
} from "../constants/actionTypes";
import setAuthToken from "../utils/setAuthToken.js";

export const getMaskDetectionTodayCount = (id, camera, type) => async (
  dispatch
) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.post(
      `${Config.hostName}/api/maskdetection/todaycount/${id}/${type}`,
      {
        camera,
      }
    );
    // console.log("mask detection action", res.data);
    dispatch({
      type: GET_MASKDETECTION_TODAY_COUNT,
      payload: res.data,
    });
    // console.log("mask action", res.data);
  } catch (err) {
    dispatch({
      type: MASKDETECTION_ERROR,
      payload: {
        msg: err && err.response && err.response.statusText,
        status: err && err.response && err.response.status,
      },
    });
  }
};

export const pusherMask = (id, data) => async (dispatch) => {
  dispatch({
    type: MASKPUSHER,
    payload: data,
  });
};
