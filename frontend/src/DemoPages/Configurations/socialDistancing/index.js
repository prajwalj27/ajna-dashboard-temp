import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Row, Col, Input, Button } from "reactstrap";
import { Stage, Layer, Rect, Text, Line, Circle } from "react-konva";
import Konva from "konva";
import Config from "../../../config/Config";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Select, Tag } from "antd";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SimpleReactValidator from "simple-react-validator";
import { ToastContainer, toast } from "react-toastify";
const { Option } = Select;
let arr = [];

class MainComp extends React.Component {
  state = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    zone: "",
    direction: "",
    all: [],
    camera: "",
    localClientId: "",
    localBranchId: "",
    userType: this.props.auth.user,
    cameras: [],
    branches: [],
    modal: false,
    camera: "",
    branch: "",
    availableConfiguration: [],
    fetchedImage: "",
    arrPoints: [],
    loading: false,
  };
  toggle = () => this.setState({ modal: !this.state.modal });
  getBranchZones = async () => {
    if (!this.state.camera.length) {
      await this.setState({ camera: [] });
    }
    axios
      .get(
        `${Config.hostName}/api/branch/configureSocial/${this.state.localBranchId}`
      )
      .then((res) => {
        if (res.data.configuration.socialDistancing) {
          this.setState({
            availableConfiguration: res.data.configuration.socialDistancing,
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
        this.getAllBranches(user.clientId);
        this.getBranchZones(user.branchId);
        this.getCameraConfig(user.branchId);
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
    await this.getId();
  }
  eventHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  SubmitFile = (data) => {
    if (data.camera.length) {
      this.setState({ loading: true });
      axios
        .post(
          `${Config.hostName}/api/branch/configureSocial/${this.state.localBranchId}`,
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
          this.setState({
            arrPoints: [],
            direction: "",
            zone: "",
            loading: false,
          });
          toast.success("zone added", {
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
          toast.success("Server Error", {
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
      const { arrPoints, zone, direction, camera } = this.state;
      let obj = { points: arrPoints, zone, direction, camera };
      this.SubmitFile(obj);
      arr = [];
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };
  cameraHandleChange = (value) => {
    const { user } = this.props.auth;
    this.setState({ camera: value });
    this.getSpecificCameraImage(this.state.localBranchId, user.userType, value);

    // this.getSpecificCameraImage(value);
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
    const { user } = this.props.auth;
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
            <strong className="ml-2">Assign Social-Distancing Area </strong>
            <InfoCircleOutlined
              style={{ fontSize: "15px" }}
              className="mr-1 p-2"
              onClick={this.toggle}
            />
            {/* </Button> */}
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>
                How To Draw Region with points
              </ModalHeader>
              <ModalBody>
                Firstly,select <strong>camera</strong> and{" "}
                <strong>clientId</strong> ,Click on image and plot 8 points
                where you want to plot points on image, A{" "}
                <strong>yellow </strong>circle will be drawn on plotted points
                and then <strong>Enter Zone name</strong> and{" "}
                <strong> Direction </strong>in below input field and click on{" "}
                <strong>Submit</strong>. <br />
                Zone, Cordinates and Direction will be saved in your database.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggle}>
                  Ok
                </Button>{" "}
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
        <div
          className="container"
          style={{
            backgroundRepeat: "no-repeat",
            backgroundImage: this.state.fetchedImage.length
              ? `url(${`data:image/jpeg;base64,${this.state.fetchedImage}`})`
              : `url(${require("../../../images/No_Img_Avail.jpg")})`,
          }}
          onClick={(e) => {
            Konva.Util.getRandomColor();
            arr = [
              ...this.state.arrPoints,
              { X: e.nativeEvent.offsetX, Y: e.nativeEvent.offsetY },
              //   { Y: e.nativeEvent.offsetY },
            ];
            this.setState({
              arrPoints: arr,
            });
          }}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
              {this.state.arrPoints.map((i, index, elements) => {
                return (
                  <>
                    <Circle x={i.X} y={i.Y} radius={15} fill="yellow" />
                    <Text text={index + 1} x={i.X} y={i.Y} />
                  </>
                );
                // }
              })}
            </Layer>
          </Stage>
        </div>
        <Row> </Row>
        <Row>
          <Col md-5 className="mt-2">
            <Input
              placeholder="enter Zone"
              name="zone"
              value={this.state.zone}
              onChange={this.eventHandler}
            ></Input>
            '
            <div className="text-danger">
              {this.validator.message("zone", this.state.zone, "required")}
            </div>
          </Col>
          <Col md-5 className="mt-2">
            <Input
              placeholder="enter Direction"
              name="direction"
              value={this.state.direction}
              onChange={this.eventHandler}
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
        <Button color="primary" onClick={(e) => this.buttonHandler(e)}>
          Submit
        </Button>{" "}
        {/* <Button color="secondary" onClick={(e) => this.SubmitFile(e)}>
          Done
        </Button> */}
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
