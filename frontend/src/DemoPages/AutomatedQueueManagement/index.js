import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// DASHBOARDS

import QueueLengthDetection from "./QueueLengthDetection/";
import WaitingTimeAnalysis from "./WaitingTimeAnalysis/";
import DwellTimeAnalysis from "./DwellTimeAnalysis/";
import QueueLengthPrediction from "./QueueLengthPrediction/";
import SocialDistancingAlert from "./SocialDistancingAlert/";
import QueueProcessingSpeed from "./QueueProcessingSpeed";


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
        <Route path={`${match.url}/queue-length-detection`} component={QueueLengthDetection}/>
        <Route path={`${match.url}/waiting-time-analysis`} component={WaitingTimeAnalysis}/>
        <Route path={`${match.url}/dwell-time-analysis`} component={DwellTimeAnalysis}/>
        <Route path={`${match.url}/queue-length-prediction`} component={QueueLengthPrediction}/>
        <Route path={`${match.url}/social-distacing-alert`} component={SocialDistancingAlert}/>
        <Route path={`${match.url}/queue-processing-speed`} component={QueueProcessingSpeed}/>
        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
