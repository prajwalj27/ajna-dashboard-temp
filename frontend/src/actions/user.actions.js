import axios from "axios";
import {
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOADING,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CLEAR_ALERTS,
  CLEAR_PROFILE,
  SELECTED_CAMERA,
  CLEAR_SHOW_CLIENT,
  CLEAR_FOOTFALL,
  CLEAR_SOCIALDISTANCING,
  CLEAR_MASKDETECTION,
  MASTER_CLIENT_SELECTION,
  CLEAR_DWELL_TIME,
  REMOVE_SELECTED_CAMERA,
  ALERT_CONFIG,
  ADD_CAMERA,
  ADD_DEVICE,
  DELETE_CAMERA,
  EDIT_CAMERA,
  EDIT_DEVICE,
  DELETE_DEVICE,
  MapUserBranchIdWithBranchName,
} from "../constants/actionTypes";
import Config from "../config/Config";
import { setAlert } from "./alert.actions";
import setAuthToken from "../utils/setAuthToken.js";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get(Config.hostName + "/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
// Register User
export const register = (name, email, password, userType = "user") => (
  dispatch
) => {
  dispatch({
    type: CLEAR_ALERTS,
  });
  axios
    .post(Config.hostName + "/api/users", {
      name,
      email,
      password,
      userType,
    })

    .then(
      (res) =>
        dispatch(setAlert("Successfully Registered, Kindly Login", "success")),
      (error) => {
        const errors = error.response.data.errors;
        console.log(error);

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
          type: REGISTER_FAIL,
        });
      }
    );
};

// Login admin
export const loginadmin = (email, password, userType = "admin") => async (
  dispatch
) => {
  try {
    dispatch({
      type: CLEAR_ALERTS,
    });

    dispatch({
      type: LOADING,
    });
    const res = await axios.post(Config.hostName + "/api/auth/admin", {
      email,
      password,
      userType,
    });
    setAuthToken(res.data.token);
    await dispatch(loadUser());
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Login Client
export const loginclient = (email, password, userType = "client") => async (
  dispatch
) => {
  try {
    dispatch({
      type: CLEAR_ALERTS,
    });
    dispatch({
      type: LOADING,
    });
    const res = await axios.post(Config.hostName + "/api/auth/client", {
      email,
      password,
      userType,
    });
    setAuthToken(res.data.token);
    await dispatch(loadUser());
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
  //  catch (err) {
  //   if (err.response) {
  //     const errors = err.response.data.errors;
  //     if (errors) {
  //       errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
  //     }
  //     dispatch({
  //       type: LOGIN_FAIL,
  //     });
  //   }
  //   dispatch({
  //     type: LOGIN_FAIL,
  //   });
  // }
};

// Login User
export const login_client_user = (email, password, userType = "user") => async (
  dispatch
) => {
  console.log("user", email, userType);
  try {
    dispatch({
      type: CLEAR_ALERTS,
    });
    dispatch({
      type: LOADING,
    });
    const res = await axios.post(Config.hostName + "/api/auth", {
      email,
      password,
      userType,
    });
    // console.log("token",res.data)
    setAuthToken(res.data.token);
    await dispatch(loadUser());
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log("err", err.response);

    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: LOGIN_FAIL,
      });
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// redirected user login
export const redirected_login = (loginToken) => async (
  dispatch
) => {
  console.log(loginToken);
  try {
    dispatch({
      type: CLEAR_ALERTS,
    });
    dispatch({
      type: LOADING,
    });
    setAuthToken(loginToken);
    await dispatch(loadUser())
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {token: loginToken},
    });
  } catch (err) {
    console.log("err", err);

    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: LOGIN_FAIL,
      });
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};



// Master select id
export const masterClientSelection = (user) => async (dispatch) => {
  dispatch({
    type: MASTER_CLIENT_SELECTION,
    payload: user,
  });
  dispatch({ type: CLEAR_FOOTFALL });
  dispatch({ type: CLEAR_SOCIALDISTANCING });
  dispatch({ type: CLEAR_MASKDETECTION });
};

// Show selected camera data
export const getSelectedCameraData = (camera) => async (dispatch) => {
  dispatch({
    type: SELECTED_CAMERA,
    payload: camera,
  });
};

