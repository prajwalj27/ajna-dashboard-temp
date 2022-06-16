import React, { Component, Fragment } from "react";
import classnames from "classnames";
import axios from "axios";
import Chart from "react-google-charts";
import Config from "../../../config/Config";
import {
  Row,
  Col,
  Input,
  Button,
  Nav,
  Container,
  Alert,
  CardBody,
  CardTitle,
  Card,
  CardHeader,
  NavLink,
  TabContent,
  TabPane,
  Progress,
  ButtonGroup,
  CardFooter,
  Table,
  Popover,
  PopoverBody,
} from "reactstrap";
import { BarChart, XAxis, CartesianGrid, YAxis, Legend, Bar } from "recharts";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Loader from "react-loaders";
import { getMaskDetectionTodayCount } from "../../../actions/maskDetection.actions";
import { getFootfallAnalysisTodayData } from "../../../actions/footfallAnalysis.actions";
import {
  getSocialDistancingCount,
  getSocialDistancingTodayData,
} from "../../../actions/socialDistancing.actions";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";

import PerfectScrollbar from "react-perfect-scrollbar";
import { HorizontalBar } from "react-chartjs-2";

import {
  faAngleUp,
  faDotCircle,
  faAngleDown,
  faArrowLeft,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

import CountUp from "react-countup";
class SafetReporting extends Component {
  state = {
    localId: "",
    todayZoneBasedResults: [],
    data: [],
    Rate_of_contact_spread: "",
    loading:true
  };
  componentDidMount() {
    this.getId();
    setTimeout(() => this.setState({ loading: false }), 1000);

  }
  // getTodayZoneBasedData = async (id) => {
  //   try {
  //     await axios
  //       .get(Config.hostName + `/api/footfall-analysis/today/` + id)
  //       .then((res) => {
  //         if (res.data.length > 1) console.log("today zone based", res.data);
  //         this.setState({ todayZoneBasedResults: res.data });
  //       });
  //   } catch (error) {
  //     console.log("error contact", error);
  //   }
  // };
  getSafetyReportingData = async (id) => {
    let localImageArray = [];
    try {
      await axios
        .get(Config.hostName + `/api/safety-reporting/me/` + id, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((res) => {
          console.log("safety", res.data);
          this.setState({ data: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };

  getId = () => {
    if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "user"
    ) {
      if (this.props.auth.user.clientId) {
        this.setState({ localId: this.props.auth.user.clientId });
        this.props.getMaskDetectionTodayCount(this.props.auth.user.clientId);
        this.props.getFootfallAnalysisTodayData(this.props.auth.user.clientId);
        this.props.getSocialDistancingTodayData(this.props.auth.user.clientId);
        this.props.getSocialDistancingCount(this.props.auth.user.clientId);
        this.getSafetyReportingData(this.props.auth.user.clientId);
        this.getTodayZoneBasedData(this.props.auth.user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        this.setState({ localId: this.props.admin.selectedClient.clientId });
        this.getSafetyReportingData(this.props.admin.selectedClient.clientId);
        // this.todayZoneBasedResults(this.props.admin.selectedClient.clientId);
        this.props.getMaskDetectionTodayCount(
          this.props.admin.selectedClient.clientId
        );
        this.props.getFootfallAnalysisTodayData(
          this.props.admin.selectedClient.clientId
        );
        this.props.getSocialDistancingTodayData(
          this.props.admin.selectedClient.clientId
        );
        this.props.getSocialDistancingCount(
          this.props.admin.selectedClient.clientId
        );
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };

  render() {
    const {loading}=this.state
    if (this.state.localId) {
      return (
        loading? <Loader type="line-scale-party" />:
        <Fragment>
          <Container fluid>
            <Row>
              <Col md="6" xl="6">
                <div className="card mb-3 widget-content bg-night-fade">
                  <div className="widget-content-wrapper text-white text-uppercase">
                    <div className="widget-content-left">
                      <div className="widget-heading">
                        Number Of Social Distancing Violations
                      </div>
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-white">
                        <CountUp
                          end={this.props.socialDistancing.violations}
                          duration="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="6" xl="6">
                <div className="card mb-3 widget-content bg-arielle-smile">
                  <div className="widget-content-wrapper text-white text-uppercase">
                    <div className="widget-content-left">
                      <div className="widget-heading">
                        Number Of Users Not Wearing Mask
                      </div>
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-white text-uppercase">
                        <CountUp
                          start={0}
                          end={this.props.maskDetection.notWearingMaskToday}
                          separator=""
                          decimals={0}
                          duration="20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="6" xl="6">
                <div className="card mb-3 widget-content bg-happy-green">
                  <div className="widget-content-wrapper text-white text-uppercase">
                    <div className="widget-content-left">
                      <div className="widget-heading">
                        Social Distancing Index
                      </div>
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-white">
                        <CountUp
                          start={0}
                          end={this.props.socialDistancing.todayViolationIndex}
                          separator=""
                          decimals={0}
                          duration="15"
                        />
                        <small className="opacity-5 text-white"> %</small>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {this.state.data.length ? (
                <Col md="6" xl="6">
                  <div className="card mb-3 widget-content bg-asteroid">
                    <div className="widget-content-wrapper text-white text-uppercase">
                      <div className="widget-content-left">
                        <div className="widget-heading">
                          Rate of Contact Spread
                        </div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-white">
                          <CountUp
                            start={0}
                            end={this.state.data[0].Rate_of_contact_spread}
                            separator=""
                            decimals={0}
                            duration="20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ) : null}
              {this.props.footfall ? (
                <Col md="6" xl="6">
                  <div className="card mb-3 widget-content bg-love-kiss">
                    <div className="widget-content-wrapper text-white text-uppercase">
                      <div className="widget-content-left">
                        <div className="widget-heading">Number of person visit today</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-white">
                          <CountUp
                            start={0}
                            end={this.props.footfall.todayTotalCount}
                            separator=""
                            decimals={0}
                            duration="20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ) : null}
              {this.props.footfall ? (
                <Col md="6" xl="6">
                  <div className="card mb-3 widget-content bg-mixed-hopes ">
                    <div className="widget-content-wrapper text-white text-uppercase">
                      <div className="widget-content-left">
                        <div className="widget-heading">Number Of prson currently available</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-white">
                          <CountUp
                            start={0}
                            end={this.props.footfall.todayCurrentCount}
                            separator=""
                            decimals={0}
                            duration="20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ) : null}
            </Row>
            <Row>
              <Col lg="4">
                <Card className="main-card mb-3">
                  <CardBody style={{ overflow: "hidden" }}>
                    <CardTitle>Face Detected </CardTitle>
                    <ResponsiveContainer width="90%" aspect={1.0 / 3.0}>
                      <div>
                        {this.state.todayZoneBasedResults.length ? (
                          <Chart
                            // width={365}
                            width={"100%"}
                            height={300}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                              ["With Mask", "Daily Update"],
                              [
                                "Person With Mask",
                                this.props.maskDetection.wearingMaskToday,
                              ],
                              [
                                "Person Without Mask",
                                this.props.maskDetection.notWearingMaskToday,
                              ],
                            ]}
                            options={{
                              chartArea: { width: "70%", height: "70%" },

                              colors: ["rgb(90,222,169)", "rgb(70,62,86)"],
                              // title: "With Mask Vs Without Mask",
                              pieHole: 0.4,
                            }}
                            rootProps={{ "data-testid": "3" }}
                          />
                        ) : null}
                      </div>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="8">
                <Card className="main-card mb-3">
                  <CardBody>
                    <CardTitle>Number of People Visit Today</CardTitle>
                    <ResponsiveContainer width="90%" aspect={1.0 / 3.0}>
                      <div>
                        {this.state.todayZoneBasedResults.length ? (
                          <Chart
                            // width={'500px'}
                            height={"300px"}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={this.state.todayZoneBasedResults}
                            options={{
                              // colors: ["#FB7A21","#ecedf0"],
                              colors: ["rgb(90,222,169)", "rgb(70,62,86)"],

                              // colors: ["rgb(90,222,169)","rgb(156,166,172)"],
                              title: "Today's Population in Different Zones",
                              chartArea: { width: "80%" },
                              hAxis: {
                                title: "Total Population",
                                minValue: 0,
                              },
                              vAxis: {
                                title: "Zones ",
                                subtitle: "",
                              },
                            }}
                            rootProps={{ "data-testid": "2" }}
                          />
                        ) : (
                          <Alert>Today's Data need to be updated</Alert>
                        )}
                      </div>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </Fragment>
      );
    } else {
      return (
        <Alert color="danger">
          Id Is not present Please Select a Client from Admin Dashboard{" "}
        </Alert>
      );
    }
  }
}

SafetReporting.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  footfall: PropTypes.object.isRequired,
  socialDistancing: PropTypes.object.isRequired,
  maskDetection: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  footfall: state.footfall,
  socialDistancing: state.socialDistancing,
  maskDetection: state.maskDetection,
});
export default connect(mapStateToProps, {
  getMaskDetectionTodayCount,
  getSocialDistancingCount,
  getFootfallAnalysisTodayData,
  getSocialDistancingTodayData,
})(SafetReporting);
