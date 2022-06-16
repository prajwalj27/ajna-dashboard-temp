import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { DownloadOutlined } from "@ant-design/icons";
import Copied from "./pdf";
import moment from "moment";
import {
  Drawer,
  TimePicker,
  DatePicker,
  Select,
  Space,
  Divider,
  Switch,
  Button,
  Menu,
  Dropdown,
} from "antd";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Chart from "react-google-charts";
import { setEnableClosedSidebar } from "../../../reducers/ThemeOptions";
import Config from "../../../config/Config";
import htmlToImage from "html-to-image";
import axios from "axios";
import "./index.css";
import { Card, CardHeader } from "reactstrap";
let mon = 0,
  yr = 0,
  firstZone = "",
  firstBranch = "",
  secondBranch = "",
  secondZone = "",
  varweekday = [],
  varweekends = [];
const TimeRange = TimePicker.RangePicker;
const { Option } = Select;
let allCameras = [];
let samplelabels = [];
class Comparison extends React.Component {
  state = {
    userType: "",
    localBranchId: "",
    localClientId: "",
    branches: [],
    branch: [],
    cameras: [],
    camera: [],
    showTime: false,
    date: "",
    time: "",
    month: "",
    week: "",
    year: "",
    visible: false,
    weekdays: [
      ["Hour Based", "Visitors"],
      ["0:00", 0],
      ["1:00", 0],
      ["2:00", 0],
      ["3:00", 0],
      ["4:00", 0],
      ["5:00", 0],
      ["6:00", 0],
      ["7:00", 0],
      ["8:00", 0],
      ["9:00", 0],
      ["10:00", 0],
      ["11:00", 0],
      ["12:00", 0],
      ["13:00", 0],
      ["14:00", 0],
      ["15:00", 0],
      ["16:00", 0],
      ["17:00", 0],
      ["18:00", 0],
      ["19:00", 0],
      ["20:00", 0],
      ["21:00", 0],
      ["22:00", 0],
      ["23:00", 0],
    ],
    weekends: [
      ["Hour Based", "Visitors"],
      ["0:00", 0],
      ["1:00", 0],
      ["2:00", 0],
      ["3:00", 0],
      ["4:00", 0],
      ["5:00", 0],
      ["6:00", 0],
      ["7:00", 0],
      ["8:00", 0],
      ["9:00", 0],
      ["10:00", 0],
      ["11:00", 0],
      ["12:00", 0],
      ["13:00", 0],
      ["14:00", 0],
      ["15:00", 0],
      ["16:00", 0],
      ["17:00", 0],
      ["18:00", 0],
      ["19:00", 0],
      ["20:00", 0],
      ["21:00", 0],
      ["22:00", 0],
      ["23:00", 0],
    ],
    comparison: false,
    distinctZones: [],
    firstBranchZones: [],
    secondBranchZones: [],
    firstZone: "",
    secondZone: "",
    firstBranch: "",
    secondBranch: "",
    series: [],
    lboptions: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      // title: {
      //   text: "Total Visitors ",
      // },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        "01 Jan 2001",
        "02 Feb 2001",
        "03 Feb 2001",
        "04 Feb 2001",
        "05 Feb 2001",
        "06 Feb 2001",
        "07 Feb 2001",
        "08 Feb 2001",
        "09 Feb 2001",
        "10 Feb 2001",
        "11 Feb 2001",
        "12 Feb 2001",
        "13 Feb 2001",
        "14 Feb 2001",
        "15 Feb 2001",
        "16 Feb 2001",
        "17 Feb 2001",
        "18 Feb 2001",
        "19 Feb 2001",
        "20 Feb 2001",
        "21 Feb 2001",
        "22 Feb 2001",
        "23 Feb 2001",
        "24 Feb 2001",
        "25 Feb 2001",
        "26 Feb 2001",
        "27 Feb 2001",
        "28 Feb 2001",
        "29 Feb 2001",
        "30 Feb 2001",
        "31 Feb 2001",
      ],
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: `${firstZone}`,
          },
        },
        {
          opposite: true,
          title: {
            text: `${secondZone}`,
          },
        },
      ],
    },
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      // title: {
      //   text: "Total Visitors ",
      // },
      labels: [],
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: `${firstZone}`,
          },
        },
        {
          opposite: true,
          title: {
            text: `${secondZone}`,
          },
        },
      ],
    },
    url: {},
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
  onWeekChange = async (date, dateString) => {
    this.setState({ week: dateString });
  };
  onAccept = async () => {
    this.state.week.length && this.getWeeklyResult();
    if (this.state.firstZone.length && this.state.secondZone.length) {
      if (this.state.firstZone == this.state.secondZone) {
        toast.error("Can't compare Same Zone", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        try {
          const { firstBranch, secondBranch, localClientId } = this.state;
          let res = await axios.post(
            `${Config.hostName}/api/compare/zoneBased/${localClientId}/${firstBranch}/${secondBranch}`,
            {
              //   camera: this.state.camera,
              firstZone: this.state.firstZone,
              secondZone: this.state.secondZone,
              month: this.state.month,
            }
          );
          if (res.data.length) {
            let arr = [];
            for (let i = 1; i <= 31; i++) {
              i = JSON.stringify(i);
              let st = i.padStart(2, "0");
              arr.push(`${st} ${mon}${yr}`);
            }
            let obj = this.state.options;
            obj.labels = arr;
            samplelabels = [...arr];
            // await this.setState({ options: obj });
            await this.setState({ series: res.data });
          }
        } catch (error) {}
      }
    }
  };
  getWeeklyResult = async () => {
    try {
      let res = await axios.post(
        `${Config.hostName}/api/compare/footfallWeekVsWeenkend/${this.state.localClientId}/${this.state.localBranchId}`,
        { camera: this.state.camera, date: this.state.week }
      );
      if (res.data.length) {
        await this.setState({ weekdays: res.data[0], weekends: res.data[1] });

        varweekday = this.state.weekdays;
        varweekends = this.state.weekends;
      }
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
  componentDidMount() {
    this.getId();
  }
  rand = (min, max, num) => {
    var rtn = [];

    while (rtn.length < num) {
      rtn.push(Math.random() * (max - min) + min);
    }

    return rtn;
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
  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    this.noCameraAvail();
  };
  onMonthChange = (date, String) => {
    this.setState({ month: date });
    let label = moment(date).format("ll");
    yr = label.split(",")[1];
    let substring = label.split(",")[0];
    mon = substring.split(" ")[0];
    // mon = mon.padStart(2, "0");
  };
  onCompareChange = async (checked) => {
    this.setState({ comparison: checked });
    // this.getZones();
  };
  getFirstBranchZones = async () => {
    try {
      let res = await axios.get(
        `${Config.hostName}/api/branch/branchzones/${this.state.firstBranch}`
      );
      if (res.data.length) {
        this.setState({ firstBranchZones: res.data });
      }
    } catch (error) {
      this.setState({ firstBranchZones: [] });
    }
  };
  getSecondBranchZones = async () => {
    try {
      let res = await axios.get(
        `${Config.hostName}/api/branch/branchzones/${this.state.secondBranch}`
      );
      if (res.data.length) {
        this.setState({ secondBranchZones: res.data });
      }
    } catch (error) {
      this.setState({ secondBranchZones: [] });
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
    this.noCameraAvail();
  };
  ReportHandling = async () => {
    await htmlToImage
      .toPng(document.getElementById("firstchart"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        await this.setState({
          url: { first: dataUrl },
          // pdfLoader: !this.state.pdfLoader,
        });
      });
    await htmlToImage
      .toPng(document.getElementById("secondchart"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        let obj = {};
        this.state.url.first
          ? (obj.first = this.state.url.first)
          : (obj.first = "");
        obj.second = dataUrl;
        await this.setState({
          url: obj,
        });
      });
    await this.setState({
      pdfLoader: !this.state.pdfLoader,
    });
  };
  render() {
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
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { branches, camera } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );
    return (
      <div>
        {this.state.pdfLoader && (
          <Copied
            footfalldata={this.state.tableValues}
            url={this.state.url}
            dwelldata={this.state.dwellTableValues}
          />
        )}
        <div
          className="p-0"
          id="firstchart"
          style={{ border: "none", maxWidth: 980 }}
        >
          <Card>
            <CardHeader>Weekly Vs Weekends</CardHeader>{" "}
            <div className="row">
              <div className="col">
                <Chart
                  style={{ padding: 0 }}
                  width={"470px"}
                  height={"350px"}
                  chartType="LineChart"
                  loader={<div>Loading Chart</div>}
                  data={this.state.weekdays}
                  options={{
                    hAxis: {
                      title: "Hour",
                    },
                    vAxis: {
                      title: "Week Days",
                    },
                    chart: {
                      title: "Week Vs Weekend",
                      subtitle: "Comparison of Data",
                    },
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
              </div>
              <div className="col">
                <Chart
                  style={{ margin: 0, padding: 0 }}
                  width={"470px"}
                  height={"350px"}
                  chartType="LineChart"
                  loader={<div>Loading Chart</div>}
                  data={this.state.weekends}
                  options={{
                    chart: {
                      title: "Week Vs Weekend",
                      // subtitle:
                      // "Comparison of Data",
                    },
                    hAxis: {
                      title: "Hour",
                    },
                    vAxis: {
                      title: "Weekends",
                    },
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
              </div>
            </div>
          </Card>
        </div>
        <div
          id="secondchart"
          className="row"
          style={{ maxWidth: 980, padding: 0, margin: 0 }}
        >
          <div className="col p-0 mt-4">
            <Card>
              <CardHeader>Compare Total Visitors of Different Zones</CardHeader>
              {this.state.options.labels.length ? (
                <ReactApexChart
                  options={this.state.options}
                  series={this.state.series}
                  type="line"
                  height={350}
                />
              ) : (
                <ReactApexChart
                  options={this.state.lboptions}
                  series={this.state.series}
                  type="line"
                  height={350}
                />
              )}
            </Card>
          </div>
        </div>

        <div className="site-drawer-render-in-current-wrapper">
          <Drawer
            title="Basic Drawer"
            placement="right"
            visible={true}
            getContainer={false}
            key="bottom"
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
                  {this.state.branches.map((i, index) => {
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

              {/* <div className="form-group row">
                <p className="font-weight-bold mb-n2">Select Week</p>
              </div> */}

              <div className="form-group row">
                <DatePicker
                  className="p-2 m-2 mr-4"
                  onChange={this.onWeekChange}
                  picker="week"
                />
              </div>

              <div className="form-group row">
                <p className="font-weight-bold mb-n2 mr-5">Compare</p>
                &emsp;{" "}
                <Switch
                  className="ml-5"
                  onChange={this.onCompareChange}
                ></Switch>
              </div>
              {this.state.comparison ? (
                <div>
                  <Select
                    className="mb-2"
                    // defaultValue="Branch"
                    placeholder="Branch"
                    // value={
                    //   this.state.firstBranch ? this.state.firstBranch : "Branch"
                    // }
                    style={{ width: 130 }}
                    onChange={async (val) => {
                      await this.setState({ firstBranch: val });
                      this.getFirstBranchZones();
                    }}
                  >
                    {this.state.branches.map((i, index) => {
                      return (
                        <Option key={index} value={i.branchId}>
                          {i.branchName}
                        </Option>
                      );
                    })}
                  </Select>
                  <Select
                    className="ml-2 mb-2"
                    placeholder="Branch"
                    // value={
                    //   this.state.secondBranch
                    //     ? this.state.secondBranch
                    //     : "Branch"
                    // }
                    style={{ width: 130 }}
                    onChange={async (val) => {
                      await this.setState({ secondBranch: val });
                      this.getSecondBranchZones();
                    }}
                  >
                    {this.state.branches.map((i, index) => {
                      return (
                        <Option key={index} value={i.branchId}>
                          {i.branchName}
                        </Option>
                      );
                    })}
                  </Select>
                  <Select
                    className="mb-3"
                    style={{ width: 130 }}
                    placeholder="Zone"
                    onChange={async (val) => {
                      await this.setState({ firstZone: val });
                      firstZone = val;
                    }}
                  >
                    {this.state.firstBranchZones.length &&
                      this.state.firstBranchZones.map((i, index) => {
                        return (
                          <Option value={i} key={index}>
                            {i}
                          </Option>
                        );
                      })}
                  </Select>
                  <Select
                    style={{ width: 130 }}
                    className="mb-3 ml-2"
                    placeholder="Zone"
                    onChange={(val) => {
                      this.setState({ secondZone: val });
                      secondZone = val;
                    }}
                  >
                    {this.state.secondBranchZones.length &&
                      this.state.secondBranchZones.map((i, index) => {
                        return (
                          <Option value={i} key={index}>
                            {i}
                          </Option>
                        );
                      })}
                  </Select>
                  <DatePicker
                    style={{ width: 200 }}
                    className="p-2 mr-4"
                    onChange={this.onMonthChange}
                    picker="month"
                  />
                </div>
              ) : null}
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
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  setEnableClosedSidebar: (enable) => dispatch(setEnableClosedSidebar(enable)),
});
const mapStateToProps = (state) => ({
  enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  footfall: state.footfall,
});
export default connect(mapStateToProps, mapDispatchToProps)(Comparison);
