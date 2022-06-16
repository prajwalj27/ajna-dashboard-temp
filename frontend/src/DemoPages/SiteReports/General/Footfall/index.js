import React from "react";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import Chart from "react-google-charts";
import "../steps.css";
import Config from "../../../../config/Config";
import htmlToImage from "html-to-image";
import axios from "axios";
import { Card } from "reactstrap";
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
    callOnAccept: false,
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
          metric: ["count", "passerBy", "heatmap"],
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
  onWeekChange = async (date, dateString) => {
    this.setState({ week: dateString });
  };
  onMonthChange = async (date, dateString) => {
    this.setState({ month: date._d });
  };
  onFootAccept = async () => {
    const {
      localBranchId,
      localClientId,
      camera,
      date,
      radioOption,
      week,
      month,
    } = this.props;
    await this.setState({
      localClientId,
      localBranchId,
      camera,
      date,
      radioOption,
      week,
      month,
    });
    if (radioOption == "day") {
      await this.getHourlyResult();
      (await this.props.footfallreportGenerate) && this.ReportHandling();
    } else if (radioOption == "week") {
      await this.getWeeklyResult();
      (await this.props.footfallreportGenerate) && this.ReportHandling();
    } else {
      await this.getMonthResult();
      (await this.props.footfallreportGenerate) && this.ReportHandling();
    }
    this.setState({ callOnAccept: false });
  };
  getHourlyResult = async () => {
    try {
      let res = await axios.post(
        `${Config.hostName}/api/pdf/footfallhourbased/${this.state.localClientId}/${this.state.localBranchId}`,
        { camera: this.state.camera, date: this.state.date }
      );
      if (res.data.length) {
        await this.chartFormation(res.data);
        await this.tableFormation(res.data);
      }
    } catch (error) {
      console.error("error", error);
    }
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
  weeklyTableFormation = (data) => {
    data.map((i, index) => {
      let date = moment.parseZone(i.Timestamp);
      let format = date.format("LLL");
      i.hour = format;
      i.key = index + 1;
      i.camera = i.camera[0];
    });
    this.setState({ tableValues: data });
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
    let filledArray = new Array(8).fill([]);
    let distinctZones = [];
    let set = new Set();
    data.map((i) => {
      set.add(i.zone);
    });
    distinctZones = Array.from(set);
    let tempArr = "";
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
    await htmlToImage
      .toPng(document.getElementById("footfallchart"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        await this.setState({
          url: dataUrl,
        });
      });
    await this.props.footfallReportGeneration(
      this.state.url,
      this.state.tableValues
    );
  };
  componentWillMount = () => {
    const {
      localBranchId,
      localClientId,
      camera,
      date,
      radioOption,
    } = this.props;
    this.setState({
      localClientId,
      localBranchId,
      camera,
      date,
      radioOption,
    });
  };
  async componentDidMount() {
    await this.props.onRef(this);
    await this.getId();
  }
  async componentWillUnmount() {
    this.props.onRef(null);
  }
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    return (
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
        <Card id="footfallchart" style={{ maxWidth: "980px", padding: "5px" }}>
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
            <Column title="Branch" dataIndex="branch" key="branch" />
            <Column title="Camera" dataIndex="camera" key="camera" />
            <Column title="Time" dataIndex="hour" key="hour" />
            <Column title="Zone" dataIndex="zone" key="zone" />
            <Column title="Total Visitors" dataIndex="count" key="count" />
          </Table>
        </Card>{" "}
      </Card>
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
