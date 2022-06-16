import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Chart from "react-google-charts";
import io from "socket.io-client";
// import { saveAs } from "file-saver";
import { Row, Col, Card, CardBody, Alert, CardHeader } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import Img from "../../../images/logo.png";
import {
  Table,
  DatePicker,
  Select,
  Dropdown,
  Menu,
  Tag,
  Tooltip,
  TreeSelect,
  Switch,
  Pagination,
  Button,
  Spin,
} from "antd";
import Circle from "react-circle";
import Loader from "react-loaders";
import CsvDownload from "react-json-to-csv";
import htmlToImage from "html-to-image";
import {
  InfoCircleOutlined,
  RightOutlined,
  LoadingOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import Copied from "./PdfFile";
import moment from "moment";
import ZonesChart from "./ZonesChart";
import {
  getFootfallAnalysisTodayData,
  getFootfallAllData,
  pusherFootfall,
} from "../../../actions/footfallAnalysis.actions";
import { showNotifications } from "../../../actions/notification.action";
import { DownloadOutlined } from "@ant-design/icons";
const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const { Option } = Select;
var sum = 0;
const { TreeNode } = TreeSelect;
let allCameras = [];
let dataValues = [],
  averageNumber = 0;
class FootfallAnalysis extends Component {
  state = {
    data: [],
    alertMessage: "",
    localClientId: "",
    localBranchId: "",
    allCameras: [],
    userType: this.props.auth.user.userType,
    noOfClientZone: 0,
    todayZoneBasedResults: [],
    todayTotalCount: 0,
    todayCurrentCount: 0,
    tableValues: [],
    WeeklyZoneBasedResults: [],
    allData: [],
    totalCount: 0,
    loading: true,
    url: {},
    pdfLoader: false,
    dates: [],
    topUrl: "",
    cameras: [],
    branches: [],
    camera: [],
    branch: "",
    barChart: false,
    dateSelectedGraph: [
      ["Month Wise Analysis", "zones"],
      ["1", 0],
      ["2", 0],
      ["3", 0],
      ["4", 0],
      ["5", 0],
      ["6", 0],
      ["7", 0],
      ["8", 0],
      ["9", 0],
      ["10", 0],
      ["11", 0],
      ["12", 0],
    ],
    selectionCount: 0,
    selectionDensity: 0,
    pageNumber: 0,
    NumberOfPages: 0,
    pdfData: [],
    pdfLoading: false,
  };
  goToPrevious = () => {
    const { pageNumber } = this.state;
    this.setState({ pageNumber: Math.max(0, pageNumber - 1) });
  };
  goToNext = () => {
    const { pageNumber, NumberOfPages } = this.state;
    this.setState({ pageNumber: Math.min(NumberOfPages - 1, pageNumber + 1) });
  };
  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    this.getFootfallAnalysisData(this.state.localBranchId);
    this.getWeeklyZoneBasedDate(this.state.localBranchId);
    await this.getTodayZoneBasedData(this.state.localBranchId);

    this.noCameraAvail();
    this.props.getFootfallAnalysisTodayData(
      this.state.localBranchId,
      value,
      this.state.userType
    );
  };
  onBranchChangeCamerasChange = async (id) => {
    axios
      .get(`${Config.hostName}/api/branch/getcamera/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      })
      .then(async (res) => {
        if (res.data.length)
          await this.setState({ cameras: res.data[0].camera, camera: [] });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  branchHandleChange = async (value) => {
    const { user } = this.props.auth;
    await this.setState({ branch: value, localBranchId: value });
    if (user.userType == "client") {
      await this.onBranchChangeCamerasChange(value);
    } else if (user.userType == "user") {
      user.camera.map((item) => {
        if (item.branchId == value) {
          this.setState({ cameras: item.cameras[0], camera: [] });
        }
      });
    }
    await this.getFootfallAnalysisData(value);
    await this.getWeeklyZoneBasedDate(value);
    await this.getTodayZoneBasedData(value);
    this.noCameraAvail();

    await this.props.getFootfallAnalysisTodayData(
      value,
      this.state.camera,
      this.state.userType
    );
    await this.getFootfallAnalysisData(value);
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
    this.setState({ pdfLoader: false });
    await this.setState({ dates: dates });
    const { user } = this.props.auth;
    this.getFootfallAnalysisData(this.state.localBranchId);
    this.onDateChange(this.state.localBranchId);
  };
  getUserBranchFromProps = async () => {
    const { user } = this.props.auth;
    await this.setState({
      branches: user.camera,
      cameras: user.camera[0].cameras[0],
      localBranchId: user.camera[0].branchId,
    });
  };
  getId = async () => {
    const { user } = this.props.auth;
    const { cameras, userType } = this.state;
    if (this.props.auth && user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          cameras: user.camera,
          localBranchId: user.branchId,
          localClientId: user.clientId,
          userType: user.userType,
        });
        allCameras = user.camera.map((i) => {
          return i.cameraId;
        });
        await this.setState({
          camera: allCameras,
        });

        this.noCameraAvail();
        this.props.getFootfallAnalysisTodayData(
          user.branchId,
          this.state.camera,
          user.userType
        );
        this.getTodayZoneBasedData(user.branchId);
        this.getWeeklyZoneBasedDate(user.branchId);
        this.getFootfallAnalysisData(user.branchId);
        this.getAllBranches(user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      this.getUserBranchFromProps();
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
        // localBranchId: user.camera.length && user.camera[0].branchId,
      });
      this.noCameraAvail();
      this.props.getFootfallAnalysisTodayData(
        this.state.localBranchId,
        this.state.camera,
        userType
      );
      this.getFootfallAnalysisData(this.state.localBranchId);
      this.getTodayZoneBasedData(this.state.localBranchId);
      this.getWeeklyZoneBasedDate(this.state.localBranchId);
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          cameras: this.props.admin.selectedClient.camera,
          localBranchId: this.props.admin.selectedClient.branchId,
          localClientId: this.props.admin.selectedClient.clientId,
          userType: this.props.admin.selectedClient.userType,
        });
        this.props.getFootfallAnalysisTodayData(
          this.props.admin.selectedClient.branchId,
          cameras,
          userType
        );
        this.getTodayZoneBasedData(this.props.admin.selectedClient.branchId);
        this.getWeeklyZoneBasedDate(this.props.admin.selectedClient.branchId);
        this.getFootfallAnalysisData(this.props.admin.selectedClient.branchId);
        // this.getAllBranches(user.clientId);
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
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
  getWeeklyZoneBasedDate = async (id) => {
    const { userType } = this.state;
    this.noCameraAvail();
    try {
      await axios
        .post(
          `${Config.hostName}/api/footfall-analysis/weekly/${id}/${userType}`,
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
          this.setState({ WeeklyZoneBasedResults: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };
  tableData = (tableData) => {
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
    const { userType } = this.state;
    this.noCameraAvail();
    try {
      await axios
        .post(
          `${Config.hostName}/api/footfall-analysis/today/${id}/${userType}`,
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
    } catch (error) {
      console.log("error contact", error);
    }
  };
  ReportHandling = async () => {
    await this.createAndDownloadPdf();

    await htmlToImage
      .toPng(document.getElementById("first-node"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        await this.setState({
          url: { first: dataUrl },
        });
      });
    await htmlToImage
      .toPng(document.getElementById("second-node"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        let obj = {};
        obj.first = this.state.url.first;
        obj.second = dataUrl;
        await this.setState({
          url: obj,
          // pdfLoader: !this.state.pdfLoader,
        });
      });
    await htmlToImage
      .toPng(document.getElementById("third-node"), {
        backgroundColor: "white",
        // height: 500,
      })
      .then(async (dataUrl) => {
        let obj = {};
        obj.first = this.state.url.first;
        obj.second = this.state.url.second;
        obj.third = dataUrl;
        await this.setState({
          url: obj,
          // pdfLoader: !this.state.pdfLoader,
        });
      });
    await htmlToImage
      .toPng(document.getElementById("fourth-node"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        let obj = {};
        obj.first = this.state.url.first;
        obj.second = this.state.url.second;
        obj.third = this.state.url.third;
        obj.fourth = dataUrl;
        await this.setState({
          url: obj,
          pdfLoading: false,
          pdfLoader: !this.state.pdfLoader,
        });
      });
  };
  createAndDownloadPdf = () => {
    axios
      .post(`${Config.hostName}/api/footfall-analysis/create-pdf`, {
        url: this.state.url,
        dates: JSON.stringify(this.state.dates),
        camera: this.state.camera,
        id: this.state.localBranchId,
        Img: Img,
      })
      .then(async (res) => {
        await this.setState({ pdfData: res.data });
      })
      .catch((res) => console.log("pdf error"));
  };
  onDateChange = async (id) => {
    const { userType } = this.state;
    try {
      await axios
        .post(
          `${Config.hostName}/api/footfall-analysis/dates/${id}/${userType}`,
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
          // console.log("ondatechange",res.data)
          if (!res.data.length) this.setState({ dateSelectedGraph: [] });

          res.data.length && this.setState({ dateSelectedGraph: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };
  componentDidUpdate() {
    // this.getFootfallAnalysisData();
  }
  getFootfallAnalysisData = async (id) => {
    const { userType, pageNumber } = this.state;
    try {
      this.noCameraAvail();
      await axios
        .post(
          `${Config.hostName}/api/footfall-analysis/all/${id}/${userType}`,
          {
            dates: JSON.stringify(this.state.dates),
            camera: this.state.camera,
          },
          {
            params: {
              page: pageNumber,
            },
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
          const { totalPages, client } = res.data;
          await this.setState({
            allData: client,
            NumberOfPages: totalPages,
          });
          this.tableData(client);
          let totalVisit = 0,
            percentValue = 0,
            length = 1;

          res.data.client.length &&
            res.data.client.map((i) => {
              totalVisit += i.Total_Person_Count;
              percentValue += i.PercentValue;
            });

          res.data.client.length
            ? (length = res.data.client.length)
            : (length = 1);
          percentValue = 0;

          averageNumber = percentValue / length;
          await this.setState({
            selectionCount: totalVisit,
            selectionDensity: averageNumber,
          });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };
  PusherComponent = (pusherData) => {
    const { user } = this.props.auth;
    if (
      pusherData.BranchID === this.state.localBranchId &&
      this.state.camera.includes(pusherData.CameraID)
    ) {
      user && this.props.pusherFootfall(this.state.localBranchId, pusherData);
      if (user && user.alertConfig.retailAnalytics.isFootfallCountActive)
        toast.success(`Person entered into ${pusherData.Zone}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    }
  };
  componentDidMount() {
    const socket = io(`${Config.hostName}/api/socket`, {
      pingInterval: 60000,
      pingTimeout: 180000,
      cookie: false,
      origins: "*:*",
      secure: true,
      transports: ["flashsocket", "polling", "websocket"],
      upgrade: false,
      reconnection: true,
    });
    socket.on("insertFootfall", (data) => {
      this.PusherComponent(data);
    });
    socket.on("deleteFootfall", (data) => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    socket.on("updateFootfall", (data) => {
      this.PusherComponent(data);
    });
  }
  async componentWillMount() {
    this.props.auth.selectedCamera &&
      (await this.setState({ camera: this.props.auth.selectedCamera }));
    setTimeout(() => this.setState({ loading: false }), 1500);
    await this.getId();
  }

  sendNotification = () => {
    // if(this.props.auth.user.use){
    var date = new Date();
    let formattedDate = moment(date).format("LL");
    let newString = `Average Density above 80% on ${formattedDate}`;
    let notification = this.props.auth.user.notifications;
    if (notification) {
      if (notification.indexOf(newString) > -1) {
      } else {
        this.props.showNotifications(
          `Average Density above 80% at ${formattedDate}`,
          this.props.auth.user.clientId
        );
      }
    }
  };
  render() {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const pages = new Array(this.state.NumberOfPages)
      .fill(null)
      .map((v, i) => i);
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { branches, camera, tableValues } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );
    const menu = (
      <Menu>
        <Menu.Item>
          <button
            onClick={async () => {
              await await this.setState({ pdfLoading: true });
              await this.ReportHandling();
            }}
            style={{
              backgroundColor: "white",
              border: "1px solid white",
            }}
          >
            PDF
          </button>
        </Menu.Item>
        <Menu.Item>
          <CsvDownload
            className="pdf-csv-selection"
            data={tableValues}
            filename="FootfallAnalysis.csv"
            style={{
              backgroundColor: "white",
              border: "1px solid white",
            }}
          >
            CSV
          </CsvDownload>
        </Menu.Item>
      </Menu>
    );
    dataValues = [];
    const { loading, alertMessage } = this.state;
    if (this.state.localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <div className="animated fadeIn">
          {alertMessage.length ? (
            <Alert color="danger">{alertMessage}</Alert>
          ) : null}
          <Row className="mb-3">
            <Col md="9">
              <Row>
                <Tooltip
                  className="mt-3"
                  placement="topLeft"
                  title="Date Filter"
                >
                  <InfoCircleOutlined className="ml-4 mr-1 mb-2" />
                </Tooltip>{" "}
                <RangePicker onChange={this.rangePicker} format={dateFormat} />
                <>
                  <Tooltip
                    className="mt-3"
                    placement="topLeft"
                    title="Select Branch"
                  >
                    <InfoCircleOutlined className="ml-4  mr-1 mb-2" />
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
                {console.log("cameratstae", this.state.camera)}
                <Tooltip
                  className="mt-3"
                  placement="topLeft"
                  title="Select Camera"
                >
                  <InfoCircleOutlined className="ml-4  mr-1 mb-2" />
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
              </Row>
            </Col>

            <Col md="3">
              {this.state.pdfLoading ? <Spin indicator={antIcon} /> : null}

              <Dropdown.Button
                shape="round"
                type="primary"
                overlay={menu}
                icon={
                  <DownloadOutlined
                    style={{
                      fontSize: "20px",
                      // color: "#3ac47d"
                    }}
                  />
                }
              >
                Download Report
              </Dropdown.Button>
            </Col>
            {/* <Col></Col> */}
          </Row>
          {this.state.pdfLoader && (
            <Copied data={this.state.pdfData} url={this.state.url} />
          )}
          <div>
            <div id="first-node">
              <Row>
                <Col md="4" lg="4">
                  <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-primary border-primary">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-title opacity-5 text-uppercase">
                          {!this.state.dates.length ? (
                            <>Person Visit Today </>
                          ) : (
                            <>No. Of Person Visit </>
                          )}
                        </div>
                        <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                          <div className="widget-chart-flex align-items-center">
                            <div>
                              <span className="opacity-10 text-success pr-2"></span>
                              {!this.state.dates.length
                                ? // this.props.footfall.todayTotalCount
                                  this.props.footfall.todayEachZoneTotalCount.map(
                                    (i, index) => {
                                      return (
                                        <Tag key={index}>
                                          {Object.keys(i)}:{Object.values(i)}
                                        </Tag>
                                      );
                                    }
                                  )
                                : this.state.selectionCount}
                            </div>
                            <div className="widget-title ml-auto font-size-lg font-weight-normal text-muted">
                              <div className="ml-auto">
                                <Circle
                                  animate={true} // Boolean: Animated/Static progress
                                  animationDuration="10s" // String: Length of animation
                                  responsive={false} // Boolean: Make SVG adapt to parent size
                                  size="56" // String: Defines the size of the circle.
                                  lineWidth="30" // String: Defines the thickness of the circle's stroke.
                                  progress={this.props.footfall.todayTotalCount} // String: Update to change the progress and percentage.
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
                {!this.state.dates.length ? (
                  <Col md="4" lg="4">
                    <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-danger">
                      <div className="widget-chat-wrapper-outer">
                        <div className="widget-chart-content">
                          <div className="widget-title opacity-5 text-uppercase">
                            Person Currently Available
                          </div>
                          <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div className="widget-chart-flex align-items-center">
                              <div>
                                <span className="opacity-10 text-success pr-2"></span>

                                {this.props.footfall.todayEachZoneCurrentCount.map(
                                  (i, index) => {
                                    return (
                                      <Tag key={index}>
                                        {Object.keys(i)}:{Object.values(i)}
                                      </Tag>
                                    );
                                  }
                                )}
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
                                      this.props.footfall.todayCurrentCount
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
                {!this.state.dates.length && (
                  <Col md="4" lg="4">
                    <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-success border-success">
                      <div className="widget-chat-wrapper-outer">
                        <div className="widget-chart-content">
                          <div className="widget-title opacity-5 text-uppercase">
                            Crowd Density
                          </div>
                          <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div className="widget-chart-flex align-items-center">
                              <div>
                                <span className="opacity-10 text-success pr-2"></span>
                                {/* {!this.state.dates.length &&
                                !this.state.camera.length
                                  ? this.props.footfall.averageDensity
                                  : // : this.state.selectionDensity.length
                                  this.state.selectionDensity !== 0
                                  ? this.state.selectionDensity
                                  : 0} */}
                                {this.props.footfall.totalDensityArr.map(
                                  (i, index) => {
                                    return (
                                      <Tag key={index}>
                                        {Object.keys(i)}:{Object.values(i)}
                                      </Tag>
                                    );
                                  }
                                )}
                                {/* %/ */}
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
                                      !this.state.dates.length &&
                                      !this.state.camera.length
                                        ? this.props.footfall.averageDensity
                                        : this.state.selectionDensity.length
                                        ? this.state.selectionDensity
                                        : 0
                                    }
                                    // String: Update to change the progress and percentage.
                                    progressColor="var(--warning)" // String: Color of "progress" portion of circle.
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
                )}
              </Row>
            </div>
            <div id="second-node">
              <Row>
                <Col md="8">
                  <div>
                    {this.state.todayZoneBasedResults.length ? (
                      <Card>
                        <CardHeader>
                          Today's Population in Different Zones &nbsp;
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
                            // title: "Today's Population in Different Zones",
                            chartArea: { width: "70%" },
                            hAxis: {
                              title: "Total Population",
                              minValue: 0,
                            },
                            vAxis: {
                              title: "Zones ",
                              subtitle: "",
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
                    <CardHeader>Total VS Currently Available</CardHeader>{" "}
                    <Chart
                      style={{ overflow: "hidden" }}
                      // width={'300px'}
                      height={"300px"}
                      chartType="PieChart"
                      loader={<div>Loading Chart</div>}
                      data={[
                        ["Total Person Visit", "Currently Person Count"],
                        [
                          "Total Person Visit",
                          this.props.footfall.todayTotalCount,
                        ],
                        [
                          "Current Count",
                          this.props.footfall.todayCurrentCount,
                        ],
                      ]}
                      options={{
                        // title: "Daily track (Total Count VS Currently Available)",
                        pieHole: 0.5,
                      }}
                      rootProps={{ "data-testid": "3" }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>{" "}
            <div id="third-node">
              <Row className="mt-4">
                {this.state.WeeklyZoneBasedResults.length
                  ? this.state.WeeklyZoneBasedResults.map((i, index) => {
                      return (
                        <Col key={index} md="6" className="mb-2">
                          <div className="card">
                            <ZonesChart
                              data={Object.values(i)}
                              title={Object.keys(i)}
                            />
                          </div>
                        </Col>
                      );
                    })
                  : null}
              </Row>
            </div>
            <div id="fourth-node">
              <Row className="mt-4">
                <Col>
                  <div className="card ">
                    <div className="card-header">
                      <Row className="mt-2">
                        <Col>Number Of Person Visit in Different Zones</Col>
                      </Row>
                    </div>
                    <div className="card-body">
                      <Chart
                        // width={'1300px'}
                        style={{ overflow: "hidden" }}
                        height={300}
                        chartType={!this.state.barChart ? "AreaChart" : "Bar"}
                        loader={<div>Loading Chart</div>}
                        data={this.state.dateSelectedGraph}
                        options={{
                          displayExactValues: true,
                          hAxis: {
                            // title: 'Total Population',
                            minValue: 1,
                          },
                          chart: {
                            // title: "Number Of Person Visit in Different Zones",
                            subtitle:
                              "Daily/Monthly/Yearly Person Visit in different Zones",
                          },
                        }}
                        rootProps={{ "data-testid": "3" }}
                      />
                      <Switch
                        unCheckedChildren={" Volume "}
                        checkedChildren={" Trend "}
                        onChange={async () => {
                          await this.setState({
                            barChart: !this.state.barChart,
                          });
                        }}
                      ></Switch>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <Row className="mt-4">
              <Col>
                <Card>
                  <CardHeader>
                    <Tooltip
                      placement="topLeft"
                      title="Number of Persons Enter in Different Zones"
                    >
                      <InfoCircleOutlined className=" mr-1" />
                    </Tooltip>{" "}
                    Footfall Analysis
                  </CardHeader>
                  <CardBody>
                    {this.props.footfall && (
                        <Pagination onChange={this.onPageChange} total={50} />
                      ) && (
                        <div>
                          <Table
                            pagination={false}
                            // pagination={{
                            //   defaultPageSize: 10,
                            //   showSizeChanger: true,
                            //   pageSizeOptions: ["10", "20", "30"],
                            // }}
                            id="my-table"
                            dataSource={this.state.tableValues}
                          >
                            <Column
                              title="Serial No."
                              dataIndex="key"
                              key="key"
                            />

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
                              title="Current Count"
                              dataIndex="Current_Person_Count"
                              key="Current_Person_Count"
                            />
                            <Column
                              title="Total Count"
                              dataIndex="Total_Person_Count"
                              key="Total_Person_Count"
                            />
                            <Column
                              title="Density"
                              dataIndex="Density"
                              key="Density"
                            />
                          </Table>
                          <span style={{ float: "right" }}>
                            <Button onClick={this.goToPrevious}>
                              <LeftOutlined />
                            </Button>
                            {pages.map((pageIndex) => (
                              <Button
                                key={pageIndex}
                                onClick={async () => {
                                  await this.setState({
                                    pageNumber: pageIndex,
                                  });
                                  this.getFootfallAnalysisData(
                                    this.state.localBranchId
                                  );
                                }}
                              >
                                {pageIndex + 1}
                              </Button>
                            ))}
                            <Button onClick={this.goToNext}>
                              <RightOutlined />
                            </Button>
                          </span>
                        </div>
                      )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
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

FootfallAnalysis.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  getFootfallAnalysisTodayData: PropTypes.func.isRequired,
  getFootfallAllData: PropTypes.func.isRequired,
  footfall: PropTypes.object.isRequired,
  pusherFootfall: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  footfall: state.footfall,
});
export default connect(mapStateToProps, {
  getFootfallAnalysisTodayData,
  getFootfallAllData,
  pusherFootfall,
  showNotifications,
})(FootfallAnalysis);
