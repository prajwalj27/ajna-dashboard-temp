import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    LOADING
  } from "../constants/actionTypes";
  
  const initialState = {
    profile: null,
    loading: true,
    error: {}
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_PROFILE:
        return {
            ...state,
            profile: payload,
            loading: false
          };
      case LOADING:
        return {
          ...state,
          loading: true
        };
      case PROFILE_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
          profile: null
        };
      case CLEAR_PROFILE:
        return {
          ...state,
          profile: null,
          profiles: [],
          repos: [],
          loading: false
        };
      default:
        return state;
    }
  }
  