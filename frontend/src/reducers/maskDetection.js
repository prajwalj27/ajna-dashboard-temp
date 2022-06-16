import {
  GET_MASKDETECTION_TODAY_COUNT,
  MASKDETECTION_ERROR,
  CLEAR_MASKDETECTION,
  LOADING,
  MASKPUSHER,
} from "../constants/actionTypes";

const initialState = {
  wearingMaskToday: 0,
  loading: true,
  error: {},
  notWearingMaskToday: 0,
  faceCount: 0,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MASKDETECTION_TODAY_COUNT:
      // console.log("mask reducer",payload)
      return {
        ...state,
        wearingMaskToday: payload[1].maskdetected,
        notWearingMaskToday: payload[0].facedetected - payload[1].maskdetected,
        faceCount: payload[0].facedetected,
        loading: false,
      };
    case MASKPUSHER:
      if (payload.Mask_detected) {
        var temp = state.wearingMaskToday + 1;
        var tempWithout = state.notWearingMaskToday;
      } else {
        var tempWithout = state.notWearingMaskToday + 1;
        var temp = state.wearingMaskToday;
      }
      return {
        ...state,
        faceCount: state.faceCount + 1,
        wearingMaskToday: temp,
        notWearingMaskToday: tempWithout,
        loading: false,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case MASKDETECTION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_MASKDETECTION:
      return {
        ...state,
        loading: false,
        error: {},
        wearingMaskToday: 0,
        notWearingMaskToday: 0,
        faceCount: 0,
      };
    default:
      return state;
  }
}
