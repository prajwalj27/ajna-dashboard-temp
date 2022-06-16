import {
  GET_SOCIALDISTANCING_COUNT,
  SOCIALDISTANCING_ERROR,
  CLEAR_SOCIALDISTANCING,
  LOADING,
  GET_SOCIAL_TODAY_DATA,
  SOCIALPUSHER,
} from "../constants/actionTypes";

const initialState = {
  violations: 0,
  loading: true,
  error: {},
  social_Today: [],
  todayViolationIndex: 0,
  CurrentViolationIndex: 0,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SOCIALDISTANCING_COUNT:
      return {
        ...state,
        violations: payload,
        loading: false,
      };
    case GET_SOCIAL_TODAY_DATA:
      let tempCurrent = payload.current_violation_index
          ? payload.current_violation_index
          : 0,
        tempTotal = payload.today_violation_index
          ? payload.today_violation_index
          : 0;
      // for (let i = 0; i < payload.length; i++) {
      //   tempTotal += payload[i].today_violation_index;
      //   tempCurrent += payload[i].current_violation_index;
      // }
      console.log("myta", tempCurrent, tempTotal);
      return {
        ...state,
        CurrentViolationIndex: tempCurrent,
        todayViolationIndex: tempTotal,
        social_Today: payload,
        loading: false,
      };
    case SOCIALPUSHER:
      return {
        ...state,
        CurrentViolationIndex: payload.current_violation_index,
        todayViolationIndex: payload.today_violation_index,
        violations: state.violations + 1,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case SOCIALDISTANCING_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_SOCIALDISTANCING:
      return {
        ...state,
        violations: 0,
        loading: false,
        error: {},
        violations: 0,
        social_Today: [],
        todayViolationIndex: 0,
        CurrentViolationIndex: 0,
      };
    default:
      return state;
  }
}
