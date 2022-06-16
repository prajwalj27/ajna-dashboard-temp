import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoute from "../../routing/privateRoute";
// DASHBOARDS

// import AnalyticsDashboard from "./Analytics/";
// import SalesDashboard from "./Sales/";
// import CommerceDashboard from "./Commerce/";
// import CRMDashboard from "./CRM/";
// import MinimalDashboard1 from "./Minimal/Variation1";
// import MinimalDashboard2 from "./Minimal/Variation2";
import AdminHome from "./AdminHome/";
import AddClient from "./AddClient/";
import ClientRequests from "./RequestsFromClients";
// import MyAccount from "./MyAccount/";
// import AllNotification from "./AllNotifications/index";
// import Configuration from './Configuration/'
// import Settings from'./Settings'

// import PageNotFound from "../UserPages/NotFound";
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
          {/* <Router>
          <Switch> */}
          {/* <Route path={`${match.url}/home`} component={Home} /> */}
          {/* <Route
            path={`${match.url}/allnotification`}
            component={AllNotification}
          /> */}
          <Route path={`${match.url}/adminhome`} component={AdminHome} />
          <Route path={`${match.url}/addclient`} component={AddClient} />
          <Route
            path={`${match.url}/client-requests`}
            component={ClientRequests}
          />
          {/* <Route path={`${match.url}/myaccount`} component={MyAccount} /> */}
          {/* <Route  path={`${match.url}/configuration`} component={Configuration}/> */}

          {/* <Route path={`${match.url}/settings`} component={Settings}/> */}
          {/* <Route component={PageNotFound}/> */}
          {/* </Switch>
        </Router> */}
        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
