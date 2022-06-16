import React, { Component } from "react";
import { Card, Row, Col, Breadcrumb, Select } from "antd";
// import HeatComponent from "./heatcomponent";
import { EyeTwoTone, InfoCircleOutlined } from "@ant-design/icons";
import { Modal, ModalBody, ModalFooter, Button, Alert } from "reactstrap";
import { DatePicker, Space, Spin, Tooltip } from "antd";
import Config from "../../../config/Config";
import { connect } from "react-redux";
import Loader from "react-loaders";
import axios from "axios";
import { Redirect } from "react-router-dom";
const { Meta } = Card;
var currentMonthDates = [];
const { Option } = Select;
class CoverCameraHeatmap extends Component {
  state = {
    _isMounted: false,
    showMonthlyComponent: false,
    date: {},
    modal: false,
    clientCameras: [],
    impressions: [],
    localClientId: "",
    localBranchId: "",
    loading: true,
    viewCameraDetails: "",
    isImagesFetched: false,
    selectedBranch: "",
    branches: [],
    userBranches: [],
    cameras: [],
  };

  componentWillMount() {
    this.setState({ _isMounted: true });
  }
  async componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 1500);
    await this.getId();
  }
  componentWillUnmount() {
    this.setState({ _isMounted: false });
  }
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
      if (this.props.auth.user.clientId) {
        await this.setState({
          localClientId: user.clientId,
          cameras: user.camera,
          userType: user.userType,
          localBranchId: user.branchId,
        });
        await this.getClientCameras(user.branchId);
        await this.getAllBranches(user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      await this.getUserBranchFromProps();
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
      });
      await this.getClientCameras(user.camera[0].branchId);
    } else {
      const { admin } = this.props;
      var size = Object.keys(admin.selectedClient).length;
      if (size) {
        await this.setState({
          userType: admin.selectedClient.userType,
        });
        await this.setState({
          localClientId: admin.selectedClient.clientId,
        });
        await this.setState({
          cameras: admin.selectedClient.camera,
        });
      } else {
      }
    }
  };
  branchHandleChange = async (value) => {
    const { user } = this.props.auth;
    await this.setState({ selectedBranch: value, localBranchId: value });
    if (user.userType == "user")
      user.camera.map(async (item) => {
        if (item.branchId == value) {
          await this.setState({ cameras: item.cameras[0], camera: "" });
        }
      });
    await this.getClientCameras(this.state.localBranchId);
  };
  getClientCameras = async (id) => {
    try {
      await axios
        .post(
          `${Config.hostName}/api/branch/allcamera/${id}/${this.props.auth.user.userType}`,
          { camera: this.state.cameras },
          {
            params: {
              branch: this.state.localBranchId,
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
          if (res.data) {
            this.setState({
              clientCameras: res.data,
              isImagesFetched: true,
            });
          }
        });
    } catch (error) {
      console.log("error contact", error);
    }
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
  render() {
    if (!this.props.auth.user) return <Redirect to={"/pages/login"} />;
    if (this.state.showMonthlyComponent) {
      return (
        <Redirect
          to={`/retail-analytics/heatmap-analysis/${this.state.viewCameraDetails}`}
        />
      );
    }
    const { month, loading } = this.state;
    var date = new Date();
    const getDaysInMonth = (month, year) =>
      new Array(31)
        .fill("")
        .map((v, i) => new Date(year, month - 1, i + 1))
        .filter((v) => v.getMonth() === month - 1);
    let showMonth = date.getMonth() + 1;
    let showYear = date.getFullYear();
    if (this.state.month) {
      showMonth = month.split("-")[1];
      showMonth = parseInt(showMonth);
      showYear = parseInt(month.split("-")[0]);
    }

    currentMonthDates = getDaysInMonth(showMonth, showYear);
    if (this.state.localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <div>
          {!this.state.isImagesFetched && (
            <Spin size="large" tip="Fetching images" />
          )}
          {this.state.clientCameras.length ? (
            <Row>
              <Col>
                <Tooltip placement="topLeft" title="Select Branch">
                  <InfoCircleOutlined className=" mr-1 mb-2" />
                </Tooltip>{" "}
                <Select
                  // className="ml-2"
                  defaultValue="Select Branch"
                  value={
                    this.state.localBranchId
                      ? this.state.localBranchId
                      : "Select Branch"
                  }
                  style={{ width: 180, border: "none" }}
                  onChange={this.branchHandleChange}
                >
                  {this.state.branches.map((i, index) => {
                    // if (this.props.auth.user.userType == "user")
                    return (
                      <Option key={index} value={`${i.branchId}`}>
                        {i.branchName}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
          ) : null}
          <Row>
            {this.state.clientCameras.map((i, index) => {
              return (
                <Col className="m-2" key={index}>
                  <div
                    onClick={async () => {
                      await localStorage.removeItem("imgData");
                      await this.setState({ viewCameraDetails: i.cameraId });
                      await localStorage.setItem("imgData", i.cameraFrame);
                      await this.setState({ showMonthlyComponent: true });
                    }}
                  >
                    <Card
                      key={index}
                      hoverable
                      style={{ width: 290 }}
                      cover={
                        <img
                          alt="example"
                          height="200vh"
                          width="250vw"
                          src={
                            i.cameraFrame && i.cameraFrame.length
                              ? `data:image/jpeg;base64,${i.cameraFrame}`
                              : require("../../../images/No_Img_Avail.jpg")
                          }
                        />
                      }
                    >
                      <Meta
                        title={
                          <span>
                            <EyeTwoTone className="mb-2" /> &nbsp;{i.cameraName}
                          </span>
                        }
                      />
                    </Card>
                  </div>
                </Col>
              );
            })}
          </Row>
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
const mapStateToprops = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  // heatmap: state.heatmap,
});
export default connect(mapStateToprops)(CoverCameraHeatmap);
