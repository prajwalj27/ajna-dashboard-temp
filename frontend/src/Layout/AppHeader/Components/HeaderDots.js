import React, { Fragment } from "react";
// import Pusher from "pusher-js";
import { connect } from "react-redux";
import PropTypes, { number } from "prop-types";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";
import Config from "../../../config/Config";
// import Ionicon from 'react-ionicons';
import {
  IoIosGrid,
  IoIosNotificationsOutline,
  IoIosAnalytics,
} from "react-icons/io";

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Nav,
  Col,
  Row,
  Button,
  NavItem,
  DropdownItem,
} from "reactstrap";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

import { faArrowLeft, faCog } from "@fortawesome/free-solid-svg-icons";

import CountUp from "react-countup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import bg4 from "../../../assets/utils/images/dropdown-header/abstract4.jpg";
import city2 from "../../../assets/utils/images/dropdown-header/city2.jpg";
import city3 from "../../../assets/utils/images/dropdown-header/city3.jpg";

import Flag from "react-flagkit";

import Tabs from "react-responsive-tabs";

// Dropdown Tabs Content
import ChatExample from "./TabsContent/ChatExample";
import TimelineEx from "./TabsContent/TimelineExample";
import SysErrEx from "./TabsContent/SystemExample";

const tabsContent = [
  {
    title: "Events",
    content: <ChatExample />,
  },
  {
    title: "System Errors",
    content: <TimelineEx />,
  },
  {
    title: "Notifications",
    content: <SysErrEx />,
  },
];

function getTabs() {
  return tabsContent.map((tab, index) => ({
    title: tab.title,
    getContent: () => tab.content,
    key: index,
  }));
}

