import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  MASTER_CLIENT_SELECTION,
  SELECTED_CAMERA,
  REMOVE_SELECTED_CAMERA,
  ALERT_CONFIG,
  ADD_CAMERA,
  EDIT_CAMERA,
  MapUserBranchIdWithBranchName,
  ADD_DEVICE,
  DELETE_CAMERA,
  EDIT_DEVICE,
  DELETE_DEVICE,
} from "../constants/actionTypes";
import jwt from "jsonwebtoken";
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: false,
  user: null,
  initialUser: null,
  selectedCamera: "",
  tokenType: "",
  userBranches: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      if (payload.camera)
        payload.camera.map((i) => {
          i.cameraFrame = "";
        });
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        initialUser: payload,
      };
    case SELECTED_CAMERA:
      return {
        ...state,
        loading: false,
        selectedCamera: payload,
      };
    case MASTER_CLIENT_SELECTION:
      payload.camera.map((i) => {
        i.cameraFrame = "";
      });
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      let tokenType = jwt.decode(payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        tokenType: tokenType.user.userType,
      };
    case MapUserBranchIdWithBranchName:
      return {
        ...state,
        userBranches: payload,
      };
    case ALERT_CONFIG:
      let obj = { ...state.user };
      obj.alertConfig = payload;
      return {
        ...state,
        user: obj,
      };
    case ADD_CAMERA:
      let userData = { ...state.user };
      userData.camera = payload.camera;
      return {
        ...state,
        user: userData,
      };
    case DELETE_CAMERA:
      let userdata = { ...state.user };
      userdata.camera = payload.camera;
      return {
        ...state,
        user: userdata,
      };
    case EDIT_CAMERA:
      let editedData = { ...state.user };
      editedData.camera = payload.camera;
      return {
        ...state,
        user: editedData,
      };
    case ADD_DEVICE:
      let userDevice = { ...state.user };
      userDevice.device = payload.device;
      return {
        ...state,
        user: userDevice,
      };
    case EDIT_DEVICE:
      let editDevice = { ...state.user };
      editDevice.device = payload.device;
      return {
        ...state,
        user: editDevice,
      };
    case DELETE_DEVICE:
      let deleteDevice = { ...state.user };
      deleteDevice.device = payload.device;
      return {
        ...state,
        user: deleteDevice,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REMOVE_SELECTED_CAMERA:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        state: [],
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        initialUser: null,
        selectedCamera: "",
        tokenType: "",
        userBranches: [],
      };
    default:
      return state;
  }
}
