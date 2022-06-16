import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../routing/privateRoute";

// DASHBOARDS

// import DwellTimeAnalysis from "./DwellTimeAnalysis";
import DwellTimeAnalysis from "./DwellTimeAnalysis/";
import DwellZone from "./DwellZone";
import FaceDetection from "./FaceDetection";
import HeatMapAnalysis from "./HeatMapAnalysis";
import FootfallAnalysis from "./footfallAnalytics";
// import FootfallAnalysis from "./footfallAnalytics";
import PathTracking from "./PathTracking";
// import MonthlyHeatmap from "./HeatMapAnalysis/testMonthly";
import MonthlyHeatmap from "./HeatMapAnalysis/MonthlyHeatmap";
import MonthlyPathTracking from "./PathTracking/MonthlyTracking";

// Layout

import AppHeader from "../../Layout/AppHeader/";
import AppSidebar from "../../Layout/AppSidebar/";
import AppFooter from "../../Layout/AppFooter/";

// Theme Options
import ThemeOptions from "../../Layout/ThemeOptions/";

const Dashboards = ({ match }) => (
  <Fragment>
    <ThemeOptions />
    <AppHeader />
    <div className="app-main">
      <AppSidebar />
      <div className="app-main__outer">
        <div className="app-main__inner">
          <PrivateRoute
            exact
            path={`${match.url}/dwell-time-analysis`}
            component={DwellTimeAnalysis}
          />
          <PrivateRoute
            exact
            path={`${match.url}/dwell-zone`}
            component={DwellZone}
          />
          <PrivateRoute
            exact
            path={`${match.url}/face-detection`}
            component={FaceDetection}
          />
          <PrivateRoute
            exact
            path={`${match.url}/heatmap-analysis`}
            component={HeatMapAnalysis}
          />
          <PrivateRoute
            exact
            path={`${match.url}/heatmap-analysis/:c_id`}
            component={MonthlyHeatmap}
          />
          <PrivateRoute
            exact
            path={`${match.url}/footfall-analysis`}
            component={FootfallAnalysis}
          />
          <PrivateRoute
            exact
            path={`${match.url}/path-tracking`}
            component={PathTracking}
          />
          <PrivateRoute
            exact
            path={`${match.url}/path-tracking/:c_id`}
            component={MonthlyPathTracking}
          />
        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
