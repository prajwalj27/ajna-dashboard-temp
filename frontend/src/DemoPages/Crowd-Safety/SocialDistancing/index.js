import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
import PropTypes, { number } from "prop-types";
import htmlToImage from "html-to-image";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
import { DownloadOutlined } from "@ant-design/icons";
import Chart from "react-google-charts";
import io from "socket.io-client";
import Copied from "./PdfFile";
import {
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  CardHeader,
} from "reactstrap";
import {
  Table,
  Space,
  Spin,
  DatePicker,
  Select,
  Menu,
  Dropdown,
  Tooltip,
} from "antd";
import Circle from "react-circle";
import { InfoCircleOutlined } from "@ant-design/icons";
import Loader from "react-loaders";
import CsvDownload from "react-json-to-csv";
import moment from "moment";
import ZonesChart from "./ZonesChart";
import {
  getSocialDistancingCount,
  getSocialDistancingTodayData,
  pusherSocial,
} from "../../../actions/socialDistancing.actions";
import {
  getFootfallAnalysisTodayData,
  getFootfallAllData,
} from "../../../actions/footfallAnalysis.actions";
const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
let dataValues = [];
const { Option } = Select;

class SocialDistancing extends Component {
  state = {
    data: [],
    alertMessage: "",
    localClientId: "",
    localBranchId: "",
    userType: this.props.auth.user.userType,
    noOfClientZone: 0,
    todayZoneBasedResults: [],
    todayTotalCount: 0,
    todayCurrentCount: 0,
    tableValues: [],
    WeeklyZoneBasedResults: [],
    allData: [],
    totalCount: 0,
    modal: false,
    loading: true,
    spinner: false,
    pdfLoader: false,
    url: "",
    dates: [],
    cameras: [],
    branches: [],
    branch: "",
    camera: "",
    length: 0,
    dateSelectedGraph: [],
  };

  cameraHandleChange = async (value) => {
    const { user } = this.props.auth;
    await this.setState({ camera: value });
    if (!this.state.camera.length) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
    {
      if (user && (user.userType === "client" || user.userType === "admin")) {
        let tempCameraArr = [];
        this.props.getSocialDistancingCount(
          this.state.localBranchId,
          this.state.camera,
          this.state.userType
        );
        this.props.getSocialDistancingTodayData(
          this.state.localBranchId,
          this.state.camera,
          this.state.userType
        );
        this.getsocialDistancingData(this.state.localBranchId);
        this.getTodayZoneBasedData(this.state.localBranchId);
      } else {
        this.props.getSocialDistancingCount(
          this.state.localClientId,
          this.state.camera,
          this.state.userType
        );
        this.props.getSocialDistancingTodayData(
          this.state.localClientId,
          this.state.camera,
          this.state.userType
        );
        this.getsocialDistancingData(this.state.localClientId);
        this.getTodayZoneBasedData(this.state.localClientId);
      }
    }
  };

