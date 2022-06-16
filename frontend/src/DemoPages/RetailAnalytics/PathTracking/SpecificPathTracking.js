import React, { Component, Fragment } from "react";
import { Alert, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Config from "../../../config/Config";
import { Stage, Layer, Circle, Text, Line, Arrow, Spin } from "react-konva";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Loader from "react-loaders";
import { Tooltip, TimePicker, DatePicker, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import io from "socket.io-client";

class PathTracking extends Component {
  state = {
    localClientId: "",
    localBranchId: "",
    userType: "",
    todayContact: [],
    data: [],
    modal: false,
    modalImage: true,
    loading: true,
    arrow: [],
    mergedData: [],
    fetchedImage: "",
    branches: [],
    cameras: [],
    dates: [],
    camera: "",
    startTime: "",
    endTime: "",
    recievingStamps: false,
  };
  getUserBranchFromProps = async () => {
    const { user } = this.props.auth;
    await this.setState({
      branches: user.camera,
      cameras: user.camera[0].cameras[0],
      localBranchId: user.camera[0].branchId,
    });
  };
  getArrow = async (id) => {
    const { user } = this.props.auth;
    try {
      await axios
        .get(
          `${Config.hostName}/api/branch/configurepath/${id}/${user.userType}/${this.state.camera}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-auth-token": this.props.auth.token,
            },
          }
        )
        .then(async (res) => {
          res.data &&
            (await this.setState({
              arrow: res.data,
            }));
        });
    } catch (error) {
      console.log("path tracked error", error);
    }
  };
  getId = async () => {
    const { user } = this.props.auth;
    if (user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          localClientId: user.clientId,
          localBranchId: user.branchId,
          userType: user.userType,
          // cameras: user.camera,
        });

        await this.getArrow(user.branchId);
        await this.getPathTracking(user.clientId);

        // await this.getMergedArray();
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      this.getUserBranchFromProps();
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
      });
      await this.getArrow(user.clientId);
      await this.getPathTracking(user.clientId);

      // this.getMergedArray();
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
          localBranchId: this.props.admin.selectedClient.branchId,
          userType: this.props.admin.selectedClient.userType,
        });
        await this.getPathTracking(this.props.admin.selectedClient.clientId);

        await this.getArrow(this.props.admin.selectedClient.branchId);
        // this.getMergedArray();
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };

  getMergedArray = async () => {
    console.log("arrow", this.state.arrow);
    if (this.state.data.length) {
      let data = this.state.data,
        datascd = this.state.arrow;
      let merged = [];
      for (let i = 0; i < data.length; i++) {
        merged.push({
          ...data[i],
          ...datascd.find((itmInner) => itmInner.zone === data[i].zone),
        });
      }
      await this.setState({ mergedData: merged });
      console.log("merged data", this.state.mergedData);
    }
  };
  async componentDidMount() {
    await this.getId();

    const socket = io(`${Config.hostName}/api/socket`, {
      pingInterval: 60000,
      pingTimeout: 180000,
      cookie: false,
      origins: "*:*",
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
    });
    socket.on("insertPathTracking", (data) => {});
    socket.on("deletePathTracking", (data) => {});
    socket.on("updatePathTracking", (data) => {});
  }
  getPathTracking = async (id) => {
    const { userType, camera, date } = this.state;
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    try {
      let newDate = convertUTCDateToLocalDate(
        new Date(this.state.date)
      ).toISOString();
      await this.setState({ recievingStamps: true });
      await axios
        .post(
          `${Config.hostName}/api/path-tracking/dates/${id}/${userType}`,
          {
            date: newDate,
            start: this.state.startTime,
            end: this.state.endTime,
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
        .then(async (res) => {
          res.data.length && (await this.setState({ data: res.data }));
          await this.getMergedArray();
          await this.setState({ recievingStamps: false });
        });
    } catch (err) {
      await this.setState({ recievingStamps: false });
      console.log("server err", err);
    }
  };
  async componentWillMount() {
    setTimeout(() => this.setState({ loading: false }), 1500);
    await this.setState({
      date: this.props.selectedDate.val,
      camera: this.props.selectedCamera,
    });
  }
  rangePicker = async (dates, dateStrings) => {
    // this.setState({ pdfLoader: false });
    await this.setState({ dates });
    this.onDateChange(this.state.localClientId);
    // this.getDateSelectionCount(this.props.auth.user.clientId)
  };
  onDateChange = async (id) => {
    try {
      await axios
        .post(
          Config.hostName + `/api/path-tracking/dates/` + id,
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
  onStartChange = async (time, dateString) => {
    let timeFormat = dateString + ".000";
    await this.setState({ startTime: timeFormat });
    this.state.startTime.length &&
      this.state.endTime.length &&
      (await this.getPathTracking(this.state.localClientId));
    // await this.getMergedArray();
  };
  onEndChange = async (time, dateString) => {
    let timeFormat = dateString + ".000";
    await this.setState({ endTime: timeFormat });
    this.state.startTime.length &&
      this.state.endTime.length &&
      this.getPathTracking(this.state.localClientId);
  };
  render() {
    let imgData = localStorage.getItem("imgData");
    const { loading, cameras, branches } = this.state;
    if (this.state.localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <Fragment>
          <div className="row scrollable-container">
            <Tooltip
              placement="topLeft"
              title="From (hh:mm:ss) : To (hh:mm:ss)"
            >
              <InfoCircleOutlined className=" mr-1 mb-2 mt-2 ml-2" />
            </Tooltip>{" "}
            <TimePicker
              style={{ border: "none", borderBottom: "groove" }}
              // className="ml-1"
              onChange={this.onStartChange}
            />{" "}
            <TimePicker
              style={{ border: "none", borderBottom: "groove" }}
              onChange={this.onEndChange}
            />{" "}
            {this.state.recievingStamps && <Loader />}
          </div>

          <div
            className="container"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundImage: imgData
                ? `url(${`data:image/jpeg;base64,${imgData}`})`
                : `url(${require("../../../images/No_Img_Avail.jpg")})`,
            }}
          >
            {this.state.mergedData.length &&
              this.state.arrow.length &&
              this.state.data.length && (
                <Stage width={window.innerWidth} height={window.innerHeight}>
                  <Layer>
                    {this.state.arrow.length &&
                      this.state.arrow.map((i, index) => {
                        let point = i.points;
                        return (
                          <Arrow
                            key={index}
                            points={[point[0], point[1], point[2], point[3]]}
                            stroke="black"
                            strokeWidth={10}
                          ></Arrow>
                        );
                      })}
                    {this.state.data.length &&
                    this.state.mergedData.length &&
                    this.state.arrow.length
                      ? this.state.mergedData.map((i, index) => {
                          if (i.points && i.points.length) {
                            let point = i.points;
                            let X = point[0] + 10;
                            let Y = point[1] + 10;
                            let txt = `${i.PersonTimestamps}`;
                            return (
                              <>
                                <Text
                                  key={index}
                                  fontSize={25}
                                  fontStyle="bold"
                                  fontFamily="poppins"
                                  x={X}
                                  y={Y}
                                  text={
                                    txt && txt.length > 0
                                      ? `${txt}-${i.zone}`
                                      : "0"
                                  }
                                  ellipsis={true}
                                />
                              </>
                            );
                          }
                        })
                      : null}
                  </Layer>
                </Stage>
              )}
          </div>
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
PathTracking.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(PathTracking);
