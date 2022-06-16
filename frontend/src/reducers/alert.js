import {
    SET_ALERT,
    REMOVE_ALERT,
    CLEAR_ALERTS
  } from "../constants/actionTypes";
  
  const initialState = [];
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case SET_ALERT:
        return [payload];
      case REMOVE_ALERT:
        return state.filter(alert => alert.id !== payload);
      case CLEAR_ALERTS:
        return (state = []);
      default:
        return state;
    }
  }