import {
    PDF_DWELL_TIME_ANALYSIS,
    LOADING,
    DWELL_TIME_ERROR,
    CLEAR_DWELL_TIME
  } from "../constants/actionTypes";
  import moment from 'moment'
  const initialState = {
    dwell_pdf_data: [],
    loading: true,
    error: {},
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case PDF_DWELL_TIME_ANALYSIS:
          console.log("Res",payload)
        return {
            ...state,
            dwell_pdf_data:payload,
            loading: false,
          };
          case LOADING:
            return {
            ...state,
            loading: true
            };
            case DWELL_TIME_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
              };
              case CLEAR_DWELL_TIME:
                  return {
                      ...state,
                      loading:false,
                      dwell_pdf_data:[]
                  }
        default:
        return state;
    }
  }
  