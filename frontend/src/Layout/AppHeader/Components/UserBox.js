import React, { Fragment } from "react";

// import Ionicon from 'react-ionicons';

import { IoIosCalendar } from "react-icons/io";
import { connect } from "react-redux";
import Alert from "../../../layouts/Alert";
import { logout } from "../../../actions/user.actions";
import { setAlert } from "../../../actions/alert.actions";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";

import {
  DropdownToggle,
  DropdownMenu,
  Nav,
  Col,
  Row,
  Button,
  NavItem,
  NavLink,
  UncontrolledTooltip,
  UncontrolledButtonDropdown,
} from "reactstrap";

import { toast, Bounce } from "react-toastify";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import city3 from "../../../assets/utils/images/dropdown-header/city3.jpg";
import avatar1 from "../../../assets/utils/images/avatars/user.png";

class UserBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      _idMounted: false,
    };
  }
  componentWillMount() {
    this.setState({ _isMounted: true });
  }
  componentWillUnmount() {
    this.setState({ _isMounted: false });
  }
  notify2 = () =>
    (this.toastId = toast(
      "You don't have any new items in your calendar for today! Go out and play!",
      {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: "bottom-center",
        type: "success",
      }
    ));

  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    return (
      <Fragment>
        <div className="header-btn-lg pr-0">
          <div className="widget-content p-0">
            <div className="widget-content-wrapper">
              <div className="widget-content-left">
                <UncontrolledButtonDropdown>
                  <DropdownToggle color="link" className="p-0">
                    <img
                      width={42}
                      className="rounded-circle"
                      src={avatar1}
                      alt=""
                    />
                    <FontAwesomeIcon
                      className="ml-1 opacity-8"
                      icon={faAngleDown}
                    />
                  </DropdownToggle>
                  <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                    <div className="dropdown-menu-header">
                      <div className="dropdown-menu-header-inner bg-info">
                        <div
                          className="menu-header-image opacity-2"
                          style={{
                            backgroundImage: "url(" + city3 + ")",
                          }}
                        />
                        <div className="menu-header-content text-left">
                          <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                              <div className="widget-content-left mr-3">
                                <img
                                  width={42}
                                  className="rounded-circle"
                                  src={avatar1}
                                  alt=""
                                />
                              </div>
                              <div className="widget-content-left">
                                <div className="widget-heading">
                                  {this.props.auth &&
                                  this.props.auth.user &&
                                  this.props.auth.user.userType === "admin" ? (
                                    "Admin Account"
                                  ) : this.props.auth.user.userType ===
                                    "user" ? (
                                    this.props.auth.user.name
                                  ) : this.props.client.profile ? (
                                    this.props.client.profile.name
                                  ) : (
                                    <>Client</>
                                  )}
                                </div>
                                <div className="widget-subheading opacity-8">
                                  {/* {this.props.client.profile
                                    ? this.props.client.profile.description
                                    : null} */}
                                </div>
                              </div>
                              <div className="widget-content-right mr-2">
                                <Button
                                  className="btn-pill btn-shadow btn-shine"
                                  color="focus"
                                  onClick={(e) => this.props.logout(e)}
                                >
                                  Logout
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="scroll-area-xs"
                      style={{
                        height: "190px",
                      }}
                    >
                      <PerfectScrollbar>
                        <Nav vertical>
                          <NavItem className="nav-item-header">
                            Activity
                          </NavItem>
                          {/* <NavItem>
                            <NavLink href="#">
                              Chat
                              <div className="ml-auto badge badge-pill badge-info">
                                8
                              </div>
                            </NavLink>
                          </NavItem> */}
                          <NavItem>
                            <NavLink href="/#/dashboard/changePassword">
                              Change Password
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink href="/#/dashboard/myaccount">
                              {" "}
                              My Account
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink href="/#/settings/all">
                              {/* <NavLink href="/#/dashboard/settings"> */}
                              Settings
                              <div className="ml-auto badge badge-success">
                                New
                              </div>
                            </NavLink>
                          </NavItem>

                          {(this.props.auth.user &&
                            this.props.auth.user.userType === "client") ||
                          (this.props.auth.user &&
                            this.props.auth.user.userType == "user" &&
                            this.props.auth.user.editAccess.length) ? (
                            <NavItem>
                              <NavLink href="/#/configurations/all">
                                Configurations
                                <div className="ml-auto badge badge-warning">
                                  zones
                                </div>
                              </NavLink>
                            </NavItem>
                          ) : (
                            <NavItem>
                              {/* <NavLink href="/#/configurations/all">
                                Configurations
                                <div className="ml-auto badge badge-warning">
                                  zones
                                </div>
                              </NavLink> */}
                            </NavItem>
                          )}
                          {/* <NavItem>
                            <NavLink href="#">Logs</NavLink>
                          </NavItem> */}
                        </Nav>
                      </PerfectScrollbar>
                    </div>
                    <Nav vertical>
                      <NavItem className="nav-item-divider mb-0" />
                    </Nav>
                    <div className="grid-menu grid-menu-2col">
                      {/* <Row className="no-gutters">
                        <Col sm="6">
                          <Button className="btn-icon-vertical btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="warning">
                            <i className="pe-7s-chat icon-gradient bg-amy-crisp btn-icon-wrapper mb-2"> {" "} </i>
                            Message Inbox
                          </Button>
                        </Col>
                        <Col sm="6">
                          <Button className="btn-icon-vertical btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="danger">
                            <i className="pe-7s-ticket icon-gradient bg-love-kiss btn-icon-wrapper mb-2"> {" "} </i>
                            <b>Support Tickets</b>
                          </Button>
                        </Col>
                      </Row> */}
                    </div>
                    {/* <Nav vertical>
                      <NavItem className="nav-item-divider" />
                      <NavItem className="nav-item-btn text-center">
                        <Button size="sm" className="btn-wide" color="primary">
                          Open Messages
                        </Button>
                      </NavItem>
                    </Nav> */}
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
              <div className="widget-content-left  ml-3 header-user-info">
                {/* <div className="widget-heading">Alina Mclourd</div> */}
                {/* <div className="widget-subheading">VP People Manager</div> */}
              </div>
              {/* <div className="widget-content-right header-user-info ml-3">
                <Button className="btn-shadow p-1" size="sm" onClick={this.notify2} color="info" id="Tooltip-1">
                  <IoIosCalendar color="#ffffff" fontSize="20px" />
                </Button>
                <UncontrolledTooltip placement="bottom" target={"Tooltip-1"}>
                  Click for Toastify Notifications!
                </UncontrolledTooltip>
              </div> */}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

UserBox.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
});
export default connect(mapStateToProps, { logout })(UserBox);

// export default UserBox;
