import { combineReducers } from "redux";
import ThemeOptions from "./ThemeOptions";
import alertReducer from "./alert";
import clientReducer from "./client";
import adminReducer from "./admin";
import authReducer from "./auth";
import footfallReducer from "./footfallAnalysis";
import SocialDistancingReducer from "./socialDistancing";
import MaskDetectionReducer from "./maskDetection";
import dwellTimeAnalysisReducer from './dwellTimeAnalysis'
const reducer = combineReducers({
  ThemeOptions: ThemeOptions,
  auth: authReducer,
  alert: alertReducer,
  client: clientReducer,
  footfall: footfallReducer,
  admin: adminReducer,
  socialDistancing: SocialDistancingReducer,
  maskDetection: MaskDetectionReducer,
  dwellTimeAnalysis:dwellTimeAnalysisReducer
});
export default reducer;
