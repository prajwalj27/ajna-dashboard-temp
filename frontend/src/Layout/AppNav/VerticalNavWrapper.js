import React, { Component, Fragment } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import MetisMenu from "react-metismenu";
import PropTypes from "prop-types";

import { setEnableMobileMenu } from "../../reducers/ThemeOptions";
import {
  MainNav,
  AdminNav,
  CrowdSafetyNav,
  QueueManagement,
  WidgetsNav,
  ChartsNav,
  ClientSpecialFeatures,
  RetailAnalytics,
  ReportsNav,
} from "./NavItems";
let userSidebar = [
  {
    icon: "pe-7s-home",
    label: "Home",
    to: "#/dashboard/home",
  },
];
// let defaultval={
class Nav extends Component {
  state = {
    RetailAnalytics,
    QueueManagement,
    CrowdSafetyNav,
  };

  toggleMobileSidebar = () => {
    let { enableMobileMenu, setEnableMobileMenu } = this.props;
    setEnableMobileMenu(!enableMobileMenu);
  };
  setSideBar = () => {
    const { user } = this.props.auth;
    if (
      this.props.auth &&
      user &&
      (user.userType === "user" || user.userType === "client")
    ) {
      userSidebar = [
        {
          icon: "pe-7s-home",
          label: "Home",
          to: "#/dashboard/home",
        },
      ];
      for (let i = 1; i < MainNav.length; i++) {
        var arr = MainNav[i].content.filter((j) => {
          return user.modules.indexOf(j.label) > -1;
        });
        MainNav[i].content = arr;
      }
    }
  };
  setRetailBar = () => {
    const { user } = this.props.auth;
    let filtered = RetailAnalytics.filter((i) => {
      return user.modules.indexOf(i.label) > -1;
    });
    this.setState({ RetailAnalytics: filtered });
  };
  setQueueBar = () => {
    let filtered = QueueManagement.filter((i) => {
      return this.props.auth.user.modules.indexOf(i.label) > -1;
    });
    this.setState({ QueueManagement: filtered });
  };
  setCrowdBar = () => {
    let filtered = CrowdSafetyNav.filter((i) => {
      return this.props.auth.user.modules.indexOf(i.label) > -1;
    });
    this.setState({ CrowdSafetyNav: filtered });
  };
  async componentWillMount() {
    const { user } = this.props.auth;
    user &&
      (user.userType === "client" || user.userType === "user") &&
      (await this.setRetailBar());
    user &&
      (user.userType === "client" || user.userType === "user") &&
      (await this.setCrowdBar());
    user &&
      (user.userType === "client" || user.userType === "user") &&
      (await this.setQueueBar());
    // await this.setSideBar()
  }
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { user } = this.props.auth;
    if (
      (this.props.auth && user && user.userType === "client") ||
      user.userType === "user"
    ) {
      return (
        <Fragment>
          <h5 className="app-sidebar__heading">Menu</h5>
          <MetisMenu
            content={MainNav}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          />

          <h5 className="app-sidebar__heading">Crowd Safety Intelligence</h5>
          <MetisMenu
            content={this.state.CrowdSafetyNav}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          />

          <h5 className="app-sidebar__heading">Retail Analytics</h5>
          <MetisMenu
            content={this.state.RetailAnalytics}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          />

          {/* <h5 className="app-sidebar__heading">Automated Queue Management</h5>
          <MetisMenu
            content={this.state.QueueManagement}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          /> */}
          {user.userType === "client" && (
            <>
              <h5 className="app-sidebar__heading">Features</h5>
              <MetisMenu
                content={ClientSpecialFeatures}
                onSelected={this.toggleMobileSidebar}
                activeLinkFromLocation
                className="vertical-nav-menu"
                iconNamePrefix=""
                classNameStateIcon="pe-7s-angle-down"
              />
            </>
          )}
          {user.userType === "client" && (
            <>
              <h5 className="app-sidebar__heading"> Reports</h5>
              <MetisMenu
                content={ReportsNav}
                onSelected={this.toggleMobileSidebar}
                activeLinkFromLocation
                className="vertical-nav-menu"
                iconNamePrefix=""
                classNameStateIcon="pe-7s-angle-down"
              />
            </>
          )}
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <h5 className="app-sidebar__heading">Menu</h5>
          <MetisMenu
            content={AdminNav}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          />
        </Fragment>
      );
    }
  }
  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}
const mapStateToProps = (state) => ({
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  auth: state.auth,
  client: state.client,
});

const mapDispatchToProps = (dispatch) => ({
  setEnableMobileMenu: (enable) => dispatch(setEnableMobileMenu(enable)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav));
