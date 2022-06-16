import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// SETTINGS


import Settings from'./Settings'
import ShowStatus from './ShowStatus'

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
        {/* <Route path={`${match.url}/home`} component={Home}/>
        <Route path={`${match.url}/adminhome`} component={AdminHome}/>
        <Route path={`${match.url}/addclient`} component={AddClient}/>
        <Route path={`${match.url}/changePassword`} component={ChangePassword}/>
        <Route path={`${match.url}/myaccount`} component={MyAccount}/> */}
        {/* <Route path={`${match.url}/available-clients`} component={AvailableClient}/> */}
        <Route path={`${match.url}/all`} component={Settings}/>
        {/* <Route path='*' exact={true} component={PageNotFound}/> */}
        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
