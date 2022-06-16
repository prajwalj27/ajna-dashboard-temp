import { Route, Redirect } from "react-router-dom";
import React, { Suspense, lazy, Fragment } from "react";
import Loader from "react-loaders";
import PrivateRoute from "../../routing/privateRoute";

import { ToastContainer } from "react-toastify";

const UserPages = lazy(() => import("../../DemoPages/UserPages"));
const Dashboards = lazy(() => import("../../DemoPages/Dashboards"));
const AdminDashboards = lazy(() => import("../../DemoPages/AdminDashboard"));
const ClientFeatures = lazy(() => import("../../DemoPages/ClientFeatures"));

const CrowdSafetyAnalytics = lazy(() => import("../../DemoPages/Crowd-Safety"));
const AutomatedQueueManagement = lazy(() =>
  import("../../DemoPages/AutomatedQueueManagement")
);
const RetailAnalytics = lazy(() => import("../../DemoPages/RetailAnalytics"));
const Settings = lazy(() => import("../../DemoPages/Settings"));
const Configurations = lazy(() => import("../../DemoPages/Configurations"));
const SiteReports = lazy(() => import("../../DemoPages/SiteReports"));
const AppMain = () => {
  return (
    <Fragment>
      {/* Pages */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <Route path="/pages" component={UserPages} />
      </Suspense>

      {/* Dashboards */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute path="/dashboard" component={Dashboards} />
      </Suspense>

      {/* Special Client Features*/}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute path="/features" component={ClientFeatures} />
      </Suspense>

      {/* Site Reports Features*/}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute path="/site-reports" component={SiteReports} />
      </Suspense>

      {/*Admin Dashboards */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute path="/admindashboard" component={AdminDashboards} />
      </Suspense>

      {/* Settings */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute path="/settings" component={Settings} />
      </Suspense>

      {/* Configurations */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute path="/configurations" component={Configurations} />
      </Suspense>

      {/* Crowd-Safety */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute path="/crowd-safety" component={CrowdSafetyAnalytics} />
      </Suspense>

      {/* Automated-Queue */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute
          path="/automated-queue"
          component={AutomatedQueueManagement}
        />
      </Suspense>

      {/* Retail-Analytics */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
            </div>
          </div>
        }
      >
        <PrivateRoute path="/retail-analytics" component={RetailAnalytics} />
      </Suspense>

      <Route exact path="/" render={() => <Redirect to="/pages/login" />} />
      <ToastContainer />
    </Fragment>
  );
};

export default AppMain;
