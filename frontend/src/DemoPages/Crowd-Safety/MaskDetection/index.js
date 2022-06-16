import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DownloadOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import Chart from "react-google-charts";
import {
  Table,
  Tag,
  Space,
  DatePicker,
  Spin,
  Menu,
  Dropdown,
  Select,
  Tooltip,
} from "antd";
import moment from "moment";
import {
  getMaskDetectionTodayCount,
  pusherMask,
} from "../../../actions/maskDetection.actions";
import Loader from "react-loaders";
import { ToastContainer, toast } from "react-toastify";
import htmlToImage from "html-to-image";
import CountUp from "react-countup";
import Copied from "./PdfFile";
import CsvDownload from "react-json-to-csv";
import {
  CardBody,
  Card,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
  CardHeader,
} from "reactstrap";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
let dataValues = [];
const { Option } = Select;
const initialWeeklyCordinates = [
  ["Weekly", "With Mask", "Without Mask"],
  ["Sunday", 0, 0],
  ["Monday", 0, 0],
  ["Tuesday", 0, 0],
  ["Wednesday", 0, 0],
  ["Thursday", 0, 0],
  ["Friday", 0, 0],
  ["Saturday", 0, 0],
];
const intialRangeValue = [
  ["Date", "Face Detected", "Mask Detected", "Without Mask"],
  ["January", 0, 0, 0],
  ["February", 0, 0, 0],
  ["March", 0, 0, 0],
  ["April", 0, 0, 0],
  ["May", 0, 0, 0],
  ["June", 0, 0, 0],
  ["July", 0, 0, 0],
  ["August", 0, 0, 0],
  ["September", 0, 0, 0],
  ["October", 0, 0, 0],
  ["November", 0, 0, 0],
  ["December", 0, 0, 0],
];

