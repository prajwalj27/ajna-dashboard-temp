import { SHOW_CLIENT, CLEAR_SHOW_CLIENT } from "../constants/actionTypes";
const initialState = {
  selectedClient: {},
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SHOW_CLIENT:
      if (payload.camera) {
        payload.camera.map((i) => {
          i.cameraFrame = "";
        });
      }
      return {
        ...state,
        selectedClient: payload,
      };
    case CLEAR_SHOW_CLIENT:
      return {
        ...state,
        selectedClient: [],
      };
    default:
      return state;
  }
}
