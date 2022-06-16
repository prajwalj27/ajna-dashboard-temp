import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  CardHeader,
  Container,
  Card,
  CardBody,
  Alert,
} from "reactstrap";
import { Redirect } from "react-router-dom";
import {
  DownloadOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import Config from "../../../config/Config";
import { DatePicker, Menu, Dropdown, Tooltip, Switch, Spin } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Loader from "react-loaders";
import moment from "moment";
import { Table, Tag, Select } from "antd";
import Copied from "./PdfFile";
import { pdfDwellTimeAnalysis } from "../../../actions/dwellTimeAnalysis.actions";
import CsvDownload from "react-json-to-csv";
import io from "socket.io-client";
import Chart from "react-google-charts";
import ZonesChart from "./dwellZones";
import htmlToImage from "html-to-image";

const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const { Option } = Select;
let allCameras = [];

let dataValues = [];

class DwellTimeAnalysis extends Component {
  state = {
    localClientId: "",
    localBranchId: "",
    userType: "",
    todaydwell: [],
    nodes: [],
    edges: [],
    data: [],
    tableData: [],
    modal: false,
    modalImage: true,
    loading: true,
    pdfLoader: false,
    dates: [],
    cameras: [],
    branches: [],
    branch: "",
    camera: [],
    barChart: false,
    WeeklyZoneBasedResults: [
      ["Weekly Data", "Zones"],
      ["Sunday", 0],
      ["Monday", 0],
      ["Tuesday", 0],
      ["Wednesday", 0],
      ["Thursday", 0],
      ["Friday", 0],
      ["Saturday", 0],
    ],
    todayAvgTime: [],
    noOfPassersBy: [],
    maxTimeSpent: [],
    minTimeSpent: [],
    avgTimeSpent: [],
    datesBasedData: [],
    url: {},
    _isMounted: false,
    pdfLoading: false,
  };
  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    await this.getWeeklyZoneBasedDate(this.state.localBranchId);
    await this.getTodayAverageTime(this.state.localBranchId);
    await this.getTodayPassersBy(this.state.localBranchId);
    await this.getTodayMaxMin(this.state.localBranchId);
    await this.getDwellTimeAllData(this.state.localBranchId);
  };
  componentDidMount() {
    const socket = io(`${Config.hostName}/api/socket`, {
      pingInterval: 60000,
      pingTimeout: 180000,
      cookie: false,
      origins: "*:*",
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
    });
    socket.on("insertDwellTime", (data) => {
      // console.log("insertDwellTime data", data);
      // this.PusherComponent(data);
    });
    socket.on("deleteDwellTime", (data) => {
      // console.log("deleteDwellTime data", data);
    });
    socket.on("updateDwellTime", (data) => {
      this.PusherComponent(data);
      // console.log("updateDwellTime data", data);
    });
  }
  PusherComponent = (pusherData) => {
    if (
      pusherData.BranchID === this.state.localBranchId &&
      this.state.camera.includes(pusherData.CameraID)
    ) {
      pusherData.passerBy.map((i) => {
        if (i.Threshold == true) {
          toast.success(
            `Person ${i.PersonID} Spent ${i.TimeSpent}ms in ${pusherData.Zone}`,
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
      });
    }
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
        if (res.data) {
          await this.setState({
            cameras: res.data[0].camera,
            camera: [],
            // camera: res.data[0].camera,
          });
        }
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
      user.camera.map(async (item) => {
        if (item.branchId == value) {
          await this.setState({ cameras: item.cameras[0], camera: [] });
        }
      });
    }
    await this.getWeeklyZoneBasedDate(value);
    await this.getTodayAverageTime(value);
    await this.getTodayPassersBy(value);
    await this.getTodayMaxMin(value);
    await this.getDwellTimeAllData(value);
  };
  getTodayAverageTime = async (id) => {
    try {
      this.noCameraAvail();
      await axios
        .post(
          `${Config.hostName}/api/dwell-time-analysis/todayme/${id}/${this.state.userType}`,
          { camera: this.state.camera },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-auth-token": this.props.auth.token,
            },
          }
        )
        .then((res) => {
          this.setState({ todayAvgTime: res.data });
        });
    } catch (error) {
      console.log("error dwell", error);
    }
  };
  getTodayPassersBy = async (id) => {
    this.noCameraAvail();
    try {
      await axios
        .post(
          `${Config.hostName}/api/dwell-time-analysis/todayparserby/${id}/${this.state.userType}`,
          { camera: this.state.camera },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-auth-token": this.props.auth.token,
            },
          }
        )
        .then((res) => {
          if (res.data.length) this.setState({ noOfPassersBy: res.data });
        });
    } catch (error) {
      console.log("error dwell", error);
    }
  };
  getTodayMaxMin = async (id) => {
    try {
      this.noCameraAvail();
      // console.log("api hit");
      await axios
        .post(
          `${Config.hostName}/api/dwell-time-analysis/maxmin/${id}/${this.state.userType}`,
          { camera: this.state.camera },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-auth-token": this.props.auth.token,
            },
          }
        )
        .then(async (res) => {
          if (res.data) {
            const { avgTimeSpent, minTimeSpent, maxTimeSpent } = res.data;

            await this.setState({ avgTimeSpent, minTimeSpent, maxTimeSpent });
          }
        });
    } catch (error) {
      console.log("error dwell", error);
    }
  };
  getWeeklyZoneBasedDate = async (id) => {
    try {
      this.noCameraAvail();
      await axios
        .post(
          `${Config.hostName}/api/dwell-time-analysis/weekly/${id}/${this.state.userType}`,
          { camera: this.state.camera },
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
      console.log("error dwell", error);
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
  getId = async () => {
    const { user } = this.props.auth;
    if (this.props.auth && user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          localClientId: user.clientId,
          userType: user.userType,
          localBranchId: user.branchId,
          cameras: user.camera,
        });
        allCameras = user.camera.map((i) => {
          return i.cameraId;
        });

        await this.setState({
          camera: allCameras,
        });
        this.noCameraAvail();
        this.getAllBranches(user.clientId);
        this.getDwellTimeAllData(this.state.localBranchId);
        this.getWeeklyZoneBasedDate(this.props.auth.user.branchId);
        this.getTodayAverageTime(this.props.auth.user.branchId);
        this.getTodayPassersBy(this.props.auth.user.branchId);
        this.getTodayMaxMin(this.props.auth.user.branchId);
        // this.getAllCamera(user.clientId)
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      if (user.clientId) {
        this.getUserBranchFromProps();
        await this.setState({
          localClientId: user.clientId,
          userType: user.userType,
        });
        this.noCameraAvail();
        this.getDwellTimeAllData(this.state.localBranchId);
        this.getWeeklyZoneBasedDate(this.state.localBranchId);
        this.getTodayAverageTime(this.state.localBranchId);
        this.getTodayPassersBy(this.state.localBranchId);
        this.getTodayMaxMin(this.state.localBranchId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
          localBranchId: this.props.admin.selectedClient.branchId,
          cameras: this.props.admin.selectedClient.camera,
        });
        this.getDwellTimeAllData(this.props.admin.selectedClient.branchId);
        this.getWeeklyZoneBasedDate(this.props.admin.selectedClient.branchId);
        this.getTodayAverageTime(this.props.admin.selectedClient.branchId);
        this.getTodayPassersBy(this.props.admin.selectedClient.branchId);
        this.getTodayMaxMin(this.props.admin.selectedClient.branchId);
        // this.getAllCamera(this.props.admin.selectedClient.clientId)
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  rangePicker = async (dates, dateStrings) => {
    const { user } = this.props.auth;
    this.setState({ pdfLoader: false });
    await this.setState({ dates: dates });
    user && (user.userType === "client" || user.userType === "admin")
      ? this.getDwellTimeAllData(this.state.localBranchId)
      : this.getDwellTimeAllData(this.state.localClientId);
  };
  tableData = (data) => {
    dataValues = [];
    data.map((i, index) => {
      let date = moment.parseZone(i.passerBy.Timestamp);
      let format = date.format("LLL");
      i.Timestamp = format;
      i.PersonID = i.passerBy.PersonID;
      i.TimeSpent = i.passerBy.TimeSpent;
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
    console.log("dwell", dataValues);
    this.setState({ tableData: dataValues });
  };
  noCameraAvail = async () => {
    if (!this.state.camera.length) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        return userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
  };
  getDwellTimeAllData = async (id) => {
    this.noCameraAvail();
    try {
      await axios
        .post(
          Config.hostName + "/api/dwell-time-analysis/me/" + id,
          {
            dates: JSON.stringify(this.state.dates),
            camera: this.state.camera,
            userType: this.state.userType,
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
          this.setState({ data: res.data });
          this.tableData(res.data);
        })
        .catch((err) => {
          console.log("dwell err", err);
        });
    } catch (error) {}
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

  ReportHandling = async () => {
    await htmlToImage
      .toJpeg(document.getElementById("first-node"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        await this.setState({
          url: { first: dataUrl },
          // pdfLoader: !this.state.pdfLoader,
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
      .toPng(document.getElementById("my-node"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        let obj = {};
        obj.first = this.state.url.first;
        obj.second = this.state.url.second;
        obj.third = dataUrl;
        await this.setState({
          url: obj,
          pdfLoading: !this.state.pdfLoading,
          pdfLoader: !this.state.pdfLoader,
        });
      });
    // await this.setState({ pdfLoading: false });
  };
  async componentWillMount() {
    await this.setState({ _isMounted: true });
    (await this.state._isMounted) &&
      setTimeout(() => this.setState({ loading: false }), 1500);
    (await this.state._isMounted) && this.getId();
  }
  componentWillUnmount() {
    this.setState({ _isMounted: false });
  }

  render() {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const {
      camera,
      loading,
      localClientId,
      branches,
      pdfLoader,
      tableData,
      url,
    } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );
    const menu = (
      <Menu>
        <Menu.Item>
          <button
            onClick={
              async () => {
                await this.setState({ pdfLoading: true });
                await this.ReportHandling();
              }
              //  this.setState({ modal: true });
            }
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
            data={this.state.tableData}
            filename="DwellTimeAnalysis.csv"
            // filename="MaskDetection.csv"
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
    if (localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <Fragment>
          {pdfLoader && <Copied data={tableData} url={url} />}
          <Row className="mb-3">
            <Col md="9">
              <Row>
                <Tooltip
                  className="mt-3"
                  placement="topLeft"
                  title="Date Filter"
                >
                  <InfoCircleOutlined className="ml-3 mr-1 mb-2" />
                </Tooltip>{" "}
                <RangePicker onChange={this.rangePicker} format={dateFormat} />
                <>
                  <Tooltip
                    className="mt-3"
                    placement="topLeft"
                    title="Select Branch"
                  >
                    <InfoCircleOutlined className="ml-4 mr-1 mb-2" />
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
                  <InfoCircleOutlined className="ml-4 mr-1 mb-2" />
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
                type="primary"
                className="ml-5"
                placement="bottomCenter"
                overlay={menu}
                icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
              >
                Download Report
              </Dropdown.Button>
            </Col>
          </Row>
          <div id="first-node">
            <Row>
              {!this.state.dates.length ? (
                <Col md="6" lg="4">
                  <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-primary border-primary">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-title opacity-5 text-uppercase">
                          <Tooltip
                            placement="topLeft"
                            title="Maximum time Spent in Different Zones"
                          >
                            <InfoCircleOutlined className=" mr-1" />
                            Maximum time Spent{" "}
                          </Tooltip>{" "}
                        </div>
                        <div className="widget-numbers mt-2 fsize-2 mb-0 w-100">
                          <div className="widget-chart-flex align-items-center">
                            <div>
                              <span className="opacity-10 text-success pr-2"></span>
                              {this.state.maxTimeSpent.map((i, index) => {
                                return (
                                  <Tag key={index}>
                                    {i.zone}:{i.total}
                                  </Tag>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ) : null}
              {!this.state.dates.length ? (
                <Col md="4" lg="4">
                  <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-danger">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-title opacity-5 text-uppercase">
                          <Tooltip
                            placement="topLeft"
                            title="Minimum Time Spent in Different Zones"
                          >
                            <InfoCircleOutlined className=" mr-1" />
                            Minimum time Spent
                          </Tooltip>{" "}
                        </div>
                        <div className="widget-numbers mt-2 fsize-2 mb-0 w-100">
                          <div className="widget-chart-flex align-items-center">
                            <div>
                              <span className="opacity-10 text-success pr-2"></span>
                              {this.state.minTimeSpent.map((i, index) => {
                                return (
                                  <Tag key={index}>
                                    {i.zone}:{i.total}
                                  </Tag>
                                );
                              })}
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
                  <Card className="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-warning border-warning">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-title opacity-5 text-uppercase">
                          <Tooltip
                            placement="topLeft"
                            title="Average Time Spent in Different Zones"
                          >
                            <InfoCircleOutlined className=" mr-1" />
                            Average time Spent
                          </Tooltip>{" "}
                        </div>
                        <div className="widget-numbers mt-2 fsize-2 mb-0 w-100">
                          <div className="widget-chart-flex align-items-center">
                            <div>
                              <span className="opacity-10 text-success pr-2"></span>
                              {this.state.avgTimeSpent.length &&
                                this.state.avgTimeSpent.map((i, index) => {
                                  return (
                                    <Tag key={index}>
                                      {i.zone}:
                                      {i.total ? i.total.toFixed(2) : null}
                                    </Tag>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ) : null}
            </Row>
          </div>
          <div id="second-node">
            <Row>
              <Col>
                <Chart
                  // width={"400px"}
                  height={"300px"}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={this.state.todayAvgTime}
                  options={{
                    pieStartAngle: 100,
                    legend: "none",
                    pieSliceText: "label",
                    title: "Today's Average Time Spent in Different Zones",
                    fontSize: 16,
                    chartArea: { width: "70%", height: "70%" },
                    // lineWidth: 25,
                  }}
                  // For tests
                  rootProps={{ "data-testid": "4" }}
                />
              </Col>
              <Col>
                <Chart
                  // width={"400px"}
                  height={"300px"}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={this.state.noOfPassersBy}
                  options={{
                    title: "Today's Number of Passersby in Different Zones",
                    fontSize: 16,
                    pieHole: 0.4,
                    // For the legend to fit, we make the chart area smaller
                    chartArea: { width: "70%", height: "70%" },
                    // lineWidth: 25
                  }}
                  // For tests
                  rootProps={{ "data-testid": "1" }}
                />
              </Col>
            </Row>
          </div>{" "}
          <div id="my-node">
            {this.state.datesBasedData.length ? (
              <Row className="mt-4">
                <Col>
                  <Card>
                    <CardHeader> Data Analysis </CardHeader>
                    <CardBody>
                      <Chart
                        // width={"500px"}
                        height={"400px"}
                        chartType="SteppedAreaChart"
                        loader={<div>Loading Chart</div>}
                        data={this.state.datesBasedData}
                        options={{
                          title:
                            "Maximum,Average and Minmum Time Spent in Selected Dates",
                          yAxis: { title: "hi" },
                          xAxis: { title: "hlo" },
                          isStacked: true,
                        }}
                        rootProps={{ "data-testid": "1" }}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ) : null}
            <Row className="mt-4 mb-4">
              <Col>
                <Card>
                  <Chart
                    className="m-3 p-3"
                    style={{ overflow: "hidden" }}
                    // width={"1150px"}
                    height={"350px"}
                    chartType={!this.state.barChart ? "Bar" : "AreaChart"}
                    loader={<div>Loading Chart</div>}
                    data={this.state.WeeklyZoneBasedResults}
                    options={{
                      chart: {
                        title: "Weekly Analysis",
                        subtitle: "Comparison of different Zones",
                      },
                    }}
                    // For tests
                    rootProps={{ "data-testid": "2" }}
                  />
                  <div className="col-2">
                    <Switch
                      className="m-2"
                      width={10}
                      unCheckedChildren={" Volume "}
                      checkedChildren={" Trend "}
                      onChange={async () => {
                        await this.setState({
                          barChart: !this.state.barChart,
                        });
                      }}
                    ></Switch>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
          <Card>
            <CardHeader>
              <Tooltip
                placement="topLeft"
                title="Amount of Time Spent in different Zones (Sec)"
              >
                <InfoCircleOutlined className=" mr-1" />
              </Tooltip>
              Dwell Time Analysis{" "}
            </CardHeader>
            <CardBody>
              <Container fluid>
                <Row className>
                  <Col>
                    <Table dataSource={this.state.tableData}>
                      <Column title="Serial No." dataIndex="key" key="key" />
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
                        title="Time"
                        dataIndex="Timestamp"
                        key="Timestamp"
                      />
                      <Column
                        title="PersonID"
                        dataIndex="PersonID"
                        key="PersonID"
                      />
                      <Column title="Zone" dataIndex="Zone" key="Zone" />
                      <Column
                        title="TimeSpent"
                        dataIndex="TimeSpent"
                        key="TimeSpent"
                      />
                    </Table>
                  </Col>
                </Row>
              </Container>
            </CardBody>
          </Card>
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
DwellTimeAnalysis.propTypes = {
  setAlert: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  dwellTimeAnalysis: state.dwellTimeAnalysis,
});
export default connect(mapStateToProps, { pdfDwellTimeAnalysis })(
  DwellTimeAnalysis
);
