import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import h337 from "heatmap.js";
import { Dropdown, Tooltip, TimePicker, Menu } from "antd";
import { FrownOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
// import Pusher from "pusher-js";
import moment from "moment";
import io from "socket.io-client";
import Config from "../../../../config/Config";
import { Select, Tag } from "antd";
import Loader from "react-loaders";
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";
import htmlToImage from "html-to-image";
// import Copied from "./pdfFile";
var heatmapInstance = {};
let imgData = "";
const { Option } = Select;
class Heatmap extends React.Component {
  state = {
    radius: 50,
    opacity: 30,
    people: [],
    localClientId: "",
    localBranchId: "",
    userType: "",
    camera: [],
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
    clientCameras: [],
    isImagesFetched: false,
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
    await this.setState({ _isMount: true });
    await this.setState({ impressions: this.props.impressions });
    if (this.state.impressions && this.state.impressions.length)
      await this.createInstanceOnce();
    let arr = [];

    for (let i = 0; i < this.state.impressions.length; i++) {
      imgData = this.state.impressions[i].cameraFrame;
      this.state.impressions[i].Coordinates.map((i) => {
        let obj = {};
        obj.x = i.x;
        obj.y = i.y;
        arr.push(obj);
      });
      await this.setState({ people: arr, loader: false });
      let time = this.props.impressions[i].Timestamp.split("T")[0];
      time = `${time}T00:00:00.000Z`;
      time = new Date(time);
      let formattedDate = moment(time).format("LL");
      await this.HeatMap(formattedDate);
    }
  }

  componentWillUnmount() {
    this.setState({ _isMount: false });
  }
  async componentDidMount() {
    // await this.getId();
  }
  getUserBranchFromProps = async () => {
    const { user } = this.props.auth;
    await this.setState({
      branches: user.camera,
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
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
      });
      await this.getUserBranchFromProps();
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          userType: this.props.admin.selectedClient.userType,
          localClientId: this.props.admin.selectedClient.clientId,
        });
        if (!this.state.camera.length && this.state.cameras.length)
          await this.setState({ camera: this.state.cameras[0].cameraId });
        this.getCameraConfig(
          this.state.localClientId,
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
  render() {
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
        <div className="row">
          <div className="col">
            <Tooltip
              placement="topLeft"
              title="From (hh:mm:ss) : To (hh:mm:ss)"
            >
              <InfoCircleOutlined className=" mr-1 mb-2" />
            </Tooltip>{" "}
          </div>
          <div>{this.state.loader && <Loader />}</div>
          {/* <div className="col">
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
          </div> */}
        </div>
        <div className="row">
          <div
            id="my-node"
            className="App"
            style={{
              backgroundRepeat: "no-repeat",
              height: window.innerHeight,
              width: window.innerWidth,
              backgroundImage:
                //   imgData
                // ?
                `url(${`data:image/jpeg;base64,${imgData}`})`,
              // : `url(${require("../../../images/No_Img_Avail.jpg")})`,
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
