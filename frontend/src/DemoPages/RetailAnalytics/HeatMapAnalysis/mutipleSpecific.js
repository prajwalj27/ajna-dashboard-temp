import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import h337 from "heatmap.js";
import { Dropdown, Tooltip, TimePicker, Menu } from "antd";
import { FrownOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
// import Pusher from "pusher-js";
import moment from "moment";
import io from "socket.io-client";
import Config from "../../../config/Config";
import { Select, Tag } from "antd";
import Loader from "react-loaders";
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";
import htmlToImage from "html-to-image";
import Copied from "./pdfFile";
var heatmapInstance = {};

const { Option } = Select;
class Heatmap extends React.Component {
  state = {
    radius: 50,
    opacity: 30,
    people: [],
    localClientId: "",
    localBranchId: "",
    userType: "",
    camera: "",
    cameras: [],
    branches: [],
    fetchedImage: "",
    alertMessage: "",
    date: "",
    startTime: "",
    endTime: "",
    loader: false,
    _isMount: false,
    url: "",
    pdfLoader: false,
    pdfImages: [],
    impressions: [],
    count: 0,
  };
  ReportHandling = async (time) => {
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
          count: this.state.count + 1,
          //   pdfLoader: !this.state.pdfLoader,
        });
        if (this.state.count == this.state.impressions.length)
          this.props.pdfImages(this.state.url);
      });
  };
  async componentWillMount() {
    this.setState({ _isMount: true });
  }
  componentWillUnmount() {
    this.setState({ _isMount: false });
  }
  async componentDidMount() {
    let arr = [];
    await this.setState({ impressions: this.props.impressions });
    await this.createInstanceOnce();
    for (let i = 0; i < this.state.impressions.length; i++) {
      this.props.impressions[i].Coordinates.map((i) => {
        let obj = {};
        obj.x = i.x;
        obj.y = i.y;
        arr.push(obj);
      });
      await this.setState({ people: arr, loader: false });
      let formattedDate = moment(this.props.impressions[i].Timestamp).format(
        "LL"
      );
      await this.HeatMap(formattedDate);
    }

    // await this.getId();
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
          userType: user.userType,
          localBranchId: user.branchId,
        });

        await this.fetchData(user.branchId, user.userType, this.state.camera);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
      });
      await this.getUserBranchFromProps();
      await this.fetchData(
        this.state.localBranchId,
        this.state.userType,
        this.state.camera
      );
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          userType: this.props.admin.selectedClient.userType,
          localClientId: this.props.admin.selectedClient.clientId,
          cameras: this.props.admin.selectedClient.camera,
        });
        if (!this.state.camera.length && this.state.cameras.length)
          await this.setState({ camera: this.state.cameras[0].cameraId });
        this.getCameraConfig(
          this.state.localClientId,
          this.state.userType,
          this.state.camera
        );
        // getCameraConfig(props.admin.selectedClient.clientId);
        this.fetchData(
          this.props.admin.selectedClient.branchId,
          this.state.userType,
          this.state.camera
        );
      } else {
      }
    }
  };
  createInstanceOnce = () => {
    heatmapInstance = h337.create({
      // only container is required, the rest will be defaults
      container: document.querySelector(".App"),
      opacity: 0.3,
      //   radius: 9,
    });
  };
  HeatMap = async (time) => {
    // now generate some random data
    var points = [];
    var max = 0;
    var width = 840;
    var height = 400;
    var len = 200;
    let filteredList = [
      ...new Map(
        this.state.people.map((obj) => [`${obj.x}:${obj.y}`, obj])
      ).values(),
    ];
    var points = Object.assign(filteredList);
    let value = [];
    for (let i = 0; i < filteredList.length; i++) {
      var reducedArray = this.state.people.reduce(function (n, person) {
        return (
          n + (person.x == filteredList[i].x && person.y == filteredList[i].y)
        );
      }, 0);
      value.push(reducedArray);
    }
    for (let i = 0; i < points.length; i++) {
      points[i].val = value[i];
      max = Math.max(max, points[i].val);
    }

    var data = {
      max: max,
      data: points,
    };
    heatmapInstance.setData(data);
    await this.ReportHandling(time);
  };
  onStartChange = async (time, dateString) => {
    let timeFormat = dateString + ".000";
    await this.setState({ startTime: timeFormat });
    this.state.startTime.length &&
      this.state.endTime.length &&
      this.fetchData(
        this.state.localBranchId,
        this.state.userType,
        this.state.camera
      );
  };
  onEndChange = async (time, dateString) => {
    let timeFormat = dateString + ".000";
    await this.setState({ endTime: timeFormat });
    this.state.startTime.length &&
      this.state.endTime.length &&
      this.fetchData(
        this.state.localBranchId,
        this.state.userType,
        this.state.camera
      );
  };
  render() {
    let imgData = localStorage.getItem("imgData");
    // let imgData = localStorage.getItem("imgData");
    const menu = (
      <Menu>
        <Menu.Item>
          <button
            onClick={this.ReportHandling}
            style={{
              backgroundColor: "white",
              border: "1px solid white",
            }}
          >
            PDF
          </button>
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        {this.state.pdfLoader && <Copied url={this.state.url} />}
        <div className="row">
          <div className="col">
            <Tooltip
              placement="topLeft"
              title="From (hh:mm:ss) : To (hh:mm:ss)"
            >
              <InfoCircleOutlined className=" mr-1 mb-2" />
            </Tooltip>{" "}
            <TimePicker
              onChange={this.onStartChange}
              style={{ border: "none", borderBottom: "groove" }}
            />{" "}
            <TimePicker
              onChange={this.onEndChange}
              style={{ border: "none", borderBottom: "groove" }}
            />{" "}
          </div>
          <div>{this.state.loader && <Loader />}</div>
          <div className="col">
            <Dropdown.Button
              style={{ float: "right" }}
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
              Download
            </Dropdown.Button>
          </div>
        </div>
        <div className="row">
          <div
            id="my-node"
            className="App"
            style={{
              backgroundRepeat: "no-repeat",
              height: window.innerHeight,
              width: window.innerWidth,
              backgroundImage: imgData
                ? `url(${`data:image/jpeg;base64,${imgData}`})`
                : `url(${require("../../../images/No_Img_Avail.jpg")})`,
            }}
          ></div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(Heatmap);
