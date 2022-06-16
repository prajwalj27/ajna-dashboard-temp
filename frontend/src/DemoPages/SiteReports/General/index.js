import React from "react";
import {
  Drawer,
  DatePicker,
  Radio,
  Select,
  Space,
  Divider,
  Button,
  Menu,
  Dropdown,
  Spin,
} from "antd";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./steps.css";
import Copied from "./pdf";
import Footfall from "./Footfall/index";
import DwellTime from "./DwellTime/index";
import Heatmap from "./Heatmap/index";
import PathTracking from "./PathTracking/index";
import Config from "../../../config/Config";
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";
const { Option } = Select;
let allCameras = [];
class App extends React.Component {
  state = {
    userType: "",
    localBranchId: "",
    localClientId: "",
    branches: [],
    branch: [],
    cameras: [],
    camera: [],
    radioOption: "day",
    date: "",
    time: "",
    month: "",
    week: "",
    metric: [],
    foofallUrl: "",
    footfallValues: [],
    footfallPdfLoader: false,
    dwellUrl: "",
    dwellValues: [],
    dwellPdfLoader: false,
    heatmapUrl: [],
    heatmapPdfLoader: false,
    pathTrackingUrl: [],
    pathTrackingPdfLoader: false,
    footfallreportGenerate: false,
    dwellreportGenerate: false,
    heatmapreportGenerate: false,
    pathreportGenerate: false,
    reportGenerate: false,
    count: 0,
    loading: false,
  };
  footfallReportGeneration = async (url, val) => {
    await this.setState({
      foofallUrl: url,
      footfallValues: val,
      footfallPdfLoader: true,
      count: this.state.count + 1,
    });
    if (this.state.metric.length == this.state.count)
      await this.setState({ reportGenerate: true, loading: false });
  };
  dwellReportGeneration = async (url, val) => {
    await this.setState({
      dwellUrl: url,
      dwellValues: val,
      dwellPdfLoader: true,
      count: this.state.count + 1,
    });
    if (this.state.metric.length == this.state.count)
      await this.setState({ reportGenerate: true, loading: false });
  };
  heatmapReportGeneration = async (url) => {
    await this.setState({
      heatmapUrl: url,
      heatmapPdfLoader: true,
      count: this.state.count + 1,
    });
    if (this.state.metric.length == this.state.count)
      await this.setState({ reportGenerate: true, loading: false });
  };
  pathTrackReportGeneration = async (url) => {
    await this.setState({
      pathTrackingUrl: url,
      pathTrackingPdfLoader: true,
      count: this.state.count + 1,
    });
    if (this.state.metric.length == this.state.count)
      await this.setState({ reportGenerate: true, loading: false });
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
          metric: ["count", "passerBy", "heatmap", "pathtracking"],
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
  onAccept = async () => {
    (await this.state.metric.includes("count")) && this.child.onFootAccept();
    (await this.state.metric.includes("passerBy")) &&
      this.dwellchild.onDwellAccept();
    (await this.state.metric.includes("heatmap")) &&
      this.heatchild.onHeatAccept();
    (await this.state.metric.includes("pathtracking")) &&
      this.pathchild.onPathAccept();
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
        this.noCameraAvail();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    this.noCameraAvail();
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
              const { metric } = this.state;
              await this.setState({ count: 0, loading: true });
              metric.includes("count") &&
                (await this.setState({ footfallreportGenerate: true }));
              metric.includes("count") && (await this.child.onFootAccept());

              metric.includes("passerBy") &&
                (await this.setState({ dwellreportGenerate: true }));
              metric.includes("passerBy") &&
                (await this.dwellchild.onDwellAccept());

              metric.includes("heatmap") &&
                (await this.setState({ heatmapreportGenerate: true }));
              metric.includes("heatmap") &&
                (await this.heatchild.onHeatAccept());

              metric.includes("pathtracking") &&
                (await this.setState({ pathreportGenerate: true }));
              metric.includes("pathtracking") &&
                (await this.pathchild.onPathAccept());
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
    const {
      branches,
      camera,
      metric,
      footfallPdfLoader,
      dwellPdfLoader,
      heatmapPdfLoader,
      pathTrackingPdfLoader,
      radioOption,
      footfallreportGenerate,
      dwellreportGenerate,
      pathreportGenerate,
      heatmapreportGenerate,
      reportGenerate,
    } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );

    return (
      <div className="site-drawer-render-in-current-wrapper">
        {(metric.includes("count")
          ? footfallreportGenerate && footfallPdfLoader && reportGenerate
          : reportGenerate) &&
          (metric.includes("passerBy")
            ? dwellreportGenerate && dwellPdfLoader && reportGenerate
            : reportGenerate) &&
          (metric.includes("heatmap")
            ? heatmapreportGenerate && heatmapPdfLoader && reportGenerate
            : reportGenerate) &&
          (metric.includes("passerBy")
            ? pathreportGenerate && pathTrackingPdfLoader && reportGenerate
            : reportGenerate) && (
            <Copied
              metric={metric}
              footfalldata={this.state.footfallValues}
              foofallUrl={this.state.foofallUrl}
              dwelldata={this.state.dwellValues}
              dwellUrl={this.state.dwellUrl}
              heatmapUrl={this.state.heatmapUrl}
              pathTrackingUrl={this.state.pathTrackingUrl}
              footfallreportGenerate={this.state.footfallreportGenerate}
              dwellreportGenerate={this.state.dwellreportGenerate}
              heatmapreportGenerate={this.state.heatmapreportGenerate}
              pathreportGenerate={this.state.pathreportGenerate}
            />
          )}
        {camera.length && metric.includes("count") && (
          <Footfall
            onRef={(ref) => (this.child = ref)}
            localClientId={this.state.localClientId}
            localBranchId={this.state.localBranchId}
            camera={this.state.camera}
            date={this.state.date}
            radioOption={this.state.radioOption}
            week={this.state.week}
            month={this.state.month}
            footfallReportGeneration={this.footfallReportGeneration}
            footfallreportGenerate={this.state.footfallreportGenerate}
          />
        )}
        <Divider />
        {camera.length && metric.includes("passerBy") && (
          <DwellTime
            onRef={(ref) => (this.dwellchild = ref)}
            localClientId={this.state.localClientId}
            localBranchId={this.state.localBranchId}
            camera={this.state.camera}
            date={this.state.date}
            radioOption={this.state.radioOption}
            week={this.state.week}
            month={this.state.month}
            dwellReportGeneration={this.dwellReportGeneration}
            dwellreportGenerate={this.state.dwellreportGenerate}
          />
        )}{" "}
        <Divider />
        {metric.includes("heatmap") && camera.length && (
          <Heatmap
            onRef={(ref) => (this.heatchild = ref)}
            localClientId={this.state.localClientId}
            localBranchId={this.state.localBranchId}
            camera={this.state.camera}
            date={this.state.date}
            radioOption={this.state.radioOption}
            week={this.state.week}
            month={this.state.month}
            heatmapReportGeneration={this.heatmapReportGeneration}
            heatmapreportGenerate={this.state.heatmapreportGenerate}
          />
        )}{" "}
        <Divider />
        {metric.includes("pathtracking") && camera.length && (
          <PathTracking
            onRef={(ref) => (this.pathchild = ref)}
            localClientId={this.state.localClientId}
            localBranchId={this.state.localBranchId}
            camera={this.state.camera}
            date={this.state.date}
            radioOption={this.state.radioOption}
            week={this.state.week}
            month={this.state.month}
            pathTrackReportGeneration={this.pathTrackReportGeneration}
            pathreportGenerate={this.state.pathreportGenerate}
            // email={this}
          />
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
                {this.state.loading && <Spin />}
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
              >
                <Option value="count">Visitor Count</Option>
                <Option value="passerBy">Passers By</Option>
                <Option value="heatmap">Heatmap</Option>
                <Option value="pathtracking">Path Tracking</Option>
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
                </div>
              </div>
            )}
            {radioOption == "week" && (
              <div className="form-group row">
                <DatePicker
                  className="p-2 m-2 mr-4"
                  onChange={this.onWeekChange}
                  picker="week"
                />
              </div>
            )}
            {radioOption == "month" && (
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
export default connect(mapStateToProps, null, null, { forwardRef: true })(App);
