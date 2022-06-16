import axios from "axios";
import { SHOW_CLIENT } from "../constants/actionTypes";
import setAuthToken from "../utils/setAuthToken.js";
import Config from "../config/Config";
import { setAlert } from "./alert.actions";

export const showClientDetails = (clientData) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    const res = await axios.get(
      Config.hostName + `/api/branch/me/${clientData.branchId}`,
      {
        email: clientData.email,
        clientId: clientData.clientId,
        userType: "admin",
      }
    );
    dispatch({
      type: SHOW_CLIENT,
      payload: res.data,
    });
  } catch (err) {
    console.log("err", err.response);

    if (err.response) {
      const errors = err.response.data.errors;
      // if (errors) {
      //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      // }
      // dispatch({
      //   type: LOGIN_FAIL,
      // });
    }
  }
};
