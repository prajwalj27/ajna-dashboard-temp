import {
  GET_FOOTFALL_TODAY_DATA,
  FOOTFALL_ERROR,
  CLEAR_FOOTFALL,
  LOADING,
  GET_FOOTFALL_ALL_DATA,
  FOOTFALLPUSHER,
} from "../constants/actionTypes";
import moment from "moment";
const initialState = {
  footfall_Today: [],
  loading: true,
  error: {},
  todayTotalCount: 0,
  todayCurrentCount: 0,
  totalCount: 0,
  footfall_AllData: [],
  totalTableData: [],
  averageDensity: 0,
  todayEachZoneCurrentCount: [],
  todayEachZoneTotalCount: [],
  totalDensityArr: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FOOTFALL_TODAY_DATA:
      let tempCurrent = 0,
        newArr = [],
        newTotalArr = [],
        newDensityArr = [],
        tempTotal = 0,
        density = 0,
        number = 1;
      for (let i = 0; i < payload.length; i++) {
        tempTotal += payload[i].Total_Person_Count;
        tempCurrent += payload[i].Current_Person_Count;
        density += payload[i].PercentValue;
        var key = `${payload[i].Zone}`,
          obj = {
            [key]: `${payload[i].Current_Person_Count}`,
          };
        newArr.push(obj);
        var keytotal = `${payload[i].Zone}`,
          objtotal = {
            [keytotal]: `${payload[i].Total_Person_Count}`,
          };
        newTotalArr.push(objtotal);
        var keydensity = `${payload[i].Zone}`,
          objdensity = {
            [keydensity]: `${payload[i].PercentValue}`,
          };
        newDensityArr.push(objdensity);
      }
      return {
        ...state,
        todayCurrentCount: tempCurrent,
        todayEachZoneTotalCount: newTotalArr,
        todayTotalCount: tempTotal,
        todayEachZoneCurrentCount: newArr,
        footfall_Today: payload,
        loading: false,
        averageDensity: parseInt(density / number),
        totalDensityArr: newDensityArr,
      };
    case GET_FOOTFALL_ALL_DATA:
      let totalCount = 0,
        dataValues = [];
      for (let i = 0; i < payload.length; i++) {
        totalCount += payload[i].Total_Person_Count;
      }
      let tableData = payload;
      state.footfall_Today.map((i) => {
        tableData.unshift(i);
      });
      tableData.map((i, index) => {
        let date = moment(i.Timestamp);
        let format = date.format("LLL");
        i.Timestamp = format;
        let obj = Object.assign(i);
        obj.key = index + 1;
        dataValues.push(obj);
      });
      return {
        ...state,
        footfall_AllData: payload,
        loading: false,
        totalCount: totalCount + state.todayTotalCount,
        totalTableData: dataValues,
      };

    case FOOTFALLPUSHER:
      // totalcount
      var arr = state.todayEachZoneTotalCount;
      let keyArr = [];
      arr.map((i) => {
        let key = Object.keys(i);
        keyArr.push(key[0]);
      });
      let brr = arr.filter((item) => Object.keys(item)[0] != payload.Zone);
      let keyzone = `${payload.Zone}`,
        objzone = { [keyzone]: `${payload.Total_Person_Count}` };
      brr.push(objzone);

      // Current count
      var arrCurrent = state.todayEachZoneCurrentCount;
      let keyArrCurrent = [];
      arrCurrent.map((i) => {
        let key = Object.keys(i);
        keyArrCurrent.push(key[0]);
      });
      let brrCurrent = arrCurrent.filter(
        (item) => Object.keys(item)[0] != payload.Zone
      );
      let keyCurrent = `${payload.Zone}`,
        objCurrent = { [keyCurrent]: `${payload.Current_Person_Count}` };
      brrCurrent.push(objCurrent);

      // density
      var arrDensity = state.totalDensityArr;
      let keyArrDensity = [];
      arrDensity.map((i) => {
        let key = Object.keys(i);
        keyArrDensity.push(key[0]);
      });
      let brrDensity = arrDensity.filter(
        (item) => Object.keys(item)[0] != payload.Zone
      );
      let keyDensity = `${payload.Zone}`,
        objDensity = { [keyDensity]: `${payload.PercentValue}` };
      brrDensity.push(objDensity);
      return {
        ...state,
        todayEachZoneTotalCount: brr,
        todayEachZoneCurrentCount: brrCurrent,
        totalDensityArr: brrDensity,
        tempTotal: payload.Total_Person_Count,
        tempCurrent: payload.Current_Person_Count,
        density: payload.PercentValue,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case FOOTFALL_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        footfall_Today: [],
      };
    case CLEAR_FOOTFALL:
      return {
        ...state,
        footfall_Today: [],
        loading: false,
        error: {},
        todayTotalCount: 0,
        todayCurrentCount: 0,
        totalCount: 0,
        footfall_AllData: [],
        totalTableData: [],
        todayEachZoneCurrentCount: [],
        todayEachZoneTotalCount: [],
        totalDensityArr: [],
      };
    default:
      return state;
  }
}
