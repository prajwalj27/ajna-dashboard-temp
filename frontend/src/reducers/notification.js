import {
  SHOW_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
} from "../constants/actionTypes";

const initialState = {
  notifications: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SHOW_NOTIFICATIONS:
      return {
        ...state,
        // notifications: notify,
      };
    case CLEAR_NOTIFICATIONS:
      return {
        ...state,
        // notifications: [],
      };
    default:
      return state;
  }
}
