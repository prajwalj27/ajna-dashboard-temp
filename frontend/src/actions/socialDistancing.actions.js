import axios from "axios";
import Config from "../config/Config";
import {
  GET_SOCIALDISTANCING_COUNT,
  LOADING,
  SOCIALDISTANCING_ERROR,
  GET_SOCIAL_TODAY_DATA,
  SOCIALPUSHER,
} from "../constants/actionTypes";
import setAuthToken from "../utils/setAuthToken.js";

export const getSocialDistancingCount = (id, camera, type) => async (
  dispatch
) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    // console.log("idsocial", id, camera, type);
    const res = await axios.post(
      `${Config.hostName}/api/social-distancing/count/${id}/${type}`,
      {
        camera,
      }
    );
    dispatch({
      type: GET_SOCIALDISTANCING_COUNT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SOCIALDISTANCING_ERROR,
      payload: {
        msg: err && err.response && err.response.statusText,
        status: err && err.response && err.response.status,
      },
    });
  }
};

export const getSocialDistancingTodayData = (id, camera, type) => async (
  dispatch
) => {
  let localImageArray = [];
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    await axios
      .post(`${Config.hostName}/api/social-distancing/metoday/${id}/${type}`, {
        camera,
      })
      .then(async (res) => {
        dispatch({
          type: GET_SOCIAL_TODAY_DATA,
          payload: res.data,
        });
      });
  } catch (err) {
    // console.log("errsock", err);
    dispatch({
      type: SOCIALDISTANCING_ERROR,
      payload: {
        msg: err && err.response && err.response.statusText,
        status: err && err.response && err.response.status,
      },
    });
  }
};

export const pusherSocial = (id, data) => async (dispatch) => {
  dispatch({
    type: SOCIALPUSHER,
    payload: data,
  });
};
