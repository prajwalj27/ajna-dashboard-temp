import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  Button,
  CardHeader,
  Container,
  Card,
  CardBody,
  Modal,
  Alert,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";
import Graph from "react-graph-vis";
import { ToastContainer, toast } from "react-toastify";
import Config from "../../../config/Config";
import { connect } from "react-redux";
import CsvDownload from "react-json-to-csv";
import PropTypes from "prop-types";
import htmlToImage from "html-to-image";
import { DownloadOutlined } from "@ant-design/icons";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import axios from "axios";
import Loader from "react-loaders";
import moment from "moment";
import CountUp from "react-countup";
import {
  Table,
  Tag,
  Space,
  DatePicker,
  Spin,
  Select,
  Dropdown,
  Menu,
} from "antd";
import Copied from "./PdfFile";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
const { Column } = Table;
const { RangePicker } = DatePicker;
const { Option } = Select;
let objEdges = {},
  edgesArr = [];
let dataValues = [];
let allCameras = [];
const options = {
  layout: {
    // hierarchical: true,
  },
  edges: {
    color: "#000000",
  },
  height: "500px",
};
const dateFormat = "DD-MM-YYYY";

const events = {
  select: function (event) {
    var { nodes, edges } = event;
  },
};

class ContactTracing extends Component {
  state = {
    localClientId: "",
    localBranchId: "",
    userType: "",
    todayContact: [],
    nodes: [],
    edges: [],
    data: [],
    tableData: [],
    modal: false,
    modalImage: true,
    loading: true,
    spinner: false,
    pdfLoader: false,
    url: "",
    dates: [],
    graphDates: [],
    camera: [],
    branches: [],
    cameras: [],
    branches: [],
  };
  ReportHandling = () => {
    htmlToImage
      .toJpeg(document.getElementById("my-node"), { backgroundColor: "white" })
      .then((dataUrl) => {
        this.setState({ url: dataUrl, pdfLoader: !this.state.pdfLoader });
      });
  };
  async componentDidMount() {
    await this.getId();

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
    socket.on("insertContact", (data) => {});
    socket.on("deleteContact", (data) => {});
    socket.on("updateContact", (data) => {});
  }
  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    if (
      this.props.auth.user &&
      (this.props.auth.user.userType === "client" ||
        this.props.auth.user.userType === "admin")
    ) {
      this.getContactTracingAllData(this.state.localBranchId);
      this.getContactTracingAllCordinates(this.state.localBranchId);
    } else {
      this.getContactTracingAllData(this.state.localClientId);
      this.getContactTracingAllCordinates(this.state.localClientId);
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
        if (res.data.length) {
          console.log(res.data[0].camera);
          await this.setState({ cameras: res.data[0].camera, camera: [] });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  branchHandleChange = async (value) => {
    const { user } = this.props.auth;
    await this.setState({ localBranchId: value });
    if (user.userType == "client") {
      await this.onBranchChangeCamerasChange(value);
    }
    await this.getContactTracingAllData(value);
    await this.getContactTracingAllCordinates(value);
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
  rangePicker = async (dates, dateStrings) => {
    this.setState({ pdfLoader: false });
    await this.setState({ dates: dates });
    if (
      this.props.auth.user &&
      (this.props.auth.user.userType === "client" ||
        this.props.auth.user.userType === "admin")
    ) {
      this.getContactTracingAllData(this.state.localBranchId);
      this.getContactTracingAllCordinates(this.state.localBranchId);
    } else {
      this.getContactTracingAllData(this.state.localClientId);
      this.getContactTracingAllCordinates(this.state.localClientId);
    }
  };
  getUserBranchFromProps = async () => {
    const { user } = this.props.auth;
    await this.setState({
      branches: user.camera,
      cameras: user.camera[0].cameras[0],
      localBranchId: user.camera[0].branchId,
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
  getId = async () => {
    const { user } = this.props.auth;
    if (this.props.auth && user && user.userType === "client") {
      if (this.props.auth.user.clientId) {
        await this.setState({
          localClientId: user.clientId,
          localBranchId: user.branchId,
          userType: user.userType,
          cameras: user.camera,
        });
        allCameras = user.camera.map((i) => {
          return i.cameraId;
        });
        await this.setState({
          camera: allCameras,
        });
        this.noCameraAvail();
        await this.getContactTracingAllCordinates(user.branchId);
        await this.getContactTracingAllData(user.branchId);
        await this.getAllBranches(user.clientId);
        // this.getAllCamera(this.props.auth.user.clientId)
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "user"
    ) {
      this.getUserBranchFromProps();
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
        // localBranchId: user.camera.length && user.camera[0].branchId,
      });
      this.noCameraAvail();
      this.getContactTracingAllCordinates(this.props.auth.user.clientId);
      this.getContactTracingAllData(this.props.auth.user.clientId);
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
          localBranchId: this.props.admin.selectedClient.branchId,
          userType: this.props.admin.selectedClient.userType,
          cameras: this.props.admin.selectedClient.camera,
        });
        this.getContactTracingAllData(this.props.admin.selectedClient.branchId);
        this.getContactTracingAllCordinates(
          this.props.admin.selectedClient.branchId
        );
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };

  nodesEdges = (data) => {
    let setdata = [];
    if (data.length) {
      data.map((i) => {
        let set = new Set(i);
        setdata.push(Array.from(set));
      });
      let all = setdata[0].concat(setdata[1]);
      let tempData = new Set(all);
      let temp = [];
      temp.push(Array.from(tempData));
      let arrNodes = [];
      temp[0].map((i, index) => {
        var obj = { id: index + 1, label: i };
        arrNodes.push(obj);
      });
      this.setState({ nodes: arrNodes });
      let personArr = data[0];
      let contactedArr = data[1];
      for (let node = 0; node < arrNodes.length; node++) {
        for (let i = 0; i < personArr.length; i++) {
          if (personArr[i] === arrNodes[node].label) {
            personArr[i] = arrNodes[node].id;
          }
          if (contactedArr[i] === arrNodes[node].label)
            contactedArr[i] = arrNodes[node].id;
        }
      }
      var edges = [];
      for (let i = 0; i < personArr.length; i++) {
        var obj = {};
        obj.from = personArr[i];
        obj.to = contactedArr[i];
        edges.push(obj);
      }
      this.setState({ edges });
    }
  };
  showImage = async (image, index) => {
    this.setState({ spinner: true });
    try {
      await axios
        .get(`${Config.hostName}/api/contact-tracing/img/${index._id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((res) => {
          this.setState({
            spinner: false,
            modalImage: res.data.img,
            modal: !this.state.modal,
          });
        });
    } catch (err) {
      this.setState({ spinner: false });
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
  getContactTracingAllCordinates = async (id) => {
    try {
      this.noCameraAvail();

      const { userType } = this.state;
      await axios
        .post(
          `${Config.hostName}/api/contact-tracing/all/${id}/${userType}`,
          {
            dates: JSON.stringify(this.state.dates),
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
        .then((res) => {
          this.setState({ todayContact: res.data });
          this.nodesEdges(res.data);
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

  tableData = (data) => {
    dataValues = [];
    data.map((i, index) => {
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

  getContactTracingAllData = async (id) => {
    try {
      const { userType, camera, dates } = this.state;
      this.noCameraAvail();
      await axios
        .post(
          `${Config.hostName}/api/contact-tracing/me/${id}/${userType}`,
          {
            dates: JSON.stringify(this.state.dates),
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
        .then((res) => {
          this.setState({ data: res.data });
          // console.log("table",res.data)
          this.tableData(res.data);
        })
        .catch((err) => {
          console.log("contact err", err);
        });
    } catch (error) {}
  };
  async componentWillMount() {
    {
      this.props.auth.selectedCamera &&
        (await this.setState({ camera: this.props.auth.selectedCamera }));
    }
    setTimeout(() => this.setState({ loading: false }), 1500);
  }
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { cameras, branches, camera, branch, tableValues } = this.state;
    const filteredOptions = this.state.cameras.filter(
      (o) => !camera.includes(o)
    );
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
            filename="ContactTracing.csv"
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
    const { loading } = this.state;
    const graph = {
      nodes: this.state.nodes,
      edges: this.state.edges,
    };
    if (this.state.localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <Fragment>
          {this.state.pdfLoader && (
            <Copied
              data={this.state.tableData}
              nodes={this.state.nodes}
              edges={this.state.edges}
              url={this.state.url}
            />
          )}
          <Row className="mb-3 ml-1">
            <Col md="9">
              <Row>
                <Col>
                  <Tooltip
                    className="mt-3"
                    placement="topLeft"
                    title="Date Filter"
                  >
                    <InfoCircleOutlined className="ml-1" />
                  </Tooltip>{" "}
                  <RangePicker
                    onChange={this.rangePicker}
                    format={dateFormat}
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
                </Col>{" "}
              </Row>
            </Col>
            <Col md="2">
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
            </Col>
          </Row>

          <Container fluid>
            <ResponsiveContainer height="50%">
              <Card className="mb-3">
                <CardHeader className="card-header-tab">
                  <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i className="header-icon lnr-laptop-phone mr-3 text-muted opacity-6">
                      {" "}
                    </i>
                    Contact Traced
                  </div>
                </CardHeader>
                <CardBody>
                  <div id="my-node">
                    <Graph
                      graph={graph}
                      options={options}
                      events={events}
                      height={400}
                    />
                  </div>
                </CardBody>
              </Card>
            </ResponsiveContainer>
            {/* <div className="card no-shadow bg-transparent no-border rm-borders mb-3"></div> */}
            <Card>
              <CardHeader>
                Contact Traced &nbsp;
                <Tooltip
                  placement="topLeft"
                  title="Values of Person who contacted with whom with image"
                >
                  <InfoCircleOutlined className=" mr-1" />
                </Tooltip>{" "}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="10"></Col>
                  <Col>{this.state.spinner && <Spin size="large" />}</Col>
                  <Col>
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
                        title="PersonID"
                        dataIndex="PersonID"
                        key="PersonID"
                      />
                      <Column
                        title="ContactedPersonID"
                        dataIndex="ContactedPersonID"
                        key="ContactedPersonID"
                      />
                      <Column
                        title="Image"
                        dataIndex="Image"
                        key="Image"
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
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Modal
              className="modal-lg"
              isOpen={this.state.modal}
              toggle={() => {
                this.setState({ modal: !this.state.modal });
              }}
            >
              <ModalBody>
                <img
                  top
                  width="100%"
                  height={500}
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
          </Container>
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
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(ContactTracing);
