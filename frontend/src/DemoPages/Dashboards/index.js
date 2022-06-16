import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoute from "../../routing/privateRoute";
// DASHBOARDS

import Home from "./Home";
// import AdminHome from "../AdminDashboard/AdminHome";
// import AddClient from "../AdminDashboard/AddClient";
import ChangePassword from "./ChangePassword/";
import MyAccount from "./MyAccount/";
import AllNotification from "./AllNotifications/index";
// import Configuration from './Configuration/'
// import Settings from'./Settings'

import PageNotFound from "../UserPages/NotFound";
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
          <PrivateRoute path={`${match.url}/home`} component={Home} />
          <PrivateRoute
            path={`${match.url}/allnotification`}
            component={AllNotification}
          />
          {/* <Route path={`${match.url}/adminhome`} component={AdminHome} /> */}
          {/* <Route path={`${match.url}/addclient`} component={AddClient} /> */}
          <PrivateRoute
            path={`${match.url}/changePassword`}
            component={ChangePassword}
          />
          <PrivateRoute path={`${match.url}/myaccount`} component={MyAccount} />
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
