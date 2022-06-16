import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoute from "../../routing/privateRoute";
// DASHBOARDS

import CreateBranch from "./CreateBranch/";
import CreateUser from "./CreateUser";
import ActiveUsers from "./ActiveUsers";
import Settings from "../Settings/AvailableBranches/";

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
          <PrivateRoute
            path={`${match.url}/create-user`}
            component={CreateUser}
          />

          <PrivateRoute
            path={`${match.url}/create-branch`}
            component={CreateBranch}
          />
          <PrivateRoute
            path={`${match.url}/active-user`}
            component={ActiveUsers}
          />
          <PrivateRoute path={`${match.url}/branches`} component={Settings} />
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