class MaskDetection extends Component {
  state = {
    branch: "",
    branches: [],
    cameras: [],
    camera: "",
    localClientId: "",
    localBranchId: "",
    userType: this.props.auth.user.userType,
    data: [],
    modal: false,
    modalImage: "",
    alertMessage: "",
    dates: [],
    weeklyCordinates: [],
    rangeResult: intialRangeValue,
    modal: false,
    modalImage: true,
    dateSelectionCount: [],
    pusherObj: {},
    tableData: [],
    loading: true,
    spinner: false,
    pdfloader: false,
    url: "",
  };
  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    if (!value.length) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
    const {
      localBranchId,
      localClientId,
      camera,
      userType,
      dates,
    } = this.state;
    const { user } = this.props.auth;
    if (user && user.userType === "client") {
      this.props.getMaskDetectionTodayCount(localBranchId, camera, userType);
      this.getMaskDetectionData(localBranchId);
      this.CountDataBasedOnDateSelection(localBranchId);
      this.weeklyDataAnalysis(localBranchId);
      this.state.dates.length &&
        this.OnChangeRangePicker(dates, localBranchId, userType);
    } else {
      this.props.getMaskDetectionTodayCount(localClientId, camera, userType);
      this.getMaskDetectionData(localClientId);
      this.weeklyDataAnalysis(localClientId);
      this.CountDataBasedOnDateSelection(localClientId);
      this.state.dates.length &&
        this.OnChangeRangePicker(dates, localClientId, userType);
    }
    // this.getMaskDetectionData(this.state.localClientId);
    // this.OnChangeRangePicker(this.state.dates);
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
        // console.log("brnahces", res.data);
        this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
        // if (err.response) {
        //   const errors = err.response.data.errors;
        //   if (errors) {
        //     errors.forEach((error) => {
        //       //   console.log(error.msg)
        //       toast.error(error.msg, {
        //         position: "top-right",
        //         autoClose: 5000,
        //         hideProgressBar: true,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //       });
        //     });
        //   }
        // }
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
  branchHandleChange = async (value) => {
    await this.setState({ localBranchId: value, localClientId: value });
    this.weeklyDataAnalysis(value);
    this.getMaskDetectionData(value);
    this.CountDataBasedOnDateSelection(value);
    this.OnChangeRangePicker(this.state.dates, value, this.state.userType);
    this.props.getMaskDetectionTodayCount(
      this.state.localBranchId,
      this.state.camera,
      this.state.userType
    );
  };
  CountDataBasedOnDateSelection = async (id) => {
    if (!this.state.camera) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
    const { userType } = this.state;

    try {
      await axios
        .post(
          `${Config.hostName}/api/maskdetection/countdata/${id}/${userType}`,
          {
            dates: JSON.stringify(this.state.dates),
            camera: this.state.camera,
            branch: this.state.branch,
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
          console.log("count data", res.data);
          this.setState({ dateSelectionCount: res.data });
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
  ReportHandling = () => {
    htmlToImage
      .toJpeg(document.getElementById("my-node"), { backgroundColor: "white" })
      .then((dataUrl) => {
        this.setState({ url: dataUrl, pdfLoader: !this.state.pdfLoader });
      });
  };
  OnChangeRangePicker = async (dates, id, type) => {
    axios
      .post(
        Config.hostName + `/api/maskdetection/dates/${id}/${type}`,
        { dateObj: dates, camera: this.state.camera },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        }
      )
      .then((res) => {
        !res.data.length &&
          this.setState({
            alertMessage: "No Mask Detection data exist for this user",
            rangeResult: intialRangeValue,
          });
        // console.log("maskrane", res.data);
        this.setState({ rangeResult: res.data });
      })
      .catch((err) => {
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
      });
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
          localBranchId: user.branchId,
          userType: user.userType,
          cameras: user.camera,
        });
        this.getMaskDetectionData(user.branchId);
        this.props.getMaskDetectionTodayCount(
          user.branchId,
          this.state.camera,
          this.state.userType
        );
        this.weeklyDataAnalysis(this.props.auth.user.branchId);
        this.getAllBranches(this.props.auth.user.clientId);
        // this.state.camera.length &&
        //   this.CountDataBasedOnDateSelection(this.props.auth.user.clientId);
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
      this.getMaskDetectionData(this.props.auth.user.clientId);
      this.props.getMaskDetectionTodayCount(
        this.props.auth.user.clientId,
        this.state.camera,
        this.state.userType
      );
      this.weeklyDataAnalysis(this.props.auth.user.clientId);
      // this.state.camera.length &&
      //   this.CountDataBasedOnDateSelection(this.props.auth.user.clientId);
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
          localBranchId: this.props.admin.selectedClient.branchId,
          cameras: this.props.admin.selectedClient.camera,
          userType: this.props.admin.selectedClient.userType,
        });
        this.props.getMaskDetectionTodayCount(
          this.props.admin.selectedClient.branchId,
          this.state.camera,
          this.state.userType
        );
        this.getMaskDetectionData(this.props.admin.selectedClient.branchId);
        this.weeklyDataAnalysis(this.props.admin.selectedClient.branchId);
        // this.state.camera.length &&
        //   this.CountDataBasedOnDateSelection(
        //     this.props.admin.selectedClient.clientId
        //   );
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };

  weeklyDataAnalysis = async (id) => {
    if (!this.state.camera) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
    const { userType, camera } = this.state;
    try {
      await axios
        .post(
          `${Config.hostName}/api/maskdetection/weekly/${id}/${userType}`,
          {
            camera,
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
          !res.data.length &&
            this.setState({
              alertMessage: "No Mask Detection data exist for this user",
              weeklyCordinates: initialWeeklyCordinates,
            });
          // console.log("weekly", res.data);
          this.setState({ weeklyCordinates: res.data });
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
    socket.on("insertMask", (data) => {
      this.PusherComponent(data);
    });
    socket.on("deleteFootfall", (data) => {});
    socket.on("updateMask", (data) => {
      this.PusherComponent(data);
    });
  }
  getMaskDetectionData = async (id) => {
    if (!this.state.camera) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
    const { userType, camera } = this.state;
    try {
      await axios
        .post(
          `${Config.hostName}/api/maskdetection/me/${id}/${userType}`,
          {
            dates: JSON.stringify(this.state.dates),
            camera,
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
          this.tableData(res.data);
          this.setState({ data: res.data });
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
  maskDetectionRangePicker = async (dates, dateStrings) => {
    this.setState({ pdfLoader: false });
    await this.setState({ dates: dates });
    const { user } = this.props.auth;
    const { localBranchId, userType, localClientId } = this.state;
    if (user && user.userType === "client") {
      this.getMaskDetectionData(localBranchId);
      this.CountDataBasedOnDateSelection(localBranchId);
      this.OnChangeRangePicker(dates, localBranchId, userType);
    } else {
      this.getMaskDetectionData(localClientId);
      this.CountDataBasedOnDateSelection(localClientId);
      this.OnChangeRangePicker(dates, localClientId, userType);
    }
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
  };
  showImage = async (image, index) => {
    this.setState({ spinner: true });
    try {
      await axios
        .get(`${Config.hostName}/api/maskdetection/img/${index._id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((res) => {
          this.setState({
            spinner: false,
            modalImage: res.data.FaceImage,
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
  async componentWillMount() {
    {
      this.props.auth.selectedCamera &&
        (await this.setState({ camera: this.props.auth.selectedCamera }));
    }
    setTimeout(() => this.setState({ loading: false }), 1500);
    await this.getId();
  }
  tableData = (data) => {
    dataValues = [];
    data.map((i, index) => {
      i.Mask_detected === true || i.Mask_detected === "Yes"
        ? (i.Mask_detected = "Yes")
        : (i.Mask_detected = "No");
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
    this.setState({ tableData: dataValues });
  };

  render() {
    const { cameras, branches, camera, branch, tableValues } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );
    const { data, totalCount, loading } = this.state;
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
            data={this.state.tableData}
            filename="MaskDetection.csv"
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
    if (this.state.localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <div className="animated fadeIn">
          <div>
            <Row className="mb-3">
              <Col md="9" className="ml-2 mr-2">
                <Row>
                  <RangePicker
                    onChange={this.maskDetectionRangePicker}
                    format={dateFormat}
                    size="sm"
                  />
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
            {this.state.pdfLoader && (
              <Copied data={this.state.tableData} url={this.state.url} />
            )}

            <div id="my-node">
              <Row>
                <Col md="6" xl="4">
                  <div className="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-warning border-warning">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content pt-1 pl-3 pb-1">
                        <Row>
                          <Col>
                            <div className="widget-chart-flex">
                              <div className="widget-numbers">
                                <div className="widget-chart-flex">
                                  <div className="fsize-4">
                                    {!this.state.dates.length &&
                                    !this.state.branch ? (
                                      this.props.maskDetection ? (
                                        <CountUp
                                          start={0}
                                          end={
                                            this.props.maskDetection.faceCount
                                          }
                                          separator=""
                                          decimals={0}
                                          decimal=""
                                          prefix=""
                                          duration="10"
                                        />
                                      ) : (
                                        <Loader />
                                      )
                                    ) : this.state.dateSelectionCount.length ? (
                                      this.state.dateSelectionCount[0]
                                    ) : (
                                      0
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h6 className="widget-subheading mb-0 opacity-5 text-uppercase">
                              Face Detected
                            </h6>
                          </Col>
                          <Col className="mt-3">
                            <img
                              alt="Person"
                              height={50}
                              src={require("../../../assets/componentImg/person.png")}
                            ></img>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="6" xl="4">
                  <div className="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-primary border-primary">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content pt-1 pl-3 pb-1">
                        <Row>
                          <Col>
                            <div className="widget-chart-flex">
                              <div className="widget-numbers">
                                <div className="widget-chart-flex">
                                  <div className="fsize-4">
                                    {!this.state.dates.length &&
                                    !this.state.branch ? (
                                      this.props.maskDetection ? (
                                        <CountUp
                                          start={0}
                                          end={
                                            this.props.maskDetection
                                              .wearingMaskToday
                                          }
                                          separator=""
                                          decimals={0}
                                          decimal=""
                                          prefix=""
                                          duration="10"
                                        />
                                      ) : (
                                        <Loader />
                                      )
                                    ) : this.state.dateSelectionCount.length ? (
                                      this.state.dateSelectionCount[1]
                                    ) : (
                                      0
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h6 className="widget-subheading mb-0 opacity-5 text-uppercase">
                              With Mask
                            </h6>
                          </Col>
                          <Col className="mt-3">
                            <img
                              height={50}
                              src={require("../../../assets/componentImg/covid.png")}
                            ></img>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="6" xl="4">
                  <div className="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-danger border-danger">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content pt-1 pl-3 pb-1">
                        <Row>
                          <Col>
                            <div className="widget-chart-flex">
                              <div className="widget-numbers">
                                <div className="widget-chart-flex">
                                  <div className="fsize-4">
                                    {/* <small className="opacity-5">$</small> */}
                                    {!this.state.dates.length &&
                                    !this.state.branch ? (
                                      this.props.maskDetection ? (
                                        <CountUp
                                          start={0}
                                          end={
                                            this.props.maskDetection
                                              .notWearingMaskToday
                                          }
                                          separator=""
                                          decimals={0}
                                          decimal=""
                                          prefix=""
                                          duration="10"
                                        />
                                      ) : (
                                        <Loader />
                                      )
                                    ) : this.state.dateSelectionCount.length ? (
                                      this.state.dateSelectionCount[2]
                                    ) : (
                                      0
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h6 className="widget-subheading mb-0 opacity-5 text-uppercase">
                              Without Mask
                            </h6>
                          </Col>
                          <Col className="mt-3">
                            <img
                              height={50}
                              src={require("../../../assets/componentImg/criss-cross.png")}
                            ></img>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              {!this.state.dates.length && (
                <Row className="mb-4">
                  {!this.state.dates.length && !this.state.branch ? (
                    <Col md="4">
                      <div>
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
                            title: "With Mask Vs Without Mask",
                          }}
                          rootProps={{ "data-testid": "1" }}
                        />
                      </div>
                    </Col>
                  ) : this.state.dateSelectionCount.length ? (
                    <Col md="4">
                      <div>
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
                              this.state.dateSelectionCount[1],
                            ],
                            [
                              "Person Without Mask",
                              this.state.dateSelectionCount[2],
                            ],
                          ]}
                          options={{
                            title: "With Mask Vs Without Mask",
                          }}
                          rootProps={{ "data-testid": "1" }}
                        />
                      </div>
                    </Col>
                  ) : (
                    <Col md="4"></Col>
                  )}
                  <Col md="8">
                    <div>
                      <Chart
                        // width={780}
                        height={300}
                        chartType="AreaChart"
                        loader={<div>Loading Chart</div>}
                        data={this.state.weeklyCordinates}
                        options={{
                          title: "Week Performance",
                          hAxis: {
                            title: "Week",
                            titleTextStyle: { color: "#333" },
                          },
                          vAxis: { minValue: 0 },
                          // For the legend to fit, we make the chart area smaller
                          chartArea: { width: "70%", height: "70%" },
                          // lineWidth: 10
                        }}
                        // For tests
                        rootProps={{ "data-testid": "1" }}
                      />
                    </div>
                  </Col>
                </Row>
              )}
              <Row className="mt-2"></Row>
              <Row>
                <Col>
                  <div className="card">
                    <div className="card-header">
                      <Row className="mt-2">
                        <Col>Data Analysis</Col>
                      </Row>
                    </div>
                    <div className="card-body">
                      <Chart
                        // width={'600px'}
                        height={300}
                        chartType="Line"
                        loader={<div>Loading Chart</div>}
                        data={this.state.rangeResult}
                        options={{
                          chart: {
                            // title: ' Weekly data Analysis',
                            // subtitle: 'in millions of dollars (USD)',
                          },
                        }}
                        rootProps={{ "data-testid": "3" }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <Row className="mt-4">
              <Col md="10"></Col>
              <Col>{this.state.spinner && <Spin size="large" />}</Col>{" "}
              <Col>
                <Card>
                  <CardHeader>Table </CardHeader>
                  <CardBody>
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
                        title="Mask Detected"
                        dataIndex="Mask_detected"
                        key="Mask_detected"
                      />
                      <Column
                        title="Image"
                        dataIndex="FaceImage"
                        key="FaceImage"
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
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Modal
              contentClassName="custom-modal-style"
              isOpen={this.state.modal}
              toggle={() => {
                this.setState({ modal: !this.state.modal });
              }}
            >
              <ModalBody className="custom-modal-style">
                <img
                  top
                  width="100%"
                  height={300}
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

MaskDetection.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  getMaskDetectionTodayCount: PropTypes.func.isRequired,
  pusherMask: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  maskDetection: state.maskDetection,
});
export default connect(mapStateToProps, {
  getMaskDetectionTodayCount,
  pusherMask,
})(MaskDetection);
