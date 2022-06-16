import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Row, Col, Input, Button, Jumbotron } from "reactstrap";
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import Config from "../../../config/Config";
import { Select, Tag, InputNumber, Slider } from "antd";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { ToastContainer, toast } from "react-toastify";
const { Option } = Select;

class MainComp extends React.Component {
  state = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    height: 0,
    width: 0,
    zone: "",
    direction: "",
    all: [],
    camera: "",
    localClientId: "",
    localBranchId: "",
    cameras: [],
    branches: [],
    modal: false,
    branch: "",
    availableConfiguration: [],
    arrPoints: [],
    fetchedImage: "",
    loading: false,
  };
  toggle = () => this.setState({ modal: !this.state.modal });
  getBranchZones = () => {
    axios
      .get(
        `${Config.hostName}/api/branch/configurezone/${this.state.localBranchId}`
      )
      .then((res) => {
        {
          res.data.configuration &&
            res.data.configuration.zones &&
            res.data.configuration.zones.length &&
            this.setState({
              availableConfiguration: res.data.configuration.zone,
            });
        }
      })
      .catch((err) => {
        console.log("Configuration err", err);
      });
  };
  getId = async () => {
    const { user } = this.props.auth;
    if (this.props.auth && user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          localClientId: user.clientId,
          localBranchId: user.branchId,
          userType: user.userType,
          cameras: user.camera,
        });
        this.setState({ cameras: user.camera });
        this.getAllBranches(user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      let branches = [];
      user.editAccess.length &&
        user.editAccess.map((item) => {
          let obj = {};
          obj.branchId = item.branchId;
          obj.branchName = item.branchName;
          branches.push(obj);
        });
      await this.setState({
        branches,
        localclientId: user.clientId,
      });
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
        });
        this.setState({ cameras: this.props.admin.selectedClient.camera });
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  getCameraConfig = async (id) => {
    try {
      await axios
        .get(`${Config.hostName}/api/branch/camera/${id}`)
        .then(async (res) => {
          if (res.data.camera[0].cameraFrame) {
            await this.setState({
              fetchedImage: res.data.camera[0].cameraFrame,
            });
          }
        });
    } catch (err) {
      console.log("err", err);
    }
  };
  async componentWillMount() {
    this.validator = new SimpleReactValidator();
    await this.getId();
  }
  finalButtonHandler = (x2, y2) => {
    this.setState({ x2, y2 });
  };
  initialButtonHandler = (x1, y1) => {
    this.setState({ x1, y1 });
  };
  eventHanlder = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  SubmitFile = (data) => {
    if (data.camera.length) {
      this.setState({ loading: true });
      axios
        .post(
          `${Config.hostName}/api/branch/configurezone/${this.state.localBranchId}`,
          {
            configuration: data,
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
          this.setState({ loading: false });
          toast.success("zone added", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          this.setState({ arrPoints: [] });
          // this.tableData(res.data);
        })
        .catch((err) => {
          this.setState({ loading: false });
          toast.error("Server Error", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
    } else {
      toast.error("Please Select Camera", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  buttonHandler = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      const { zone, direction, camera, x1, y1, height, width } = this.state;
      let obj = { points: [x1, y1, height, width], zone, direction, camera };
      if (this.state.camera.length) {
        this.SubmitFile(obj);
      } else {
        toast.error("Please Select Camera", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };
  cameraHandleChange = (value) => {
    const { user } = this.props.auth;
    this.setState({ camera: value });
    this.getSpecificCameraImage(this.state.localBranchId, user.userType, value);
  };
  getSpecificCameraImage = async (id, type, camera) => {
    try {
      await this.setState({ loading: true });
      await axios
        .get(
          `${Config.hostName}/api/branch/cameraFrame/${id}/${type}/${camera}`
        )
        .then(async (res) => {
          if (res.data) {
            await this.setState({
              fetchedImage: res.data,
              loading: false,
            });
          }
        });
    } catch (err) {
      this.setState({ loading: false });
      console.log("err", err);
    }
  };
  branchHandleChange = (value) => {
    const { user } = this.props.auth;
    this.setState({ localBranchId: value, cameras: [], camera: "" });
    if (user && user.userType == "user") {
      user.editAccess.map((item) => {
        if (item.branchId == value) this.setState({ cameras: item.cameras });
      });
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
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { x1, x2, y1, y2, height, width } = this.state;

    return (
      <div>
        <Row className="mb-1">
          {this.state.loading && (
            <LoadingOutlined style={{ fontSize: 24 }} spin />
          )}
          {this.props.auth.user && this.props.auth.user.userType == "user" && (
            <Col>
              <Select
                className="ml-1"
                placeholder="Select Branch"
                name="branch"
                style={{ width: 150 }}
                onChange={this.branchHandleChange}
              >
                {this.state.branches.length &&
                  this.state.branches.map((obj, index) => {
                    return (
                      <Option key={index} value={`${obj.branchId}`}>
                        {obj.branchName}
                      </Option>
                    );
                  })}
              </Select>{" "}
            </Col>
          )}

          {this.state.cameras.length ? (
            <Col>
              {/* Select Camera :&nbsp; */}
              <Select
                name="camera"
                placeholder="Select Camera"
                defaultValue={
                  this.state.camera.length ? this.state.camera : null
                }
                style={{ width: 150 }}
                onChange={this.cameraHandleChange}
              >
                {this.state.cameras.length &&
                  this.state.cameras.map((obj, index) => {
                    return (
                      <Option key={index} value={`${obj.cameraId}`}>
                        {obj.cameraName}
                      </Option>
                    );
                  })}
              </Select>{" "}
            </Col>
          ) : null}
          <Col>
            {this.state.availableConfiguration.length ? (
              <strong>Zones </strong>
            ) : null}
            {this.state.availableConfiguration.length
              ? this.state.availableConfiguration.map((i, index) => {
                  return <Tag key={index}>{i.zone}</Tag>;
                })
              : null}{" "}
            <strong className="ml-2">Learn: How to Assign Zone </strong>
            <InfoCircleOutlined
              style={{ fontSize: "20px" }}
              className="mr-1 p-2"
              onClick={this.toggle}
            />
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>How To Draw Line</ModalHeader>
              <ModalBody>
                Firstly,select camera and clientId ,place your cursor on image
                where you want to assign zone and then drag ,A{" "}
                <strong>yellow </strong>
                will be drawn then <strong>Enter Zone name</strong> and{" "}
                <strong> Direction </strong>in Below input field and click on{" "}
                <strong>Submit</strong>. <br />
                Zone, Coordinates and Direction will be saved in your database.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggle}>
                  Ok
                </Button>{" "}
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
        <div>
          <div
            // className="container"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundImage: this.state.fetchedImage.length
                ? `url(${`data:image/jpeg;base64,${this.state.fetchedImage}`})`
                : `url(${require("../../../images/No_Img_Avail.jpg")})`,
            }}
          >
            <Stage width={window.innerWidth} height={window.innerHeight}>
              <Layer>
                <Rect
                  x={x1}
                  y={y1}
                  width={height}
                  height={width}
                  // fill="red"
                  stroke="red"
                  shadowBlur={10}
                />
              </Layer>
            </Stage>
          </div>
        </div>
        <div>
          <Jumbotron className="p-3">
            <Row>
              <Col>
                <Slider
                  // min={0}
                  max={2000}
                  onChange={(val) => {
                    this.setState({ x1: val });
                  }}
                  // name="x1slider"
                  value={typeof x1 === "number" ? x1 : 0}
                >
                  &emsp;
                  <span>x1</span>
                </Slider>
              </Col>
              <Col>
                <InputNumber
                  // min={0}
                  name="x1input"
                  placeholder="x1"
                  max={1500}
                  style={{ margin: "0 16px" }}
                  value={x1}
                  onChange={(val) => {
                    this.setState({ x1: val });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Slider
                  className="mt-4"
                  // min={0}
                  max={1000}
                  onChange={(val) => {
                    this.setState({ y1: val });
                  }}
                  // name="x1slider"
                  value={typeof y1 === "number" ? y1 : 0}
                >
                  {" "}
                  &emsp;
                  <span>y1</span>
                </Slider>
              </Col>
              <Col>
                <InputNumber
                  className="mt-2"
                  // min={0}
                  placeholder="y1"
                  name="x1input"
                  max={2000}
                  style={{ margin: "0 16px" }}
                  value={y1}
                  onChange={(val) => {
                    this.setState({ y1: val });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Slider
                  className="mt-4"
                  // min={0}
                  max={1000}
                  onChange={(val) => {
                    this.setState({ height: val });
                  }}
                  // name="x1slider"
                  value={typeof height === "number" ? height : 0}
                >
                  {" "}
                  &emsp;
                  <span>Width</span>
                </Slider>
              </Col>
              <Col>
                <InputNumber
                  className="mt-2"
                  // min={0}
                  placeholder="Height"
                  name="height"
                  // max={2000}
                  style={{ margin: "0 16px" }}
                  value={height}
                  onChange={(val) => {
                    this.setState({ height: val });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Slider
                  className="mt-4"
                  // min={0}
                  max={1000}
                  onChange={(val) => {
                    this.setState({ width: val });
                  }}
                  // name="x1slider"
                  value={typeof width === "number" ? width : 0}
                >
                  {" "}
                  &emsp;
                  <span>Height</span>
                </Slider>
              </Col>
              <Col>
                <InputNumber
                  className="mt-2"
                  // min={0}
                  placeholder="Width"
                  name="width"
                  // max={2000}
                  style={{ margin: "0 16px" }}
                  value={width}
                  onChange={(val) => {
                    this.setState({ width: val });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col className="mt-3">
                <Input
                  placeholder="enter Zone"
                  name="zone"
                  value={this.state.zone}
                  onChange={this.eventHanlder}
                ></Input>
                '
                <div className="text-danger">
                  {this.validator.message("zone", this.state.zone, "required")}
                </div>
              </Col>

              <Col className="mt-3">
                <Input
                  width={70}
                  placeholder="enter Direction"
                  name="direction"
                  value={this.state.direction}
                  onChange={this.eventHanlder}
                ></Input>
                <div className="text-danger">
                  {this.validator.message(
                    "direction",
                    this.state.direction,
                    "required"
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col md-5 className="m-2 " style={{ textAlign: "center" }}>
                <Button
                  className="pl-4 pr-4"
                  color="primary"
                  onClick={(e) => this.buttonHandler(e)}
                >
                  Submit
                </Button>{" "}
                {this.state.loading && (
                  <LoadingOutlined style={{ fontSize: 24 }} spin />
                )}
              </Col>
            </Row>
          </Jumbotron>{" "}
        </div>
        {/* <Button color="primary" onClick={(e) => this.buttonHandler(e)}>
          Submit
        </Button>{" "} */}
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
      </div>
    );
  }
}
// export default MainComp;

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  // dwellTimeAnalysis:state.dwellTimeAnalysis
});
export default connect(mapStateToProps, {})(MainComp);
