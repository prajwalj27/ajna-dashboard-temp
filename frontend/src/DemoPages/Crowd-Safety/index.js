import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// DASHBOARDS

import SocialDistancing from "./SocialDistancing/";
import ContactTracing from "./ContactTracing";
import CrowdDensityAnalytics from "./CrowdDensityAnalytics";
import MaskDetection from "./MaskDetection";
import RiskPrediction from "./RiskPrediction";
import SafetyReporting from "./SafetyReporting";


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
        <Route path={`${match.url}/social-distancing`} component={SocialDistancing}/>
        <Route path={`${match.url}/contact-tracing`} component={ContactTracing}/>
        <Route path={`${match.url}/mask-detection`} component={MaskDetection}/>
        <Route path={`${match.url}/crowd-density`} component={CrowdDensityAnalytics}/>
        <Route path={`${match.url}/safety-reporting`} component={SafetyReporting}/>
        <Route path={`${match.url}/risk-prediction`} component={RiskPrediction}/>

        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
