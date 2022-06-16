import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../routing/privateRoute";

// DASHBOARDS
import General from "./General";
import Menu from "./Menu";
import Comparison from "./Comparison/";
// import MonthlyPathTracking from "./PathTracking/MonthlyTracking";

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
            path={`${match.url}/weekly`}
            component={Comparison}
          />
          <PrivateRoute exact path={`${match.url}/reports`} component={Menu} />
          <PrivateRoute exact path={`${match.url}/daily`} component={General} />
        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