class HeaderDots extends React.Component {
  // constructor(props) {
  // super(props);
  state = {
    active: false,
    dangerClassName: "",
  };
  // }
  componentDidMount() {
    const socket = io(`${Config.hostName}/api/socket`);
    socket.on("insertUser", (data) => {
      this.PusherComponent(data);
    });
    socket.on("deleteUser", (data) => {
      // console.log("deleteUser data", data);
    });
    socket.on("updateUser", (data) => {
      this.PusherComponent(data);
      // console.log("updateUser data", data);
    });
  }
  PusherComponent = (pusherData) => {
    //   Pusher.logToConsole = true;
    if (this.props.auth.user && this.props.auth.user.userType === "user") {
      // var pusher = new Pusher("dc326966c151350716ee", {
      //   cluster: "ap2",
      // });
      // var channel = pusher.subscribe("my-channel");
      // channel.bind("user", async (pusherData) => {
      if (pusherData) {
        if (pusherData.ClientID === this.props.auth.user.clientId) {
          this.setState({ dangerClassName: "badge-danger" });
          // console.log("new notifications added")
        }
      }
      // });
    }
  };
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    return (
      <Fragment>
        <div className="header-dots">
          {/* {this.PusherComponent()} */}
          {/* <UncontrolledDropdown>
            <DropdownToggle className="p-0 mr-2" color="link">
              <div className="icon-wrapper icon-wrapper-alt rounded-circle">
                <div className="icon-wrapper-bg bg-primary" />
                <IoIosGrid color="#3f6ad8" fontSize="23px" />
              </div>
            </DropdownToggle>
            <DropdownMenu right className="dropdown-menu-xl rm-pointers">
              <div className="dropdown-menu-header">
                <div className="dropdown-menu-header-inner bg-plum-plate">
                  <div className="menu-header-image"
                    style={{
                      backgroundImage: "url(" + bg4 + ")",
                    }}/>
                  <div className="menu-header-content text-white">
                    <h5 className="menu-header-title">Grid Dashboard</h5>
                    <h6 className="menu-header-subtitle">
                      Easy grid navigation inside dropdowns
                    </h6>
                  </div>
                </div>
              </div>
              <div className="grid-menu grid-menu-xl grid-menu-3col">
                <Row className="no-gutters">
                  <Col xl="4" sm="6">
                    <Button className="btn-icon-vertical btn-square btn-transition" outline color="link">
                      <i className="pe-7s-world icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3">  {" "} </i>
                      Automation
                    </Button>
                  </Col>
                  <Col xl="4" sm="6">
                    <Button className="btn-icon-vertical btn-square btn-transition" outline color="link">
                      <i className="pe-7s-piggy icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3">
                        {" "}
                      </i>
                      Reports
                    </Button>
                  </Col>
                  <Col xl="4" sm="6">
                    <Button className="btn-icon-vertical btn-square btn-transition" outline color="link">
                      <i className="pe-7s-config icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3"> {" "} </i>
                      Settings
                    </Button>
                  </Col>
                  <Col xl="4" sm="6">
                    <Button className="btn-icon-vertical btn-square btn-transition" outline color="link">
                      <i className="pe-7s-browser icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3"> {" "} </i>
                      Content
                    </Button>
                  </Col>
                  <Col xl="4" sm="6">
                    <Button className="btn-icon-vertical btn-square btn-transition" outline color="link">
                      <i className="pe-7s-hourglass icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3"> {" "} </i>
                      Activity
                    </Button>
                  </Col>
                  <Col xl="4" sm="6">
                    <Button className="btn-icon-vertical btn-square btn-transition" outline color="link">
                      <i className="pe-7s-world icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3"> {" "} </i>
                      Contacts
                    </Button>
                  </Col>
                </Row>
              </div>
              <Nav vertical>
                <NavItem className="nav-item-divider" />
                <NavItem className="nav-item-btn text-center">
                  <Button size="sm" className="btn-shadow" color="primary">
                    Follow-ups
                  </Button>
                </NavItem>
              </Nav>
            </DropdownMenu>
          </UncontrolledDropdown> */}
          <UncontrolledDropdown>
            <DropdownToggle
              className="p-0 mr-2"
              color="link"
              onClick={() => {
                this.setState({ dangerClassName: "" });
              }}
            >
              <div className="icon-wrapper icon-wrapper-alt rounded-circle">
                <div className="icon-wrapper-bg bg-danger" />
                <IoIosNotificationsOutline color="#d92550" fontSize="23px" />
                <div
                  className={`badge badge-dot badge-dot-sm ${this.state.dangerClassName}`}
                >
                  Notifications
                </div>
              </div>
            </DropdownToggle>
            <DropdownMenu right className="dropdown-menu-xl rm-pointers">
              <div className="dropdown-menu-header mb-0">
                <div className="dropdown-menu-header-inner bg-deep-blue">
                  <div
                    className="menu-header-image opacity-1"
                    style={{
                      backgroundImage: "url(" + city3 + ")",
                    }}
                  />
                  <div className="menu-header-content text-dark">
                    <h5 className="menu-header-title">Notifications</h5>
                    <h6 className="menu-header-subtitle">
                      {/* You have <b>21</b> unread messages */}
                    </h6>
                  </div>
                </div>
              </div>
              <Tabs
                tabsWrapperClass="body-tabs body-tabs-alt"
                transform={false}
                showInkBar={true}
                items={getTabs()}
              />
              <Nav vertical>
                <NavItem className="nav-item-divider" />
                <NavItem className="nav-item-btn text-center">
                  <a href="/#/dashboard/allnotification">
                    {" "}
                    <Button
                      size="sm"
                      className="btn-shadow btn-wide btn-pill"
                      color="focus"
                    >
                      View All Notification
                    </Button>
                  </a>
                </NavItem>
              </Nav>
            </DropdownMenu>
          </UncontrolledDropdown>
          {/* <UncontrolledDropdown>
            <DropdownToggle className="p-0 mr-2" color="link">
              <div className="icon-wrapper icon-wrapper-alt rounded-circle">
                <div className="icon-wrapper-bg bg-focus" />
                <div className="language-icon">
                  <Flag className="mr-3 opacity-8" country="DE" size="40" />
                </div>
              </div>
            </DropdownToggle>
            <DropdownMenu right className="rm-pointers">
              <div className="dropdown-menu-header">
                <div className="dropdown-menu-header-inner pt-4 pb-4 bg-focus">
                  <div className="menu-header-image opacity-05"
                    style={{
                      backgroundImage: "url(" + city2 + ")",
                    }}/>
                  <div className="menu-header-content text-center text-white">
                    <h6 className="menu-header-subtitle mt-0">
                      Choose Language
                    </h6>
                  </div>
                </div>
              </div>
              <DropdownItem header>Popular Languages</DropdownItem>
              <DropdownItem>
                <Flag className="mr-3 opacity-8" country="US" />
                USA
              </DropdownItem>
              <DropdownItem>
                <Flag className="mr-3 opacity-8" country="CH" />
                Switzerland
              </DropdownItem>
              <DropdownItem>
                <Flag className="mr-3 opacity-8" country="FR" />
                France
              </DropdownItem>
              <DropdownItem>
                <Flag className="mr-3 opacity-8" country="ES" />
                Spain
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem header>Others</DropdownItem>
              <DropdownItem active>
                <Flag className="mr-3 opacity-8" country="DE" />
                Germany
              </DropdownItem>
              <DropdownItem>
                <Flag className="mr-3 opacity-8" country="IT" />
                Italy
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
          {/* <UncontrolledDropdown>
            <DropdownToggle className="p-0" color="link">
              <div className="icon-wrapper icon-wrapper-alt rounded-circle">
                <div className="icon-wrapper-bg bg-success" />
                <IoIosAnalytics color="#3ac47d" fontSize="23px" />
              </div>
            </DropdownToggle>
            <DropdownMenu right className="dropdown-menu-xl rm-pointers">
              <div className="dropdown-menu-header">
                <div className="dropdown-menu-header-inner bg-premium-dark">
                  <div className="menu-header-image"
                    style={{
                      backgroundImage: "url(" + bg4 + ")",
                    }}/>
                  <div className="menu-header-content text-white">
                    <h5 className="menu-header-title">Users Online</h5>
                    <h6 className="menu-header-subtitle">
                      Recent Account Activity Overview
                    </h6>
                  </div>
                </div>
              </div>
              <div className="widget-chart">
                <div className="widget-chart-content">
                  <div className="icon-wrapper rounded-circle">
                    <div className="icon-wrapper-bg opacity-9 bg-focus" />
                    <i className="lnr-users text-white" />
                  </div>
                  <div className="widget-numbers">
                    <CountUp start={0} end={344} separator="" decimals={0} decimal=","
                      prefix="" useEasing={false} suffix= "k" duration="15"/>
                  </div>
                  <div className="widget-subheading pt-2">
                    Profile views since last login
                  </div>
                  <div className="widget-description text-danger">
                    <span className="pr-1">
                      <CountUp start={0} end={176} separator="," delay={2} decimals={0} decimal=","
                        useEasing={false} prefix="" suffix="%" duration="10"/>
                    </span>
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </div>
                </div>
                <div className="widget-chart-wrapper">
                  <ResponsiveContainer width="100%" aspect={3.0 / 1.0}>
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Area type="monotoneX" dataKey="uv" stroke="var(--warning)" fill="var(--warning)" fillOpacity=".5"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Nav vertical>
                <NavItem className="nav-item-divider mt-0"> </NavItem>
                <NavItem className="nav-item-btn text-center">
                  <Button size="sm" className="btn-shine btn-wide btn-pill" color="warning">
                    <FontAwesomeIcon className="mr-2" icon={faCog} spin fixedWidth={false}/>
                    Refresh List
                  </Button>
                </NavItem>
              </Nav>
            </DropdownMenu>
          </UncontrolledDropdown> */}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(HeaderDots);
