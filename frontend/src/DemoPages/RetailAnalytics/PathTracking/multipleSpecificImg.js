import React, { Component, Fragment } from "react";
import Config from "../../../config/Config";
import { Stage, Layer, Circle, Text, Line, Arrow, Spin } from "react-konva";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import htmlToImage from "html-to-image";
import axios from "axios";
import moment from "moment";
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
    url: "",
    camera: "",
    startTime: "",
    endTime: "",
    recievingStamps: false,
    count: 0,
    pdfImages: [],
    blocked: false,
    uniqueImpressionLen: 0,
    mergedTempArr: [],
  };
  ReportHandling = async (time, len) => {
    await htmlToImage
      .toPng(document.getElementById("my-node"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        let obj = {};
        obj.img = dataUrl;
        obj.time = time;
        await this.setState({
          url: [...this.state.url, obj],
          mergedData: [],
        });
        console.log("url", this.state.url);
        if (this.state.uniqueImpressionLen == len) {
          this.props.pdfImages(this.state.url);
        }
      });
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
        // await this.getPathTracking(user.clientId);

        // await this.getMergedArray();
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
      });
      await this.getArrow(user.clientId);
      //   await this.getPathTracking(user.clientId);

      // this.getMergedArray();
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
          localBranchId: this.props.admin.selectedClient.branchId,
          userType: this.props.admin.selectedClient.userType,
        });
        // await this.getPathTracking(this.props.admin.selectedClient.clientId);

        await this.getArrow(this.props.admin.selectedClient.branchId);
        // this.getMergedArray();
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
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
  getMergedArray = async () => {
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
      await this.setState({ mergedTempArr: merged });
    }
  };
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
          //   await this.getMergedArray();
          await this.setState({ recievingStamps: false });
        });
    } catch (err) {
      await this.setState({ recievingStamps: false });
      console.log("server err", err);
    }
  };
  async componentWillMount() {
    await this.setState({
      data: this.props.impressions,
      camera: this.props.selectedCamera,
    });
    await this.getId();
    await this.getMergedArray();
    let formattedDate = {},
      tempArr = [];
    for (let i = 0; i < this.state.mergedTempArr.length; i++) {
      formattedDate = moment(this.state.mergedTempArr[i].Timestamp).format(
        "LL"
      );
      if (!tempArr.includes(formattedDate)) tempArr.push(formattedDate);
    }
    await this.setState({ uniqueImpressionLen: tempArr.length });
    let wholeImpression = this.state.mergedTempArr;
    for (let i = 0; i < tempArr.length; i++) {
      let oneDate = [];
      for (let j = 0; j < wholeImpression.length; j++) {
        formattedDate = moment(wholeImpression[j].Timestamp).format("LL");
        if (formattedDate == tempArr[i]) oneDate.push(wholeImpression[j]);
      }
      await this.setState({ mergedData: oneDate });
      console.log("this.prop", this.state.mergedData, this.state.arrow);
      await this.ReportHandling(tempArr[i], i + 1);
    }
  }
  rangePicker = async (dates, dateStrings) => {
    await this.setState({ dates });
    this.onDateChange(this.state.localClientId);
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
    // this.state.startTime.length &&
    //   this.state.endTime.length &&
    //   (await this.getPathTracking(this.state.localClientId));
    // await this.getMergedArray();
  };
  onEndChange = async (time, dateString) => {
    let timeFormat = dateString + ".000";
    await this.setState({ endTime: timeFormat });
    // this.state.startTime.length &&
    //   this.state.endTime.length &&
    //   this.getPathTracking(this.state.localClientId);
  };
  render() {
    let imgData = localStorage.getItem("imgData");
    const { loading, cameras, branches } = this.state;

    return (
      <Fragment>
        <div className="row scrollable-container">
          <Tooltip placement="topLeft" title="From (hh:mm:ss) : To (hh:mm:ss)">
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
          {/* {this.state.recievingStamps && <Loader />} */}
        </div>

        <div
          id="my-node"
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
                          let txt = `${i.Impressions}`;
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
