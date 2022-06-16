import axios from "axios";
import Config from "../config/Config";
import {
  GET_FOOTFALL_TODAY_DATA,
  LOADING,
  FOOTFALL_ERROR,
  GET_FOOTFALL_ALL_DATA,
  FOOTFALLPUSHER,
} from "../constants/actionTypes";
import setAuthToken from "../utils/setAuthToken.js";

export const getFootfallAnalysisTodayData = (id, camera, type) => async (
  dispatch
) => {
  let localImageArray = [];
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    await axios
      .post(`${Config.hostName}/api/footfall-analysis/metoday/${id}/${type}`, {
        camera,
      })
      .then(async (res) => {
        dispatch({
          type: GET_FOOTFALL_TODAY_DATA,
          payload: res.data,
        });
      });
  } catch (err) {
    dispatch({
      type: FOOTFALL_ERROR,
      payload: {
        msg: err && err.response && err.response.statusText,
        status: err && err.response && err.response.status,
      },
    });
  }
};

export const getFootfallAllData = (id) => async (dispatch) => {
  let localImageArray = [];
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    let res = await axios.get(
      Config.hostName + `/api/footfall-analysis/all/` + id
    );
    dispatch({
      type: GET_FOOTFALL_ALL_DATA,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: FOOTFALL_ERROR,
      payload: {
        msg: err && err.response && err.response.statusText,
        status: err && err.response && err.response.status,
      },
    });
  }
};
export const pusherFootfall = (id, data) => async (dispatch) => {
  dispatch({
    type: FOOTFALLPUSHER,
    payload: data,
  });
};