  branchHandleChange = async (value) => {
    await this.setState({ localBranchId: value });
    this.props.getSocialDistancingTodayData(
      value,
      this.state.camera,
      this.state.userType
    );
    this.props.getSocialDistancingCount(
      value,
      this.state.camera,
      this.state.userType
    );
    this.getTodayZoneBasedData(value);
    // this.getWeeklyZoneBasedDate(value);
    this.getsocialDistancingData(value);
    this.setState({ dateSelectedGraph: [] });
  };
  getAllBranches = (id) => {
    axios
      .get(`${Config.hostName}/api/branch/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      })
      .then((res) => {
        this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  rangePicker = async (dates, dateStrings) => {
    const { user } = this.props.auth;
    this.setState({ pdfLoader: false });
    await this.setState({ dates: dates });
    if (this.props.auth && user && user.userType === "client") {
      this.getsocialDistancingData(this.state.localBranchId);
      this.onDateChange(this.state.localBranchId);
    } else {
      this.getsocialDistancingData(this.state.localClientId);
      this.onDateChange(this.state.localClientId);
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
  ReportHandling = () => {
    htmlToImage
      .toPng(document.getElementById("my-node"), { backgroundColor: "white" })
      .then((dataUrl) => {
        this.setState({ url: dataUrl, pdfLoader: !this.state.pdfLoader });
      });
  };
  onDateChange = async (id) => {
    try {
      await axios
        .post(
          `${Config.hostName}/api/social-distancing/dates/${id}/${this.state.userType}`,
          {
            dateObj: this.state.dates,
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
        .then(async (res) => {
          res.data.length && this.setState({ dateSelectedGraph: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
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
      localBranchId,
      localClientId,
      camera,
      cameras,
      userType,
    } = this.state;
    if (this.props.auth && user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          localClientId: user.clientId,
          cameras: user.camera,
          localBranchId: user.branchId,
          userType: user.userType,
        });
        if (!this.state.camera.length) {
          let userCameraArray = [];
          this.state.cameras.map((i) => {
            userCameraArray.push(i.cameraId);
          });
          await this.setState({ camera: userCameraArray });
        }
        this.props.getSocialDistancingTodayData(
          user.branchId,
          this.state.camera,
          user.userType
        );
        this.props.getSocialDistancingCount(
          user.branchId,
          this.state.camera,
          user.userType
        );
        this.getTodayZoneBasedData(user.branchId);
        this.getsocialDistancingData(user.branchId);
        this.getAllBranches(user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (user && user.userType === "user") {
      this.getUserBranchFromProps();
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
        // localBranchId: user.camera.length && user.camera[0].branchId,
      });
      this.noCameraAvail();
      if (!this.state.camera.length) {
        let userCameraArray = [];
        this.state.cameras.map((i) => {
          userCameraArray.push(i.cameraId);
        });
        await this.setState({ camera: userCameraArray });
      }
      this.props.getSocialDistancingTodayData(
        user.clientId,
        this.state.camera,
        userType
      );
      this.props.getSocialDistancingCount(
        user.clientId,
        this.state.camera,
        userType
      );
      this.getsocialDistancingData(user.clientId);
      this.getTodayZoneBasedData(user.clientId);
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
          cameras: this.props.admin.selectedClient.camera,
          localBranchId: this.props.admin.selectedClient.branchId,
          userType: this.props.admin.selectedClient.userType,
        });
        if (!this.state.camera.length) {
          let userCameraArray = [];
          this.state.cameras.map((i) => {
            userCameraArray.push(i.cameraId);
          });
          await this.setState({ camera: userCameraArray });
        }
        this.props.getSocialDistancingTodayData(
          this.props.admin.selectedClient.branchId,
          this.state.camera,
          this.state.userType
        );
        this.props.getSocialDistancingCount(
          this.props.admin.selectedClient.branchId,
          this.state.camera,
          this.state.userType
        );
        this.getTodayZoneBasedData(this.props.admin.selectedClient.branchId);
        this.getsocialDistancingData(this.props.admin.selectedClient.branchId);
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  showImage = async (image, index) => {
    this.setState({ spinner: true });
    try {
      await axios
        .get(`${Config.hostName}/api/social-distancing/img/${index._id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((res) => {
          this.setState({
            spinner: false,
            modalImage: res.data.Image,
            modal: !this.state.modal,
          });
        });
    } catch (err) {
      if (err.response) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => {
            toast.error(error.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          });
        }
      }
    }
  };
  async componentDidMount() {
    if (!this.state.camera) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
    var socket = io(`${Config.hostName}/api/socket`, {
      pingInterval: 60000,
      pingTimeout: 180000,
      cookie: false,
      origins: "*:*",
      transports: ["flashsocket", "polling", "websocket"],
      upgrade: false,
      reconnection: true,
    });
    socket.on("insertSocial", (data) => {
      this.PusherComponent(data);
    });
    socket.on("deleteSocial", (data) => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    socket.on("updateSocial", (data) => {});
  }
  tableData = (tableData) => {
    dataValues = [];
    tableData.map((i, index) => {
      let date = moment.parseZone(i.Timestamp);
      let format = date.format("LLL");
      i.Timestamp = format;
      let obj = Object.assign(i);
      obj.key = index + 1;
      dataValues.push(obj);
      this.state.cameras &&
        this.state.cameras.length &&
        this.state.cameras.map((obj) => {
          if (obj.cameraId === i.CameraID) {
            i.CameraID = obj.cameraName;
          }
        });
    });
    this.setState({ tableValues: dataValues });
  };
  getTodayZoneBasedData = async (id) => {
    if (!this.state.camera) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
    try {
      const { userType } = this.state;
      await axios
        .post(
          `${Config.hostName}/api/social-distancing/today/${id}/${userType}`,
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
            this.setState({ todayZoneBasedResults: res.data });
        });
    } catch (err) {
      if (err.response) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => {
            toast.error(error.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          });
        }
      }
    }
  };

  getsocialDistancingData = async (id) => {
    const { user } = this.props.auth;
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
          `${Config.hostName}/api/social-distancing/me/${id}/${user.userType}`,
          {
            dates: JSON.stringify(this.state.dates),
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
        .then(async (res) => {
          await this.setState({ allData: res.data });
          this.setState({ length: res.data.length });
          function dynamicsort(property, order) {
            var sort_order = 1;
            if (order === "desc") {
              sort_order = -1;
            }
            return function (a, b) {
              if (a[property] < b[property]) {
                return -1 * sort_order;
              } else if (a[property] > b[property]) {
                return 1 * sort_order;
              } else {
                return 0 * sort_order;
              }
            };
          }
          if (res.data.length) {
            var sorted = res.data.sort(dynamicsort("Timestamp", "desc"));
          } else {
            sorted = [];
          }
          // console.log("data", sorted);

          this.tableData(sorted);
        });
    } catch (err) {
      if (err.response) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => {
            toast.error(error.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          });
        }
      }
      // console.log("error contact", error);
    }
  };

  PusherComponent = (pusherData) => {
    const { user } = this.props.auth;
    if (pusherData && user.userType === "client") {
      if (pusherData.ClientID === this.state.localClientId) {
        this.props.pusherSocial(this.state.localClientId, pusherData);
        if (this.props.auth.user)
          toast.error(`Social Distancing Violate in Zone ${pusherData.Zone}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
      }
    } else if (pusherData && user.userType === "user") {
      let cameraIDs = [];
      this.state.cameras.length &&
        this.state.cameras.map((i) => {
          cameraIDs.push(i.cameraId);
        });
      if (
        this.state.localClientId === pusherData.ClientID &&
        cameraIDs.includes(pusherData.CameraID)
      ) {
        this.props.pusherSocial(this.state.localClientId, pusherData);
        toast.error(`Social Distancing Violate in Zone ${pusherData.Zone}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  async componentWillMount() {
    {
      this.props.auth.selectedCamera &&
        (await this.setState({ camera: this.props.auth.selectedCamera }));
    }
    setTimeout(() => this.setState({ loading: false }), 1500);
    await this.getId();
  }
  render() {
    const { cameras, branches, camera, branch, tableValues } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );
    const menu = (
      <Menu>
        <Menu.Item>
          <button
            onClick={this.ReportHandling}
            style={{
              backgroundColor: "white",
              border: "1px solid white",
              // padding: "1px 14px",
            }}
          >
            PDF
          </button>
        </Menu.Item>
        <Menu.Item>
          <CsvDownload
            className="pdf-csv-selection"
            data={this.state.tableValues}
            filename="SocialDistancing.csv"
            style={{
              backgroundColor: "white",
              border: "1px solid white",
              // padding: "1px 14px",
            }}
          >
            CSV
          </CsvDownload>
        </Menu.Item>
      </Menu>
    );
    dataValues = [];
    const { data, loading } = this.state;
    if (this.state.localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <div className="animated fadeIn">
          {this.state.alertMessage.length ? (
            <Alert color="danger">{this.state.alertMessage}</Alert>
          ) : null}

          <Row className="mb-3">
            <Col md="9" className="ml-3">
              <Row>
                <Tooltip
                  className="mt-3"
                  placement="topLeft"
                  title="Date Filter"
                >
                  <InfoCircleOutlined className="ml-1" />
                </Tooltip>{" "}
                <RangePicker onChange={this.rangePicker} format={dateFormat} />
                <>
                  <Tooltip
                    className="mt-3"
                    placement="topLeft"
                    title="Select Branch"
                  >
                    <InfoCircleOutlined className="ml-4" />
                  </Tooltip>{" "}
                  <Select
                    defaultValue="Select Branch"
                    value={this.state.localBranchId}
                    style={{ width: 120 }}
                    onChange={this.branchHandleChange}
                  >
                    {branches.map((i, index) => {
                      return (
                        <Option key={index} value={i.branchId}>
                          {i.branchName}
                        </Option>
                      );
                    })}
                  </Select>
                </>
                <Tooltip
                  className="mt-3"
                  placement="topLeft"
                  title="Select Camera"
                >
                  <InfoCircleOutlined className="ml-4" />
                </Tooltip>
                <Select
                  mode="multiple"
                  value={this.state.camera}
                  style={{ width: "40%" }}
                  onChange={this.cameraHandleChange}
                >
                  {filteredOptions.map((item, index) => (
                    <Select.Option key={index} value={`${item.cameraId}`}>
                      {`${item.cameraName}`}
                    </Select.Option>
                  ))}
                </Select>
              </Row>{" "}
            </Col>
            <Col>
              <Dropdown.Button
                className="ml-5"
                placement="bottomCenter"
                overlay={menu}
                icon={
                  <DownloadOutlined
                    style={{ fontSize: "20px", color: "#3ac47d" }}
                  />
                }
              >
                Download Report
              </Dropdown.Button>
            </Col>{" "}
          </Row>
          <div>
            {this.state.pdfLoader && (
              <Copied data={this.state.tableValues} url={this.state.url} />
            )}

            <div id="my-node">
              <Row>
                {!this.state.dates.length ? (
                  <Col md="6" lg="4">
                    <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-primary border-primary">
                      <div className="widget-chat-wrapper-outer">
                        <div className="widget-chart-content">
                          <div className="widget-title opacity-5 text-uppercase">
                            <Tooltip
                              placement="topLeft"
                              title="Number Of Person Currently Violate Social Distaning over Total Number of Person Available"
                            >
                              <InfoCircleOutlined className=" mr-1" />
                              Current Violation Index{" "}
                            </Tooltip>{" "}
                          </div>
                          <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div className="widget-chart-flex align-items-center">
                              <div>
                                <span className="opacity-10 text-success pr-2"></span>
                                {this.props.socialDistancing &&
                                  this.props.socialDistancing
                                    .CurrentViolationIndex}
                                <small className="opacity-5 pl-1">%</small>
                              </div>
                              <div className="widget-title ml-auto font-size-lg font-weight-normal text-muted">
                                <div className="ml-auto">
                                  <Circle
                                    animate={true} // Boolean: Animated/Static progress
                                    animationDuration="10s" // String: Length of animation
                                    responsive={false} // Boolean: Make SVG adapt to parent size
                                    size="56" // String: Defines the size of the circle.
                                    lineWidth="30" // String: Defines the thickness of the circle's stroke.
                                    progress={
                                      this.props.socialDistancing
                                        .CurrentViolationIndex
                                    } // String: Update to change the progress and percentage.
                                    progressColor="var(--danger)" // String: Color of "progress" portion of circle.
                                    bgColor="#ecedf0" // String: Color of "empty" portion of circle.
                                    textColor="#6b778c" // String: Color of percentage text color.
                                    textStyle={{
                                      fontSize: "6rem", // CSSProperties: Custom styling for percentage.
                                    }}
                                    percentSpacing={5} // Number: Adjust spacing of "%" symbol and number.
                                    roundedStroke={true} // Boolean: Rounded/Flat line ends
                                    showPercentage={true} // Boolean: Show/hide percentage.
                                    showPercentageSymbol={false} // Boolean: Show/hide only the "%" symbol.
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ) : null}
                {!this.state.dates.length ? (
                  <Col md="6" lg="4">
                    <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-danger">
                      <div className="widget-chat-wrapper-outer">
                        <div className="widget-chart-content">
                          <div className="widget-title opacity-5 text-uppercase">
                            <Tooltip
                              placement="topLeft"
                              title="Number Of Person today Violate Social Distancing over Total Number of Person"
                            >
                              <InfoCircleOutlined className=" mr-1" />
                              Today Violation Index
                            </Tooltip>{" "}
                          </div>
                          <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div className="widget-chart-flex align-items-center">
                              <div>
                                <span className="opacity-10 text-success pr-2"></span>
                                {this.props.socialDistancing &&
                                  this.props.socialDistancing
                                    .todayViolationIndex}
                                <small className="opacity-5 pl-1">%</small>
                              </div>
                              <div className="widget-title ml-auto font-size-lg font-weight-normal text-muted">
                                <div className="ml-auto">
                                  <Circle
                                    animate={true} // Boolean: Animated/Static progress
                                    animationDuration="10s" // String: Length of animation
                                    responsive={false} // Boolean: Make SVG adapt to parent size
                                    size="56" // String: Defines the size of the circle.
                                    lineWidth="30" // String: Defines the thickness of the circle's stroke.
                                    progress={
                                      this.props.socialDistancing
                                        .todayViolationIndex
                                    } // String: Update to change the progress and percentage.
                                    progressColor="var(--primary)" // String: Color of "progress" portion of circle.
                                    bgColor="#ecedf0" // String: Color of "empty" portion of circle.
                                    textColor="#6b778c" // String: Color of percentage text color.
                                    textStyle={{
                                      fontSize: "6rem", // CSSProperties: Custom styling for percentage.
                                    }}
                                    percentSpacing={5} // Number: Adjust spacing of "%" symbol and number.
                                    roundedStroke={true} // Boolean: Rounded/Flat line ends
                                    showPercentage={true} // Boolean: Show/hide percentage.
                                    showPercentageSymbol={false} // Boolean: Show/hide only the "%" symbol.
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ) : null}
                {
                  <Col md="6" lg="4">
                    <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-warning border-warning">
                      <div className="widget-chat-wrapper-outer">
                        <div className="widget-chart-content">
                          <div className="widget-title opacity-5 text-uppercase">
                            <Tooltip
                              placement="topLeft"
                              title="How many People Violate Social Distancing"
                            >
                              <InfoCircleOutlined className=" mr-1" />
                            </Tooltip>{" "}
                            {this.state.dates.length ? (
                              <> Total Violations</>
                            ) : (
                              <>Today's Total Violations</>
                            )}
                            {/* Today's Total Violations */}
                          </div>
                          <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div className="widget-chart-flex align-items-center">
                              <div>
                                <span className="opacity-10 text-success pr-2"></span>
                                {this.state.dates.length
                                  ? this.state.length
                                  : this.props.socialDistancing &&
                                    this.props.socialDistancing.violations}
                              </div>
                              <div className="widget-title ml-auto font-size-lg font-weight-normal text-muted">
                                <div className="ml-auto">
                                  <Circle
                                    animate={true} // Boolean: Animated/Static progress
                                    animationDuration="10s" // String: Length of animation
                                    responsive={false} // Boolean: Make SVG adapt to parent size
                                    size="56" // String: Defines the size of the circle.
                                    lineWidth="30" // String: Defines the thickness of the circle's stroke.
                                    progress={
                                      this.props.socialDistancing.violations
                                    } // String: Update to change the progress and percentage.
                                    progressColor="var(--success)" // String: Color of "progress" portion of circle.
                                    bgColor="#ecedf0" // String: Color of "empty" portion of circle.
                                    textColor="#6b778c" // String: Color of percentage text color.
                                    textStyle={{
                                      fontSize: "6rem", // CSSProperties: Custom styling for percentage.
                                    }}
                                    percentSpacing={5} // Number: Adjust spacing of "%" symbol and number.
                                    roundedStroke={true} // Boolean: Rounded/Flat line ends
                                    showPercentage={true} // Boolean: Show/hide percentage.
                                    showPercentageSymbol={false} // Boolean: Show/hide only the "%" symbol.
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                }
              </Row>
              <Row>
                <Col md="8" className="mr">
                  <div>
                    {this.state.todayZoneBasedResults.length ? (
                      <Card>
                        <CardHeader>
                          Today's Violation Index in Different Zones &nbsp;
                          <Tooltip
                            placement="topLeft"
                            title="Zones can be any specified area of Camera"
                          >
                            <InfoCircleOutlined className=" mr-1" />
                          </Tooltip>{" "}
                        </CardHeader>
                        <Chart
                          style={{ overflow: "hidden" }}
                          // width={'500px'}
                          height={"300px"}
                          chartType="BarChart"
                          loader={<div>Loading Chart</div>}
                          data={this.state.todayZoneBasedResults}
                          options={{
                            // title: "Today's Violation Index in Different Zones",
                            chartArea: { width: "70%" },
                            hAxis: {
                              title: "Violation Index",
                              minValue: 0,
                            },
                            vAxis: {
                              title: "Zones ",
                              subtitle: "something",
                            },
                          }}
                          // For tests
                          rootProps={{ "data-testid": "1" }}
                        />
                      </Card>
                    ) : (
                      <Alert>Today's Data need to be updated</Alert>
                    )}
                  </div>
                </Col>
                <Col md="4">
                  <Card>
                    <CardHeader>
                      Total Index VS Current Index &nbsp;
                      <Tooltip
                        placement="topLeft"
                        title="Daily Violations Comparison"
                      >
                        <InfoCircleOutlined className=" mr-1" />
                      </Tooltip>{" "}
                    </CardHeader>
                    <Chart
                      style={{ overflow: "hidden" }}
                      // width={'300px'}
                      height={"300px"}
                      chartType="PieChart"
                      loader={<div>Loading Chart</div>}
                      data={[
                        ["Total Violation Index", "Current Violation Index"],
                        [
                          "Total Violation Index",
                          this.props.socialDistancing.todayViolationIndex,
                        ],
                        [
                          "Current Violation Index",
                          this.props.socialDistancing.CurrentViolationIndex,
                        ],
                      ]}
                      options={{
                        // title:
                        // "Daily track (Total Violation Index VS Current Violation Index)",
                        pieHole: 0.5,
                      }}
                      rootProps={{ "data-testid": "3" }}
                    />
                  </Card>
                </Col>
              </Row>
              {this.state.dates.length ? (
                <Row className="mt-4">
                  <Col>
                    <div className="card ">
                      <div className="card-header">
                        <Row className="mt-2">
                          <Col>Number Of Violations in Different Zones</Col>
                        </Row>
                      </div>
                      {/* <Card > */}
                      <div className="card-body">
                        {this.state.dateSelectedGraph.length ? (
                          <Chart
                            style={{ overflow: "hidden" }}
                            // width={'1300px'}
                            height={350}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={this.state.dateSelectedGraph}
                            options={{
                              displayExactValues: true,
                              hAxis: {
                                // title: 'Total Population',
                                minValue: 1,
                              },
                              chart: {
                                // title: ' Number Of Person Visit in Different Zones',
                                // subtitle: 'in millions of dollars (USD)',
                              },
                            }}
                            rootProps={{ "data-testid": "3" }}
                          />
                        ) : null}
                      </div>
                    </div>
                    {/* </Card> */}
                  </Col>
                </Row>
              ) : null}
              {/* <Row className="mt-4">
              {this.state.WeeklyZoneBasedResults
                ? this.state.WeeklyZoneBasedResults.map((i, index) => {
                    return (
                      <div key={index} className="col mb-2">
                        <div className="card">
                          <ZonesChart
                            data={Object.values(i)}
                            title={Object.keys(i)}
                          />
                        </div>
                      </div>
                    );
                  })
                : null}
            </Row> */}
            </div>
            <Row className="mt-4">
              <Col>
                <Card>
                  <CardHeader>
                    <Tooltip
                      placement="topLeft"
                      title="Current and Violation indexes for Person and Contacted Person ID"
                    >
                      <InfoCircleOutlined className=" mr-1" />
                    </Tooltip>{" "}
                    Social Distancing{" "}
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="10"></Col>
                      <Col>
                        {this.state.spinner && <Spin size="large" />}
                      </Col>{" "}
                      <Col>
                        {this.props.socialDistancing && (
                          <Table dataSource={this.state.tableValues}>
                            <Column
                              title="Serial No."
                              dataIndex="key"
                              key="key"
                            />
                            {/* <Column
                              title="Client ID"
                              dataIndex="ClientID"
                              key="ClientID"
                            /> */}
                            <Column
                              title="Camera"
                              dataIndex="CameraID"
                              key="CameraID"
                            />
                            <Column
                              title="Date & Time"
                              dataIndex="Timestamp"
                              key="Timestamp"
                            />
                            <Column title="Zone" dataIndex="Zone" key="Zone" />
                            <Column
                              title="Person ID"
                              dataIndex="PersonID"
                              key="PersonID"
                            />
                            <Column
                              title="Contacted ID"
                              dataIndex="Contacted_PersonID"
                              key="Contacted_PersonID"
                            />
                            <Column
                              title="Current Index"
                              dataIndex="current_violation_index"
                              key="current_violation_index"
                            />
                            <Column
                              title="Violation Index"
                              dataIndex="today_violation_index"
                              key="today_violation_index"
                            />
                            <Column
                              title="Image"
                              dataIndex="Image"
                              key="Image"
                              render={(text, record) => (
                                <Space size="middle">
                                  <a
                                    className="text-primary"
                                    onClick={() => this.showImage(text, record)}
                                  >
                                    Show Image
                                  </a>
                                </Space>
                              )}
                            />
                          </Table>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Modal
              className="modal-lg"
              isOpen={this.state.modal}
              toggle={() => {
                this.setState({ modal: !this.state.modal });
              }}
            >
              <ModalBody>
                <img
                  top
                  width="100%"
                  height={500}
                  src={`data:image/jpeg;base64,${this.state.modalImage}`}
                  alt="image"
                ></img>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => {
                    this.setState({ modal: !this.state.modal });
                  }}
                >
                  Done
                </Button>
              </ModalFooter>
            </Modal>
          </div>
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
        </div>
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

SocialDistancing.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  getFootfallAnalysisTodayData: PropTypes.func.isRequired,
  getFootfallAllData: PropTypes.func.isRequired,
  footfall: PropTypes.object.isRequired,
  socialDistancing: PropTypes.object.isRequired,
  pusherSocial: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  footfall: state.footfall,
  socialDistancing: state.socialDistancing,
});
export default connect(mapStateToProps, {
  getFootfallAnalysisTodayData,
  getFootfallAllData,
  getSocialDistancingTodayData,
  getSocialDistancingCount,
  pusherSocial,
})(SocialDistancing);
