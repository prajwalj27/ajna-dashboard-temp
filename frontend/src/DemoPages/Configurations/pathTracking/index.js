import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Row, Col, Input } from "reactstrap";
import { Stage, Layer, Rect, Text, Line, Arrow } from "react-konva";
import { ArrowSvg } from "react-simple-arrows";
import Config from "../../../config/Config";
import {
  Select,
  Tag,
  InputNumber,
  Slider,
  Checkbox,
  Button,
  Radio,
  Divider,
} from "antd";
import { setEnableClosedSidebar } from "../../../reducers/ThemeOptions";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Jumbotron,
} from "reactstrap";
import axios from "axios";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SimpleReactValidator from "simple-react-validator";
import { ToastContainer, toast } from "react-toastify";
const { Option } = Select;

class MainComp extends React.Component {
  state = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    lineX1: 0,
    lineX2: 0,
    lineY1: 0,
    lineY2: 0,
    zone: "",
    direction: "",
    chooseArrowOrLine: 1,
    all: [],
    camera: [],
    localClientId: "",
    localBranchId: "",
    userType: "",
    cameras: [],
    branches: [],
    modal: false,
    branch: "",
    zones: [],
    arrPoints: [],
    imageUrl: "",
    fetchedImage: "",
    loading: false,
    availableConfigurations: [],
    showPoints: false,
    chooseColor: "black",
    submitLoader: false,
  };
  toggle = () => this.setState({ modal: !this.state.modal });
  getBranchZones = async (id) => {
    const { user } = this.props.auth;
    axios
      .get(
        `${Config.hostName}/api/branch/configurepath/${id}/${user.userType}/${this.state.camera}`
      )
      .then(async (res) => {
        let arr = [];
        res.data.length &&
          res.data.map((i) => {
            arr.push(i.zone);
          });
        await this.setState({ zones: arr, availableConfigurations: res.data });
      })
      .catch((err) => {
        console.log("Configuration err", err);
      });
  };
  getCameraNames = (id) => {
    const { user } = this.props.auth;
    let arr = [];
    for (let i = 0; i < user.camera.length; i++) {
      for (let j = 0; j < user.editAccess.length; j++) {
        if (user.editAccess[j] == user.camera[i].cameraId) {
          arr.push(user.camera[i]);
        }
      }
    }
    this.setState({ cameras: arr });
  };
  handleChange = (val) => {
    const { zone, availableConfigurations } = this.state;
    availableConfigurations.map((i) => {
      if (i.zone == val) {
        this.setState({
          x1: i.points[0],
          y1: i.points[1],
          x2: i.points[2],
          y2: i.points[3],
          lineX1: i.points[4],
          lineY1: i.points[5],
          lineX2: i.points[6],
          lineY2: i.points[7],
          zone: i.zone,
        });
      }
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
      await this.setState({
        localClientId: this.props.auth.user.clientId,
        userType: this.props.auth.user.userType,
      });
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
  componentWillUnmount() {
    // this.props.setEnableClosedSidebar(false);
  }
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
  async componentWillMount() {
    this.validator = new SimpleReactValidator();
    // this.props.setEnableClosedSidebar(true);
    await this.getId();
  }
  eventHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getCameraConfig = async (id) => {
    try {
      await axios
        .get(
          `${Config.hostName}/api/branch/camera/${id}/${this.props.auth.user.userType}`
        )
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
  SubmitFile = (data, id) => {
    this.setState({ submitLoader: true });
    if (this.state.camera.length) {
      axios
        .post(
          `${Config.hostName}/api/branch/configurepath/${id}/${this.props.auth.user.userType}`,
          {
            configuration: data,
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
          this.setState({
            submitLoader: false,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
            lineX1: 0,
            lineX2: 0,
            lineY1: 0,
            lineY2: 0,
            zone: "",
            availableConfigurations: [],
            zones: [],
          });
          toast.success("Arrow Plotted", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
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
      // await this.takeScreenshot();
      const {
        zone,
        direction,
        camera,
        x1,
        y1,
        x2,
        y2,
        lineX1,
        lineX2,
        lineY1,
        lineY2,
        chooseColor,
      } = this.state;
      let obj = {
        points: [x1, y1, x2, y2, lineX1, lineY1, lineX2, lineY2],
        zone,
        CameraID: camera,
        arrowColor: chooseColor,
      };
      this.SubmitFile(obj, this.state.localBranchId);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };
  EditConfigurations = () => {
    if (this.state.camera.length) {
      // this.props.auth.user.userType == "client"
      // ?
      this.getBranchZones(this.state.localBranchId);
      // : this.getBranchZones(this.state.localClientId);
    } else
      toast.error("Select Camera", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  };
  cameraHandleChange = (value) => {
    const { user } = this.props.auth;

    this.setState({
      camera: value,
      zones: [],
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      lineX1: 0,
      lineX2: 0,
      lineY1: 0,
      lineY2: 0,
    });

    // if (user && user.userType == "client")
    this.getSpecificCameraImage(this.state.localBranchId, user.userType, value);
    //   else
    //     this.getSpecificCameraImage(
    //       this.props.auth.user.clientId,
    //       user.userType,
    //       value
    //     );
  };
  branchHandleChange = async (value) => {
    const { user } = this.props.auth;
    await this.setState({ localBranchId: value, cameras: [], camera: "" });
    if (user && user.userType == "user") {
      user.editAccess.map((item) => {
        if (item.branchId == value) this.setState({ cameras: item.cameras });
      });
    }
  };
  onUpSetArrow(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    this.setState({
      x2: x,
      y2: y,
    });
  }
  onDownSetArrow(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    this.setState({
      x1: x,
      y1: y,
    });
  }
  onUpSetLine(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    this.setState({
      lineX2: x,
      lineY2: y,
    });
  }
  onDownSetLine(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    this.setState({
      lineX1: x,
      lineY1: y,
    });
  }
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
    const { x1, x2, y1, y2, lineX2, lineY1, lineY2, lineX1 } = this.state;
    const { user } = this.props.auth;
    return (
      <div>
        {this.state.loading && (
          <Row>
            <Col sm="12" md={{ size: 6, offset: 4 }}>
              <LoadingOutlined style={{ fontSize: 24 }} spin />
            </Col>{" "}
          </Row>
        )}
        {!this.state.fetchedImage.length && (
          <Row>
            <Col sm="12" md={{ size: 6, offset: 4 }}>
              <h5 className="text-info text-align-center">
                SELECT CAMERA TO GET IMAGE
              </h5>
            </Col>
          </Row>
        )}

        <Row className="mb-1">
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
          <Select
            placeholder="Arrow Color"
            // defaultValue="yellow"
            style={{ width: 120 }}
            onChange={(val) => {
              this.setState({ chooseColor: val });
            }}
          >
            <Option value="red">Red</Option>
            <Option value="yellow">Yellow</Option>
            <Option value="green">Green</Option>
          </Select>
          <Col>
            <strong className="ml-1">Learn: How to Assign Zone </strong>
            <InfoCircleOutlined
              style={{ fontSize: "20px" }}
              className=" p-1"
              onClick={this.toggle}
            />
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>
                How To Draw Arrow and Line
              </ModalHeader>
              <ModalBody>
                Firstly, select camera, your added image would be shown here.
                Then place your cursor on image where you want to draw Arrow and
                then drag . A <strong> Arrow</strong> will be drawn then Select{" "}
                <strong>Line </strong>from Radio Button and Draw{" "}
                <strong>Line</strong>. You can modify your changes with sliders
                .<br />
                Enter<strong> Zone name</strong>. Click on
                <strong> Submit</strong>. <br />
                Zone, Cordinates will be saved in your database.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggle}>
                  Ok
                </Button>{" "}
              </ModalFooter>
            </Modal>
          </Col>
          <Col>
            {/* {this.state.zones.length ? (
              <Tag color="#108ee9">
                <strong className="text-bold">Select Zones </strong>
              </Tag>
            ) : null} */}
            {this.state.zones.length ? (
              <Select
                placeholder="Select Zone"
                style={{ width: 120 }}
                onChange={this.handleChange}
              >
                {this.state.zones.map((i, index) => {
                  return (
                    <Option key={index} value={i}>
                      {i}
                    </Option>
                  );
                })}
              </Select>
            ) : null}{" "}
          </Col>
          <Col>
            <Button
              style={{ float: "right" }}
              type="link"
              block
              onClick={this.EditConfigurations}
            >
              Edit Configurations
            </Button>
          </Col>
        </Row>
        <div className="row">
          <div
            // className="container"
            onMouseDown={(e) => {
              let nativeEvent = e.nativeEvent;
              this.state.chooseArrowOrLine == 1
                ? this.onDownSetArrow(nativeEvent)
                : this.onDownSetLine(nativeEvent);
            }}
            onMouseUp={(e) => {
              let nativeEvent = e.nativeEvent;
              this.state.chooseArrowOrLine == 1
                ? this.onUpSetArrow(nativeEvent)
                : this.onUpSetLine(nativeEvent);
            }}
            style={{
              backgroundRepeat: "no-repeat",
              backgroundImage: this.state.fetchedImage.length
                ? `url(${`data:image/jpeg;base64,${this.state.fetchedImage}`})`
                : `url(${require("../../../images/No_Img_Avail.jpg")})`,
            }}
          >
            <Stage width={window.innerWidth} height={window.innerHeight}>
              <Layer>
                <Line
                  className={""}
                  points={[lineX1, lineY1, lineX2, lineY2]}
                  stroke={this.state.chooseColor}
                  strokeWidth={5}
                />
                <Arrow
                  points={[x1, y1, x2, y2]}
                  stroke={this.state.chooseColor}
                  strokeWidth={10}
                ></Arrow>
              </Layer>
            </Stage>
          </div>
          <Jumbotron className="p-3">
            <>
              <h5> Plot Arrow/Line</h5>
              <Radio.Group
                name="radiogroup"
                defaultValue={this.state.chooseArrowOrLine}
                onChange={(e) =>
                  this.setState({ chooseArrowOrLine: e.target.value })
                }
              >
                <Radio value={1}>Arrow</Radio>
                <Radio value={2}>Line</Radio>
              </Radio.Group>
              <Divider />
              <Row>
                <Col>
                  <h5> Plot Arrow</h5>
                  <Row>
                    <Col span={11}>
                      <Slider
                        // min={0}
                        max={1400}
                        onChange={(val) => {
                          // console.log("val", val);
                          this.setState({ x1: val });
                        }}
                        name="x1slider"
                        value={typeof x1 === "number" ? x1 : 0}
                      >
                        &emsp;
                        <span>X1</span>
                      </Slider>
                      <Slider
                        className="mt-4"
                        // min={0}
                        max={1400}
                        onChange={(val) => {
                          // console.log("val2", val);
                          this.setState({ y1: val });
                        }}
                        name="x1slider"
                        value={typeof y1 === "number" ? y1 : 0}
                      >
                        {" "}
                        &emsp;
                        <span>Y1</span>
                      </Slider>
                      <Slider
                        className="mt-4"
                        // min={0}
                        max={1400}
                        onChange={(val) => {
                          // console.log("val", val);
                          this.setState({ x2: val });
                        }}
                        name="x1slider"
                        value={typeof x2 === "number" ? x2 : 0}
                      >
                        &emsp;
                        <span>X2</span>
                      </Slider>
                      <Slider
                        className="mt-4"
                        // min={0}
                        max={1400}
                        onChange={(val) => {
                          // console.log("val2", val);
                          this.setState({ y2: val });
                        }}
                        name="x1slider"
                        value={typeof y2 === "number" ? y2 : 0}
                      >
                        &emsp;
                        <span>Y2</span>
                      </Slider>
                    </Col>
                    <Col span={1}>
                      <InputNumber
                        // min={0}
                        name="x1input"
                        placeholder="X1"
                        max={1500}
                        style={{ margin: "0 16px" }}
                        value={x1}
                        onChange={(val) => {
                          // console.log("vali", val);
                          this.setState({ x1: val });
                        }}
                      />
                      <InputNumber
                        className="mt-2"
                        // min={0}
                        placeholder="Y1"
                        name="x1input"
                        max={2000}
                        style={{ margin: "0 16px" }}
                        value={y1}
                        onChange={(val) => {
                          // console.log("val2i", val);
                          this.setState({ y1: val });
                        }}
                      />
                      <InputNumber
                        className="mt-2"
                        // min={0}
                        placeholder="X2"
                        name="x1input"
                        max={2000}
                        style={{ margin: "0 16px" }}
                        value={x2}
                        onChange={(val) => {
                          // console.log("vali", val);
                          this.setState({ x2: val });
                        }}
                      />
                      <InputNumber
                        className="mt-2"
                        placeholder="Y2"
                        // min={0}
                        name="x1input"
                        max={2000}
                        style={{ margin: "0 16px" }}
                        value={y2}
                        onChange={(val) => {
                          // console.log("val2i", val);
                          this.setState({ y2: val });
                        }}
                      />
                    </Col>
                    <Col></Col>
                    {/* <Col></Col> */}
                  </Row>
                  {/* <hr /> */}
                </Col>
                <Col>
                  <h5> Plot Line</h5>
                  <Row>
                    <Col span={11}>
                      <Slider
                        // min={0}
                        max={2000}
                        onChange={(val) => {
                          // console.log("val", val);
                          this.setState({ lineX1: val });
                        }}
                        name="lineX1slider"
                        value={typeof lineX1 === "number" ? lineX1 : 0}
                      >
                        &emsp;
                        <span>X1</span>
                      </Slider>
                      <Slider
                        className="mt-4"
                        // min={0}
                        max={1000}
                        onChange={(val) => {
                          // console.log("val2", val);
                          this.setState({ lineY1: val });
                        }}
                        name="x1slider"
                        value={typeof lineY1 === "number" ? lineY1 : 0}
                      >
                        {" "}
                        &emsp;
                        <span>Y1</span>
                      </Slider>
                      <Slider
                        className="mt-4"
                        // min={0}
                        max={1500}
                        onChange={(val) => {
                          // console.log("val", val);
                          this.setState({ lineX2: val });
                        }}
                        name="x1slider"
                        value={typeof lineX2 === "number" ? lineX2 : 0}
                      >
                        &emsp;
                        <span>X2</span>
                      </Slider>
                      <Slider
                        className="mt-4"
                        // min={0}
                        max={1000}
                        onChange={(val) => {
                          // console.log("val2", val);
                          this.setState({ lineY2: val });
                        }}
                        name="x1slider"
                        value={typeof lineY2 === "number" ? lineY2 : 0}
                      >
                        &emsp;
                        <span>Y2</span>
                      </Slider>
                    </Col>
                    <Col span={1}>
                      <InputNumber
                        // min={0}
                        name="lineX1input"
                        placeholder="X1"
                        max={1500}
                        style={{ margin: "0 16px" }}
                        value={lineX1}
                        onChange={(val) => {
                          // console.log("vali", val);
                          this.setState({ lineX1: val });
                        }}
                      />
                      <InputNumber
                        className="mt-2"
                        // min={0}
                        placeholder="Y1"
                        name="lineY1input"
                        max={2000}
                        style={{ margin: "0 16px" }}
                        value={lineY1}
                        onChange={(val) => {
                          // console.log("val2i", val);
                          this.setState({ lineY1: val });
                        }}
                      />
                      <InputNumber
                        className="mt-2"
                        // min={0}
                        placeholder="X2"
                        name="lineX2input"
                        max={2000}
                        style={{ margin: "0 16px" }}
                        value={lineX2}
                        onChange={(val) => {
                          // console.log("vali", val);
                          this.setState({ lineX2: val });
                        }}
                      />
                      <InputNumber
                        className="mt-2"
                        placeholder="Y2"
                        // min={0}
                        name="lineY2input"
                        max={2000}
                        style={{ margin: "0 16px" }}
                        value={lineY2}
                        onChange={(val) => {
                          // console.log("val2i", val);
                          this.setState({ lineY2: val });
                        }}
                      />
                    </Col>
                    <Col span={1}></Col>
                    {/* <Col></Col> */}
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className="mt-3">
                  <Input
                    // prefix={<span></span>}
                    placeholder="enter Zone"
                    name="zone"
                    value={this.state.zone}
                    onChange={this.eventHandler}
                  ></Input>

                  <div className="text-danger">
                    {this.validator.message(
                      "Zone Name",
                      this.state.zone,
                      "required"
                    )}
                  </div>
                </Col>
                <Col className="mt-4">
                  <Checkbox
                    color="primary"
                    onClick={(e) =>
                      this.setState({ showPoints: !this.state.showPoints })
                    }
                  >
                    Show Points
                  </Checkbox>{" "}
                </Col>
                {this.state.showPoints ? (
                  <Col className="mt-3">
                    <Input
                      width="50%"
                      // style={{  padding: 1 }}
                      value={`${x1};${y1};${x2};${y2};${lineX1};${lineY1};${lineX2};${lineY2}`}
                    ></Input>
                  </Col>
                ) : null}
                <Col className="mt-3">
                  <Button type="primary" onClick={(e) => this.buttonHandler(e)}>
                    Submit
                  </Button>{" "}
                  {this.state.submitLoader && (
                    <LoadingOutlined style={{ fontSize: 24 }} spin />
                  )}
                </Col>
              </Row>
            </>
          </Jumbotron>{" "}
          {/* </div> */}
        </div>

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

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  ThemeOptions: state.ThemeOptions,
});
export default connect(mapStateToProps, { setEnableClosedSidebar })(MainComp);
