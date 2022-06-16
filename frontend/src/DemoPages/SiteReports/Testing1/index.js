import React from "react";
import {
  Drawer,
  TimePicker,
  DatePicker,
  Radio,
  Select,
  Space,
  Divider,
  Button,
  Table,
  Menu,
  Dropdown,
} from "antd";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import Chart from "react-google-charts";
import "./steps.css";
import Copied from "./pdf";
import Config from "../../../config/Config";
import htmlToImage from "html-to-image";
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";
import { Card } from "reactstrap";
const TimeRange = TimePicker.RangePicker;
const { Option } = Select;
let allCameras = [];
const Column = Table;
class App extends React.Component {
  state = {
    userType: "",
    localBranchId: "",
    localClientId: "",
    visible: false,
    branches: [],
    branch: [],
    cameras: [],
    camera: [],
    radioOption: "day",
    showTime: false,
    date: "",
    time: "",
    month: "",
    week: "",
    showweekTime: false,
    weektime: "",
    tableValues: [],
    dwellTableValues: [],
    pdfLoader: false,
    pdfModal: false,
    modal: false,
    metric: [],
    chartData: [
      ["Hour Wise Data", "Zones"],
      ["0", 0],
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
      ["13", 0],
      ["14", 0],
      ["15", 0],
      ["16", 0],
      ["17", 0],
      ["18", 0],
      ["19", 0],
      ["20", 0],
      ["21", 0],
      ["22", 0],
      ["23", 0],
    ],
    dwellChart: [
      ["Hour Wise Data", "Zones"],
      ["0", 0],
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
      ["13", 0],
      ["14", 0],
      ["15", 0],
      ["16", 0],
      ["17", 0],
      ["18", 0],
      ["19", 0],
      ["20", 0],
      ["21", 0],
      ["22", 0],
      ["23", 0],
    ],
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  noCameraAvail = async () => {
    if (!this.state.camera.length) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  componentDidMount() {
    this.getId();
  }
  handleSizeChange = async (e) => {
    e.preventDefault();
    await this.setState({ radioOption: e.target.value });
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
  getId = async () => {
    const { user } = this.props.auth;
    const { cameras, userType } = this.state;
    await this.setState({ userType: this.props.auth.user.userType });
    if (this.props.auth && user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          cameras: user.camera,
          localBranchId: user.branchId,
          localClientId: user.clientId,
          userType: user.userType,
          metric: ["count", "passerBy"],
        });

        allCameras = user.camera.map((i) => {
          return i.cameraId;
        });
        await this.setState({
          camera: allCameras,
        });
        this.noCameraAvail();
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
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          cameras: this.props.admin.selectedClient.camera,
          localBranchId: this.props.admin.selectedClient.branchId,
          localClientId: this.props.admin.selectedClient.clientId,
          userType: this.props.admin.selectedClient.userType,
        });
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  onDatePickerChange = async (date, dateString) => {
    this.setState({ date: dateString });
  };
  onTimePickerChange = async (time, timeString) => {
    this.setState({ time: timeString });
  };
  onTimeWeekPickerChange = async (time, timeString) => {
    this.setState({ weektime: timeString });
  };
  onWeekChange = async (date, dateString) => {
    this.setState({ week: dateString });
  };
  onMonthChange = async (date, dateString) => {
    this.setState({ month: date._d });
  };
  onAccept = () => {
    const { radioOption } = this.state;
    if (radioOption == "day") {
      this.state.metric.includes("count") && this.getHourlyResult();
      this.state.metric.includes("passerBy") && this.getdwellTimeHourlyResult();
    } else if (radioOption == "week") {
      this.state.metric.includes("count") && this.getWeeklyResult();
      this.state.metric.includes("passerBy") && this.getDwellWeeklyResult();
    } else {
      this.state.metric.includes("count") && this.getMonthResult();
      this.state.metric.includes("passerBy") && this.getDwellMonthResult();
    }
  };
  getHourlyResult = async () => {
    try {
      let res = await axios.post(
        `${Config.hostName}/api/pdf/footfallhourbased/${this.state.localClientId}/${this.state.localBranchId}`,
        { camera: this.state.camera, date: this.state.date }
      );
      if (res.data.length) {
        // this.setState({ dwellTableValues: [], dwellChart: [] });
        await this.chartFormation(res.data);
        await this.tableFormation(res.data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };
  getdwellTimeHourlyResult = async () => {
    try {
      let res = await axios.post(
        `${Config.hostName}/api/pdf/dwellTimehourbased/${this.state.localClientId}/${this.state.localBranchId}`,
        { camera: this.state.camera, date: this.state.date }
      );
      if (res.data.length) {
        // await this.setState({ tableValues: [], chartData: [] });
        await this.dwellChartFormation(res.data);
        await this.dwellTimeTableFormation(res.data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };
  dwellTimeTableFormation = (data) => {
    data.map((i, index) => {
      i.hour = `${i.hour}:00-${i.hour + 1}:00`;
      i.key = index + 1;
      i.TimeSpent = i.TimeSpent.toFixed(2);
    });
    this.setState({ dwellTableValues: data });
  };
  tableFormation = (data) => {
    data.map((i, index) => {
      i.hour = `${i.hour}:00-${i.hour + 1}:00`;
      i.key = index + 1;
    });
    this.setState({ tableValues: data });
  };
  getWeeklyResult = async () => {
    try {
      let res = await axios.post(
        `${Config.hostName}/api/pdf/footfallweekbased/${this.state.localClientId}/${this.state.localBranchId}`,
        { camera: this.state.camera, date: this.state.week }
      );
      if (res.data.length) {
        // this.setState({ dwellTableValues: [], dwellChart: [] });
        this.weeklyTableFormation(res.data);
        this.weeklychartFormation(res.data);
      }
    } catch (error) {}
  };
  getDwellWeeklyResult = async () => {
    try {
      let res = await axios.post(
        `${Config.hostName}/api/pdf/dwellTimeweekbased/${this.state.localClientId}/${this.state.localBranchId}`,
        { camera: this.state.camera, date: this.state.week }
      );
      if (res.data.length) {
        // await this.setState({ tableValues: [], chartData: [] });
        this.dwellWeeklyChartFormation(res.data);
        this.weeklyDwellTableFormation(res.data);
      }
    } catch (error) {}
  };
  weeklyTableFormation = (data) => {
    data.map((i, index) => {
      let date = moment.parseZone(i.Timestamp);
      let format = date.format("LLL");
      i.hour = format;
      i.key = index + 1;
    });
    this.setState({ tableValues: data });
  };
  weeklyDwellTableFormation = (data) => {
    data.map((i, index) => {
      let date = moment.parseZone(i.Timestamp);
      let format = date.format("LLL");
      i.hour = format;
      i.key = index + 1;
      i.TimeSpent = i.TimeSpent.toFixed(2);
    });
    this.setState({ dwellTableValues: data });
  };
  commonManipulation = (filledArray, distinctZones, type) => {
    for (let z = 0; z < filledArray.length; z++) {
      let insideIndexFilledArray = filledArray[z];
      for (let i = 0; i < insideIndexFilledArray.length; i++) {
        for (let j = 0; j < distinctZones.length; j++) {
          if (insideIndexFilledArray[i].zone !== distinctZones[j]) {
          } else {
            var key = insideIndexFilledArray[i].zone,
              obj = {
                [key]: insideIndexFilledArray[i].count,
              };
            insideIndexFilledArray[i] = obj;
          }
        }
      }
    }
    for (let z = 0; z < filledArray.length; z++) {
      let summArray = new Array(distinctZones.length).fill(0);
      var innerArray = filledArray[z];
      for (let i = 0; i < innerArray.length; i++) {
        let innerObject = Object.keys(innerArray[i]);
        for (let j = 0; j < distinctZones.length; j++) {
          if (innerObject[0] === distinctZones[j]) {
            let val = Object.values(innerArray[i]);
            summArray[j] += val[0];
          }
        }
      }
      let daytype = "";
      if (type === "week") {
        switch (z) {
          case 1:
            daytype = "Sunday";
            break;
          case 2:
            daytype = "Monday";
            break;
          case 3:
            daytype = "Tuesday";
            break;
          case 4:
            daytype = "Wednesday";
            break;
          case 5:
            daytype = "Thursday";
            break;
          case 6:
            daytype = "Friday";
            break;
          case 7:
            daytype = "Saturday";
            break;
          default:
            break;
        }
      } else if (type == "hour") {
        switch (z) {
          case 0:
            daytype = "0:00";
            break;
          case 1:
            daytype = "1:00";
            break;
          case 2:
            daytype = "2:00";
            break;
          case 3:
            daytype = "3:00";
            break;
          case 4:
            daytype = "4:00";
            break;
          case 5:
            daytype = "5:00";
            break;
          case 6:
            daytype = "6:00";
            break;
          case 7:
            daytype = "7:00";
            break;
          case 8:
            daytype = "8:00";
            break;
          case 9:
            daytype = "9:00";
            break;
          case 10:
            daytype = "10:00";
            break;
          case 11:
            daytype = "11:00";
            break;
          case 12:
            daytype = "12:00";
            break;
          case 13:
            daytype = "13:00";
            break;
          case 14:
            daytype = "14:00";
            break;
          case 15:
            daytype = "15:00";
            break;
          case 16:
            daytype = "16:00";
            break;
          case 17:
            daytype = "17:00";
            break;
          case 18:
            daytype = "18:00";
            break;
          case 19:
            daytype = "19:00";
            break;
          case 20:
            daytype = "20:00";
            break;
          case 21:
            daytype = "21:00";
            break;
          case 22:
            daytype = "22:00";
            break;
          case 23:
            daytype = "23:00";
            break;
          default:
            break;
        }
      }

      filledArray[z] = [`${daytype.length ? daytype : z}`, ...summArray];
    }
    return filledArray;
  };
  weeklychartFormation = (data) => {
    let filledArray = new Array(7).fill([]);
    let distinctZones = [];
    let set = new Set();
    data.map((i) => {
      set.add(i.zone);
    });
    distinctZones = Array.from(set);
    let tempArr = [];
    for (let i = 0; i < data.length; i++) {
      tempArr = data[i].Day;
      filledArray[tempArr] = [...filledArray[tempArr], data[i]];
    }

    filledArray = this.commonManipulation(filledArray, distinctZones, "week");
    let firstRow = distinctZones;
    firstRow.unshift("Weekly Analysis");
    filledArray[0] = firstRow;
    this.setState({ chartData: filledArray });
  };
  getMonthResult = async () => {
    try {
      let res = await axios.post(
        `${Config.hostName}/api/pdf/footfallmonthbased/${this.state.localClientId}/${this.state.localBranchId}`,
        { camera: this.state.camera, date: this.state.month }
      );
      if (res.data.length) {
        // this.setState({ dwellTableValues: [], dwellChart: [] });
        this.monthlyChartFormation(res.data);
        this.weeklyTableFormation(res.data);
      }
    } catch (error) {}
  };
  getDwellMonthResult = async () => {
    try {
      let res = await axios.post(
        `${Config.hostName}/api/pdf/dwellTimemonthbased/${this.state.localClientId}/${this.state.localBranchId}`,
        { camera: this.state.camera, date: this.state.month }
      );
      if (res.data.length) {
        // await this.setState({ tableValues: [], chartData: [] });
        this.dwellMonthlyChartFormation(res.data);
        this.weeklyDwellTableFormation(res.data);
      }
    } catch (error) {}
  };
  chartFormation = (data) => {
    let distinctZones = [];
    let set = new Set();
    data.map((i) => {
      set.add(i.zone);
    });
    distinctZones = Array.from(set);
    let tempArr = [];
    let filledArray = new Array(24).fill([]);
    for (let i = 0; i < data.length; i++) {
      tempArr = data[i].hour;
      filledArray[tempArr] = [...filledArray[tempArr], data[i]];
    }
    filledArray = this.commonManipulation(filledArray, distinctZones, "hour");
    let firstRow = ["Hour Wise Analysis", ...distinctZones];
    filledArray.unshift(firstRow);
    this.setState({ chartData: filledArray });
  };
  dwellChartFormation = (data) => {
    let distinctZones = [];
    let set = new Set();
    data.map((i) => {
      set.add(i.zone);
    });
    for (let i = 0; i < data.length; i++) {
      data[i].noOfPasser = data[i].count;
      data[i].count = data[i].TimeSpent.toFixed(2);
    }
    distinctZones = Array.from(set);
    let tempArr = [];
    let filledArray = new Array(24).fill([]);
    for (let i = 0; i < data.length; i++) {
      tempArr = data[i].hour;
      filledArray[tempArr] = [...filledArray[tempArr], data[i]];
    }
    filledArray = this.commonManipulation(filledArray, distinctZones, "hour");
    let firstRow = distinctZones;
    firstRow.unshift("Hour Wise Analysis");
    filledArray[0] = firstRow;
    this.setState({ dwellChart: filledArray });
  };
  dwellWeeklyChartFormation = (data) => {
    let distinctZones = [];
    let set = new Set();
    data.map((i) => {
      set.add(i.zone);
    });
    for (let i = 0; i < data.length; i++) {
      data[i].noOfPasser = data[i].count;
      data[i].count = data[i].TimeSpent.toFixed(2);
    }
    distinctZones = Array.from(set);
    let filledArray = new Array(7).fill([]);
    let tempArr = [];
    for (let i = 0; i < data.length; i++) {
      tempArr = data[i].Day;
      filledArray[tempArr] = [...filledArray[tempArr], data[i]];
    }
    filledArray = this.commonManipulation(filledArray, distinctZones, "week");
    let firstRow = distinctZones;
    firstRow.unshift("Weekly Analysis");
    filledArray[0] = firstRow;
    this.setState({ dwellChart: filledArray });
  };
  monthlyChartFormation = (data) => {
    let filledArray = new Array(32).fill([]);
    let distinctZones = [];
    let set = new Set();
    data.map((i) => {
      set.add(i.zone);
    });
    distinctZones = Array.from(set);
    let tempArr = [];
    for (let i = 0; i < data.length; i++) {
      let formattedDate = moment(data[i].Timestamp).format("llll");
      let arr = formattedDate.split(" ");
      tempArr = JSON.parse(arr[2].replace(",", ""));
      filledArray[tempArr] = [...filledArray[tempArr], data[i]];
    }

    filledArray = this.commonManipulation(filledArray, distinctZones, "month");
    let firstRow = distinctZones;
    firstRow.unshift("Monthly Analysis");
    filledArray[0] = firstRow;
    this.setState({ chartData: filledArray });
  };
  dwellMonthlyChartFormation = (data) => {
    let filledArray = new Array(32).fill([]);
    let distinctZones = [];
    let set = new Set();
    data.map((i) => {
      set.add(i.zone);
    });
    for (let i = 0; i < data.length; i++) {
      data[i].noOfPasser = data[i].count;
      data[i].count = JSON.parse(data[i].TimeSpent.toFixed(2));
    }
    distinctZones = Array.from(set);
    let tempArr = [];
    for (let i = 0; i < data.length; i++) {
      let formattedDate = moment(data[i].Timestamp).format("llll");
      let arr = formattedDate.split(" ");
      tempArr = JSON.parse(arr[2].replace(",", ""));
      filledArray[tempArr] = [...filledArray[tempArr], data[i]];
    }
    filledArray = this.commonManipulation(filledArray, distinctZones, "month");
    let firstRow = distinctZones;
    firstRow.unshift("Monthly Analysis");
    filledArray[0] = firstRow;
    this.setState({ dwellChart: filledArray });
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
    this.noCameraAvail();
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
  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    this.noCameraAvail();
  };
  ReportHandling = async () => {
    if (
      this.state.metric.includes("count") &&
      this.state.metric.includes("passerBy")
    ) {
      await htmlToImage
        .toPng(document.getElementById("footfallchart"), {
          backgroundColor: "white",
        })
        .then(async (dataUrl) => {
          await this.setState({
            url: { first: dataUrl },
            // pdfLoader: !this.state.pdfLoader,
          });
        });
      await htmlToImage
        .toPng(document.getElementById("dwellTimechart"), {
          backgroundColor: "white",
        })
        .then(async (dataUrl) => {
          let obj = {};
          obj.first = this.state.url.first;
          obj.second = dataUrl;
          await this.setState({
            url: obj,
            pdfLoader: !this.state.pdfLoader,
          });
        });
    } else if (this.state.metric.includes("count")) {
      await htmlToImage
        .toPng(document.getElementById("footfallchart"), {
          backgroundColor: "white",
        })
        .then(async (dataUrl) => {
          await this.setState({
            url: { first: dataUrl },
            pdfLoader: !this.state.pdfLoader,
          });
        });
    } else if (this.state.metric.includes("passerBy")) {
      await htmlToImage
        .toPng(document.getElementById("dwellTimechart"), {
          backgroundColor: "white",
        })
        .then(async (dataUrl) => {
          let obj = {};
          // obj.first = "";
          obj.second = dataUrl;
          await this.setState({
            url: obj,
            pdfLoader: !this.state.pdfLoader,
          });
        });
    }
  };
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <Button
            onClick={async () => {
              this.ReportHandling();
            }}
            style={{
              backgroundColor: "white",
              border: "1px solid white",
            }}
          >
            PDF
          </Button>
        </Menu.Item>
      </Menu>
    );

    const { branches, camera } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );
    return (
      <div className="site-drawer-render-in-current-wrapper">
        {this.state.pdfLoader && (
          <Copied
            footfalldata={this.state.tableValues}
            url={this.state.url}
            dwelldata={this.state.dwellTableValues}
          />
        )}
        {this.state.metric.includes("count") && (
          <Card style={{ maxWidth: "980px" }}>
            <h3
              className="pt-2 pb-2"
              style={{
                textAlign: "center",
                width: "400px",
                margin: "0 auto",
                marginTop: "4px",
              }}
            >
              FOOTFALL ANALYSIS
            </h3>{" "}
            <Card
              id="footfallchart"
              style={{ maxWidth: "980px", padding: "5px" }}
            >
              <Chart
                width={"960px"}
                height={"350px"}
                chartType="AreaChart"
                // chartType={!this.state.barChart ? "Bar" : "AreaChart"}
                loader={<div>Loading Chart</div>}
                data={this.state.chartData}
                options={{
                  chart: {
                    title: "Person Count in different Zone",
                    subtitle:
                      "Comparison of different Zones in a Hourly/Weekly/Monthly",
                  },
                }}
                // For tests
                rootProps={{ "data-testid": "2" }}
              />
            </Card>
            <Card>
              <Table
                className="mt-4"
                style={{ maxWidth: 980 }}
                id="my-table"
                dataSource={this.state.tableValues}
              >
                <Column title="Serial No." dataIndex="key" key="key" />
                <Column title="Time" dataIndex="hour" key="hour" />
                <Column title="Zone" dataIndex="zone" key="zone" />
                <Column title="Total Visitors" dataIndex="count" key="count" />
              </Table>
            </Card>{" "}
          </Card>
        )}
        <Divider />
        {this.state.metric.includes("passerBy") && (
          <Card style={{ maxWidth: "980px" }}>
            <h3
              className="pt-2 pb-2"
              style={{
                textAlign: "center",
                width: "400px",
                margin: "0 auto",
                marginTop: "5px",
              }}
            >
              DWELL TIME ANALYSIS
            </h3>{" "}
            <Card
              id="dwellTimechart"
              style={{ maxWidth: "980px", padding: "4px" }}
            >
              <Chart
                width={"960px"}
                height={"350px"}
                chartType="AreaChart"
                // chartType="Bar"
                loader={<div>Loading Chart</div>}
                data={this.state.dwellChart}
                options={{
                  chart: {
                    title: "Average Time Spent in different Zone",
                    subtitle:
                      "Comparison of different Zones in a Hourly/Weekly/Monthly",
                  },
                }}
                // For tests
                rootProps={{ "data-testid": "2" }}
              />
            </Card>
            <Card>
              {" "}
              <Table
                className="mt-4"
                style={{ maxWidth: 980 }}
                id="my-table"
                dataSource={this.state.dwellTableValues}
              >
                <Column title="Serial No." dataIndex="key" key="key" />
                <Column title="Time" dataIndex="hour" key="hour" />
                <Column title="Zone" dataIndex="zone" key="zone" />
                {/* <Column title="PersonID" dataIndex="PersonID" key="PersonID" /> */}
                <Column
                  title="Avg. Engagement Duration (ms)"
                  dataIndex="TimeSpent"
                  key="TimeSpent"
                />
                <Column
                  title="No Of Passers-By"
                  dataIndex="noOfPasser"
                  key="noOfPasser"
                />
              </Table>
            </Card>
          </Card>
        )}{" "}
        <Drawer
          title="Basic Drawer"
          placement="right"
          visible={true}
          getContainer={false}
        >
          <Space direction="vertical" className="ml-2">
            <div className="row" style={{ maxWidth: 760 }}>
              <div className="col">
                <Dropdown.Button
                  className="mr-5"
                  style={{ float: "right" }}
                  shape="round"
                  type="primary"
                  overlay={menu}
                  icon={<DownloadOutlined />}
                >
                  Download Metrics
                </Dropdown.Button>
              </div>
            </div>

            <div className="form-group row ">
              <p className="font-weight-bold">Branch</p>
              <Select
                // mode="multiple"
                defaultValue="Select Branch"
                value={this.state.localBranchId}
                style={{ width: "100%" }}
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
            </div>
            <Divider />
            <div className="form-group row">
              <p className="font-weight-bold">Camera</p>
              <Select
                mode="multiple"
                value={this.state.camera}
                style={{ width: "100%" }}
                onChange={this.cameraHandleChange}
              >
                {filteredOptions.map((item, index) => (
                  <Select.Option key={index} value={`${item.cameraId}`}>
                    {`${item.cameraName}`}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Divider />
            <div className="form-group row">
              <p className="font-weight-bold"> Metric</p>
              <Select
                mode="multiple"
                value={this.state.metric}
                style={{ width: "100%" }}
                onChange={(val) => {
                  this.setState({ metric: val });
                }}
                // defaultValue=
              >
                <Option value="count">Visitor Count</Option>
                <Option value="passerBy">Passers By</Option>
              </Select>
            </div>
            <div className="form-group row">
              <p className="font-weight-bold mb-n2">Date</p>
            </div>
            {this.state.radioOption == "day" && (
              <div className="form-group row">
                <div>
                  <DatePicker
                    className="p-2 m-2 mr-4"
                    onChange={this.onDatePickerChange}
                  />
                  {/* <Switch
                    unCheckedChildren={<ClockCircleOutlined />}
                    onChange={async (checked) => {
                      await this.setState({ showTime: checked });
                    }}
                  ></Switch> */}
                  <br />
                  {this.state.showTime && (
                    <TimeRange
                      className="m-2"
                      onChange={this.onTimePickerChange}
                    />
                  )}
                </div>
              </div>
            )}
            {this.state.radioOption == "week" && (
              <div className="form-group row">
                <DatePicker
                  className="p-2 m-2 mr-4"
                  onChange={this.onWeekChange}
                  picker="week"
                />
                {/* <Switch
                  className="mt-4"
                  unCheckedChildren={<ClockCircleOutlined />}
                  onChange={async () => {
                    await this.setState({ showweekTime: !this.state.showTime });
                  }}
                ></Switch>
                <br />
                {this.state.showweekTime && (
                  <TimeRange
                    className="m-2"
                    onChange={this.onTimeWeekPickerChange}
                  />
                )} */}
              </div>
            )}
            {this.state.radioOption == "month" && (
              <div className="form-group row">
                <DatePicker onChange={this.onMonthChange} picker="month" />
              </div>
            )}

            <div className="form-group row ">
              <Radio.Group defaultValue="day" onChange={this.handleSizeChange}>
                <Radio.Button value="day">Day</Radio.Button>
                <Radio.Button value="week">Week</Radio.Button>
                <Radio.Button value="month">Month</Radio.Button>
              </Radio.Group>
            </div>
          </Space>
          <div className="mt-5">
            <Button className="m-1" type="primary" onClick={this.onAccept}>
              Apply
            </Button>
            <Button className="m-1" type="secondary">
              Cancel
            </Button>
          </div>{" "}
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  footfall: state.footfall,
});
export default connect(mapStateToProps, {})(App);
