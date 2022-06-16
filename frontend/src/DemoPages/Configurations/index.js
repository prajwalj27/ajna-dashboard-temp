import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../routing/privateRoute";
// SETTINGS

import Zones from "./zones/";
import Configure from "./Configuration/";
import SocialDistancing from "./socialDistancing/";
import VideoStream from "./videostream";
import PathTracking from "./pathTracking";
import ImageUpload from "./cameraConfig";
// import DeviceStream from "./deviceStream";
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
            path={`${match.url}/videoStream`}
            component={VideoStream}
          />
          <PrivateRoute
            exact
            path={`${match.url}/image-upload`}
            component={ImageUpload}
          />
          {/* <Route path={`${match.url}/addclient`} component={AddClient}/>*/}
          {/* <Route path={`${match.url}/device-stream`} component={DeviceStream} /> */}
          <PrivateRoute
            path={`${match.url}/social-distancing`}
            component={SocialDistancing}
          />
          <PrivateRoute path={`${match.url}/zones`} component={Zones} />
          <PrivateRoute
            path={`${match.url}/path-tracking`}
            component={PathTracking}
          />
          <PrivateRoute path={`${match.url}/all`} component={Configure} />
          {/* <Route path='*' exact={true} component={PageNotFound}/> */}
        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