// Alert Configurations
export const alertConfig = (data) => async (dispatch) => {
  dispatch({
    type: ALERT_CONFIG,
    payload: data,
  });
};

// Add Camera configuration
export const addCameraConfiguration = (branchId, camera) => async (
  dispatch
) => {
  try {
    await axios
      .post(Config.hostName + `/api/branch/camera/` + branchId, {
        camera,
      })
      .then(async (res) => {
        console.log("res", res.data.dataClient);
        dispatch({
          type: ADD_CAMERA,
          payload: res.data.dataClient,
        });
        dispatch(setAlert("Camera added", "success"));
      });
  } catch (error) {
    dispatch(setAlert("Network error Occured", "danger"));

    console.log("error camera", error);
  }
};

// Delete Specific Camera
export const deleteCameraConfiguration = (branchId, camera) => async (
  dispatch
) => {
  try {
    await axios
      .delete(`${Config.hostName}/api/branch/camera/${branchId}/${camera}`)
      .then(async (res) => {
        dispatch({
          type: DELETE_CAMERA,
          payload: res.data,
        });
        dispatch(setAlert("Camera Deleted", "success"));
      });
  } catch (error) {
    dispatch(setAlert("Network error Occured", "danger"));

    console.log("error camera", error);
  }
};

// Edit Specific Camera
export const editCameraConfiguration = (branchId, c_id, camera) => async (
  dispatch
) => {
  try {
    await axios
      .post(`${Config.hostName}/api/branch/updatecamera/${branchId}/${c_id}`, {
        camera,
      })
      .then(async (res) => {
        dispatch({
          type: EDIT_CAMERA,
          payload: res.data,
        });
        dispatch(setAlert("Camera Updated", "success"));
      });
  } catch (error) {
    dispatch(setAlert("Network error Occured", "danger"));

    console.log("error camera", error);
  }
};

// Add Device configuration
export const addDeviceConfiguration = (branchId, device) => async (
  dispatch
) => {
  try {
    dispatch({ type: CLEAR_ALERTS });

    let res = await axios.post(
      Config.hostName + `/api/branch/device/` + branchId,
      {
        device,
      }
    );
    await dispatch({
      type: ADD_DEVICE,
      payload: res.data.dataClient,
    });
    dispatch(setAlert("Device Added", "success"));
  } catch (error) {
    // const errors = error.response.data.errors;
    // if (errors) {
    //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    // }
    dispatch(setAlert("Network error Occured", "danger"));
    // if (error) dispatch(setAlert("Network error Occured", "danger"));
  }
};

// Edit Specific Device
export const editDeviceConfiguration = (branchId, device_id, device) => async (
  dispatch
) => {
  try {
    await axios
      .post(
        `${Config.hostName}/api/branch/updatedevice/${branchId}/${device_id}`,
        {
          device,
        }
      )
      .then(async (res) => {
        console.log("device res", res.data);
        dispatch({
          type: EDIT_DEVICE,
          payload: res.data,
        });
        dispatch(setAlert("Device Updated", "success"));
      });
  } catch (error) {
    dispatch(setAlert("Network error Occured", "danger"));

    console.log("error camera", error);
  }
};

// Delete Specific Device
export const deleteDeviceConfiguration = (branchId, device) => async (
  dispatch
) => {
  try {
    await axios
      .delete(`${Config.hostName}/api/branch/device/${branchId}/${device}`)
      .then(async (res) => {
        dispatch({
          type: DELETE_DEVICE,
          payload: res.data,
        });
        dispatch(setAlert("Device Deleted", "success"));
      });
  } catch (error) {
    dispatch(setAlert("Network error Occured", "danger"));

    console.log("error camera", error);
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_ALERTS });
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: CLEAR_SHOW_CLIENT });
  dispatch({ type: CLEAR_FOOTFALL });
  dispatch({ type: CLEAR_SOCIALDISTANCING });
  dispatch({ type: CLEAR_MASKDETECTION });
  dispatch({ type: CLEAR_DWELL_TIME });
  dispatch({ type: REMOVE_SELECTED_CAMERA });
};

// Being User Map Branchid and Branch Names
export const userBranchIdmappedBranchName = (data) => async (dispatch) => {
  dispatch({
    type: MapUserBranchIdWithBranchName,
    payload: data,
  });
};
