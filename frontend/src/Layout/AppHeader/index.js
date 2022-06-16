import React, { Fragment } from "react";
import cx from "classnames";

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import HeaderLogo from "../AppLogo";

import SearchBox from "./Components/SearchBox";
import MegaMenu from "./Components/MegaMenu";
import UserBox from "./Components/UserBox";
import HeaderRightDrawer from "./Components/HeaderRightDrawer";

import HeaderDots from "./Components/HeaderDots";

class Header extends React.Component {
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    let {
      headerBackgroundColor,
      enableMobileMenuSmall,
      enableHeaderShadow,
    } = this.props;
    const { user } = this.props.auth;
    return (
      <Fragment>
        <CSSTransitionGroup
          component="div"
          className={cx("app-header", headerBackgroundColor, {
            "header-shadow": enableHeaderShadow,
          })}
          transitionName="HeaderAnimation"
          transitionAppear={true}
          transitionAppearTimeout={1500}
          transitionEnter={false}
          transitionLeave={false}
        >
          <HeaderLogo />
          <div
            className={cx("app-header__content", {
              "header-mobile-open": enableMobileMenuSmall,
            })}
          >
            <div className="app-header-left">
              {this.props.auth.user &&
                this.props.auth.user.userType === "user" && (
                  <span>
                    {" "}
                    You are currently viewing
                    <strong>
                      <i>
                        <b>
                          {" "}
                          {this.props.auth &&
                          user &&
                          user.camera &&
                          user.camera.length
                            ? this.props.auth.user.camera[0].branchName
                            : null}
                        </b>{" "}
                      </i>
                    </strong>{" "}
                    Branch{" "}
                  </span>
                )}
              {this.props.auth.user &&
                this.props.auth.user.userType === "client" && (
                  <span>
                    {" "}
                    You are currently viewing
                    <strong>
                      <i>
                        <b>
                          {" "}
                          {this.props.auth && this.props.auth.user
                            ? this.props.auth.user.branchName
                            : null}
                        </b>{" "}
                      </i>
                    </strong>{" "}
                    Branch{" "}
                  </span>
                )}
              {this.props.auth.user &&
                this.props.auth.user.userType === "admin" &&
                (this.props.admin &&
                this.props.admin.selectedClient &&
                this.props.admin.selectedClient.branchId ? (
                  <span>
                    {" "}
                    You are currently viewing
                    <strong>
                      <i>
                        <b>
                          {" "}
                          {this.props.admin && this.props.admin.selectedClient
                            ? this.props.admin.selectedClient.branchName
                            : null}
                        </b>{" "}
                      </i>
                    </strong>{" "}
                    Branch of
                    <i>
                      <b>
                        {" "}
                        {this.props.admin && this.props.admin.selectedClient
                          ? this.props.admin.selectedClient.clientId
                          : null}
                      </b>{" "}
                    </i>
                    Client
                  </span>
                ) : (
                  <strong>You haven't Selected any client </strong>
                ))}
            </div>
            <div className="app-header-right">
              <HeaderDots />
              <UserBox />
              {/* <HeaderRightDrawer /> */}
            </div>
          </div>
        </CSSTransitionGroup>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
  closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
  headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
  enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
  auth: state.auth,
  admin: state.admin,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
