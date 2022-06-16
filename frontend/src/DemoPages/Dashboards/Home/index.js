import React, { Component, Fragment } from "react";
import classnames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Chart from "react-google-charts";
import Pusher from "pusher-js";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";
import Config from "../../../config/Config";
import {
  Row,
  Col,
  Container,
  Alert,
  CardBody,
  CardTitle,
  Card,
} from "reactstrap";
import { Select, Tooltip } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Loader from "react-loaders";
import {
  getMaskDetectionTodayCount,
  pusherMask,
} from "../../../actions/maskDetection.actions";
import { getFootfallAnalysisTodayData } from "../../../actions/footfallAnalysis.actions";
import {
  getSocialDistancingCount,
  getSocialDistancingTodayData,
} from "../../../actions/socialDistancing.actions";
import {
  getSelectedCameraData,
  userBranchIdmappedBranchName,
} from "../../../actions/user.actions";
import { ResponsiveContainer } from "recharts";
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  StoreHelpers,
} from "react-joyride";

import CountUp from "react-countup";
const { Option } = Select;
class Home extends Component {
  state = {
    _isMounted: false,
    localClientId: "",
    localBranchId: "",
    todayZoneBasedResults: [],
    data: [],
    userType: "",
    Rate_of_contact_spread: 0,
    cameras: [],
    camera: [],
    loading: true,
    steps: [
      {
        target: ".camera-step",
        content:
          "Here select Your camera to filter data for all modules having selected camera id!",
      },
      {
        target: ".face-detected-step",
        content: "Number of Person Wearing mask vs Not wearing mask!",
        placement: "bottom",
      },
      {
        target: ".person-visit-step",
        content: "Total Number of Person vs Currently Available!",
        placement: "bottom",
      },
      // {
      //   target: ".branch-step",
      //   content:
      //     "Only Master can view other client data by clicking on radio button!",
      // },
    ],
    run: false,
  };
  handleClickStart = (e) => {
    e.preventDefault();
    // console.log('checker',this.state.run)

    this.setState({
      run: true,
    });
  };
  startLine = () => {
    if (this.state.run) {
      return (
        <div
          style={{
            borderRadius: "10px",
            backgroundColor: "#ff0044",
            color: "white",
          }}
        >
          <p className="border-radius-3 ml-1 widget-heading text-white text-uppercase">
            Click here to start journey{" "}
          </p>
        </div>
      );
    }
  };
  handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      this.setState({ run: false });
    }

    // tslint:disable:no-console
    console.groupCollapsed(type);
    // console.log(data);
    console.groupEnd();
    // tslint:enable:no-console
  };
  PusherComponent = (pusherData) => {
    if (pusherData) {
      if (pusherData.ClientID === this.state.localClientId) {
        this.props.pusherMask(this.state.localClientId, pusherData);

        if (
          this.props.auth.user.alertConfig &&
          this.props.auth.user.alertConfig.crowdSafety.isMaskDetectionActive &&
          !pusherData.Mask_detected
        ) {
          const filteredObject = this.props.auth.user.camera.filter(
            (i) => i.cameraId === pusherData.CameraID
          );
          toast.error(
            `Person without mask Entered in ${filteredObject[0].cameraName}`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      }
    }
    // });
  };
  componentWillMount() {
    this.setState({ _isMounted: true });
  }
  componentWillUnmount() {
    this.setState({ _isMounted: false });
  }
  componentDidMount() {
    this.props.auth.user &&
      (this.props.auth.user.userType === "client" ||
        this.props.auth.user.userType === "user") &&
      this.getId();
    const socket = io(`${Config.hostName}/api/socket`, {
      pingInterval: 60000,
      pingTimeout: 180000,
      cookie: false,
      origins: "*:*",
      transports: ["flashsocket", "polling", "websocket"],
      upgrade: false,
      reconnection: true,
    });
    socket.on("insertMask", (data) => {});
    socket.on("deleteMask", (data) => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    socket.on("updateMask", (data) => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });

    setTimeout(() => this.setState({ loading: false }), 1000);
  }
  getTodayZoneBasedData = async (id) => {
    if (!this.state.camera) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
    try {
      await axios
        .post(
          `${Config.hostName}/api/footfall-analysis/today/${id}/${this.props.auth.user.userType}`,
          {
            camera: this.state.camera,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-auth-token": this.props.auth.token,
            },
          }
        )
        .then((res) => {
          if (res.data.length > 1)
            // console.log("today zone based", res.data);
            this.setState({ todayZoneBasedResults: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };
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
          this.setState({ data: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };

  getUserBranchFromProps = async () => {
    const { user } = this.props.auth;
    await this.setState({
      branches: user.camera,
      cameras: user.camera[0].cameras[0],
      localBranchId: user.camera[0].branchId,
    });
  };
  noCameraAvail = async () => {
    const { userType } = this.state;
    if (!this.state.camera.length) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
  };
  getId = async () => {
    const { user } = this.props.auth;
    const {
      cameras,
      userType,
      camera,
      localBranchId,
      localClientId,
    } = this.state;
    if (user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          localClientId: user.clientId,
          localBranchId: user.branchId,
          cameras: user.camera,
          userType: user.userType,
        });
        if (!this.state.camera.length) {
          let userCameraArray = [];
          this.state.cameras.map((i) => {
            userCameraArray.push(i.cameraId);
          });
          await this.setState({ camera: userCameraArray });
        }
        this.props.getMaskDetectionTodayCount(
          user.branchId,
          this.state.camera,
          this.state.userType
        );
        // this.props.getMaskDetectionTodayCount(this.props.auth.user.clientId);
        // this.props.getFootfallAnalysisTodayData(this.props.auth.user.clientId);
        this.props.getFootfallAnalysisTodayData(
          user.branchId,
          this.state.camera,
          user.userType
        );
        // this.props.getSocialDistancingTodayData(this.props.auth.user.clientId);
        this.props.getSocialDistancingTodayData(
          localBranchId,
          camera,
          userType
        );
        this.props.getSocialDistancingCount(
          user.branchId,
          this.state.camera,
          user.userType
        );
        // this.props.getSocialDistancingCount(this.props.auth.user.clientId);
        this.getSafetyReportingData(this.props.auth.user.clientId);
        this.getTodayZoneBasedData(this.state.localBranchId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "user"
    ) {
      this.getUserBranchFromProps();
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
      });
      await this.noCameraAvail();

      console.log("cmeras", cameras);
      await this.props.getFootfallAnalysisTodayData(
        this.state.localBranchId,
        this.state.camera,
        this.state.userType
      );
      // this.getBranchNames(this.props.auth.user.branches);

      this.getTodayZoneBasedData(this.props.auth.user.clientId);
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
        });
        this.getSafetyReportingData(this.props.admin.selectedClient.clientId);
        this.todayZoneBasedResults(this.props.admin.selectedClient.clientId);
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

  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    // console.log("camera status",value)
    this.props.getSelectedCameraData(value);
    this.props.auth.user.userType === "client"
      ? this.getTodayZoneBasedData(this.state.localBranchId)
      : this.getTodayZoneBasedData(this.state.localClientId);
  };
  render() {
    if (this.props.auth.user && this.props.auth.user.userType == "admin") {
      return <Redirect to={"/admindashboard/adminhome"} />;
    }
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { camera } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );
    const { loading, steps } = this.state;
    if (this.state.localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <Fragment>
          <Container fluid>
            <Row>
              <Col>
                <Tooltip
                  placement="topLeft"
                  title="Choose the camera You want to view"
                >
                  {/* <Select
                    mode="multiple"
                    value={this.state.camera}
                    style={{ width: "60%" }}
                    onChange={this.cameraHandleChange}
                  >
                    {filteredOptions.map((item, index) => (
                      <Select.Option key={index} value={`${item.cameraId}`}>
                        {`${item.cameraName}`}
                      </Select.Option>
                    ))}
                  </Select> */}
                  {/* <Select
                    className="ml-1 mb-4 camera-step"
                    defaultValue={
                      this.props.auth.selectedCamera
                        ? this.props.auth.selectedCamera
                        : "Camera : All"
                    }
                    style={{ width: 120 }}
                    onChange={this.cameraHandleChange}
                  >
                    {this.state.cameras.length &&
                      this.state.cameras.map((obj, index) => {
                        return (
                          <Option key={obj.cameraId} value={`${obj.cameraId}`}>
                            {obj.cameraName}
                          </Option>
                        );
                      })}
                    <Option value="">All</Option>
                  </Select> */}
                </Tooltip>
                <br />
                {/* <Col md={6}>{this.startLine()}</Col> */}
              </Col>
              {/* <Col>
                <button
                  className="mb-3"
                  onClick={this.handleClickStart}
                  style={{
                    backgroundColor: "#ff0044",
                    color: "white",
                    border: "none",
                    fontSize: "14px",
                    padding: "10px 22px",
                    cursor: "pointer",
                    borderRadius: "10px",
                  }}
                >
                  Take the tour
                </button>
                {this.state.run && (
                  <Joyride
                    callback={this.handleJoyrideCallback}
                    continuous={true}
                    showProgress={true}
                    // spotlightClicks= {true}
                    showSkipButton={true}
                    steps={steps}
                    disableCloseOnEsc={true}
                    run={this.state.run}
                    scrollToFirstStep={true}
                    styles={{
                      options: {
                        zIndex: 10000,
                      },
                    }}
                  />
                )}
              </Col> */}
            </Row>
            <Row>
              <Col md="4" xl="4">
                <div className="card mb-3 widget-content bg-night-fade ">
                  <div className="widget-content-wrapper text-white text-uppercase">
                    <div className="widget-content-left">
                      <div className="widget-heading">
                        <Tooltip
                          placement="topLeft"
                          title="Number of Persons who violate Social distancing"
                        >
                          <InfoCircleOutlined className=" mr-1" />
                        </Tooltip>{" "}
                        Social Distancing Violations
                      </div>
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-white">
                        <CountUp
                          start={0}
                          end={this.props.socialDistancing.violations}
                          duration="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="4" xl="4">
                <div className="card mb-3 widget-content bg-arielle-smile">
                  <div className="widget-content-wrapper text-white text-uppercase">
                    <div className="widget-content-left">
                      <div className="widget-heading">
                        <Tooltip
                          placement="topLeft"
                          title="Number of Persons entered without Mask"
                        >
                          <InfoCircleOutlined className=" mr-1" />
                        </Tooltip>{" "}
                        Person Without Mask
                      </div>
                      {/* <div className="widget-subheading">
                      Total Clients Profit
                    </div> */}
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-white text-uppercase">
                        <CountUp
                          start={0}
                          end={this.props.maskDetection.notWearingMaskToday}
                          separator=""
                          decimals={0}
                          duration="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="4" xl="4">
                <div className="card mb-3 widget-content bg-plum-plate ">
                  <div className="widget-content-wrapper text-white text-uppercase">
                    <div className="widget-content-left">
                      <div className="widget-heading">
                        <Tooltip
                          placement="topLeft"
                          title="Number Of Person violate Social Distancing over Total Number of Person"
                        >
                          <InfoCircleOutlined className=" mr-1" />
                        </Tooltip>{" "}
                        Social Distancing Index
                      </div>
                      {/* <div className="widget-subheading">People Interested</div> */}
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
                <Col md="4" xl="4">
                  <div className="card mb-3 widget-content bg-happy-green">
                    <div className="widget-content-wrapper text-white text-uppercase">
                      <div className="widget-content-left">
                        <div className="widget-heading">
                          <Tooltip
                            placement="topLeft"
                            title="Rate at which contact is spreading"
                          >
                            <InfoCircleOutlined className=" mr-1" />
                          </Tooltip>{" "}
                          Rate of Contact Spread
                        </div>
                        {/* <div className="widget-subheading">Revenue streams</div> */}
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
                <Col md="4" xl="4">
                  <div className="card mb-3 widget-content bg-love-kiss">
                    <div className="widget-content-wrapper text-white text-uppercase">
                      <div className="widget-content-left">
                        <div className="widget-heading">
                          <Tooltip
                            placement="topLeft"
                            title="Total Number of Person Visit"
                          >
                            <InfoCircleOutlined className=" mr-1" />
                          </Tooltip>{" "}
                          Person visit today
                        </div>
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
                <Col md="4" xl="4">
                  <div className="card mb-3 widget-content bg-mixed-hopes ">
                    <div className="widget-content-wrapper text-white text-uppercase">
                      <div className="widget-content-left">
                        <div className="widget-heading">
                          <Tooltip
                            placement="topLeft"
                            title="Number of Person Currently Available"
                          >
                            <InfoCircleOutlined className=" mr-1" />
                          </Tooltip>
                          Person currently available
                        </div>
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
                <Card className="main-card mb-3 face-detected-step">
                  <CardBody style={{ overflow: "hidden" }}>
                    <CardTitle>Face Detected </CardTitle>
                    <ResponsiveContainer width="90%" aspect={1.0 / 3.0}>
                      <div>
                        {/* {this.state.todayZoneBasedResults.length ? ( */}
                        <Chart
                          style={{ overflow: "hidden" }}
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
                          rootProps={{ "data-testid": "1" }}
                        />
                        {/* ) : null} */}
                      </div>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="8">
                <Card className="main-card mb-3 person-visit-step">
                  <CardBody>
                    <CardTitle>Number of People Visit Today</CardTitle>
                    <ResponsiveContainer width="90%" aspect={1.0 / 3.0}>
                      <div>
                        {this.state.todayZoneBasedResults.length ? (
                          <Chart
                            style={{ overflow: "hidden" }}
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
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
          </Container>
          {/* {this.props.auth.initialUser.isMaster ? (
            <Container className="branch-step">
              <Settings className="branch-step" />
            </Container>
          ) : null} */}
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

Home.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  footfall: PropTypes.object.isRequired,
  socialDistancing: PropTypes.object.isRequired,
  maskDetection: PropTypes.object.isRequired,
  getSelectedCameraData: PropTypes.func.isRequired,
  pusherMask: PropTypes.func.isRequired,
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
  getSelectedCameraData,
  pusherMask,
  userBranchIdmappedBranchName,
})(Home);
