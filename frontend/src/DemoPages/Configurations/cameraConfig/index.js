import React, { Component } from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import { Redirect } from "react-router-dom";
import FileBase64 from "react-file-base64";
import Config from "../../../config/Config";
import { Select, Tag, TreeSelect } from "antd";
import { Card, Button, Row, Col } from "reactstrap";
import axios from "axios";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SimpleReactValidator from "simple-react-validator";
import { ToastContainer, toast } from "react-toastify";
const { Option } = Select;
class MainComp extends React.Component {
  state = {
    files: [],
    zone: "",
    direction: "",
    all: [],
    localclientId: "",
    localBranchId: "",
    cameras: [],
    branches: [],
    modal: false,
    camera: "",
    branch: "",
    availableConfiguration: [],
    arrPoints: [],
    imageUrl: "",
    loading: false,
    userType: "",
    treeval: undefined,
    imageRecieved: false,
    imgrecieve: "",
  };
  onChange = (treeval) => {
    this.setState({ treeval, camera: treeval });
  };
  toggle = () => this.setState({ modal: !this.state.modal });
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
        // console.log("id", res.data);
        // if(res.data.branchId)
        this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
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
  getId = async () => {
    const { user } = this.props.auth;
    if (this.props.auth && user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          localclientId: user.clientId,
          localBranchId: user.branchId,
          cameras: user.camera,
        });
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
          localclientId: this.props.admin.selectedClient.clientId,
          localBranchId: this.props.admin.selectedClient.branchId,
          cameras: this.props.admin.selectedClient.camera,
        });
        await this.setState({
          cameras: this.props.admin.selectedClient.camera,
        });
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  async componentWillMount() {}
  async componentDidMount() {
    await this.getId();
  }
  storeBranchImage = (id) => {
    axios
      .post(
        `${Config.hostName}/api/branch/configure-image/${id}/${this.props.auth.user.userType}`,
        {
          image: this.state.imageUrl,
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
          loading: false,
          imageUrl: "",
          camera: "",
          branch: "",
          files: "",
          // cameras: [],
        });
        toast.success("image added", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // this.setState({ data: res.data });
        // this.tableData(res.data);
      })
      .catch((err) => {
        console.log("Configuration err", err);
      });
  };
  SubmitFile = () => {
    if (this.state.camera.length && this.state.imageUrl.length) {
      this.setState({ loading: true });
      if (this.props.auth.user.userType == "client")
        this.storeBranchImage(this.state.localBranchId);
      else this.storeBranchImage(this.state.localclientId);
    } else {
      toast.error("Haven't Selected Camera or Image", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  getFiles = (files) => {
    let replace = files[0].base64;
    let initial = replace.split("base64,")[0];
    replace = replace.split("base64,")[1];
    this.setState({ files: files, imageUrl: replace });
  };
  cameraHandleChange = async (value) => {
    await this.setState({ camera: value });
    // await this.getSpecificCameraImage();
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
              imageRecieved: true,
              imageUrl: res.data,
              loading: false,
              imgrecieve: `data:image/jpeg${res.data}`,
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
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    return (
      <div>
        <Card className="p-3">
          <Row>
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
              {" "}
              <FileBase64 multiple={true} onDone={this.getFiles} />
            </Col>
            <Col className="pl-0">
              <Button color="primary" onClick={(e) => this.SubmitFile(e)}>
                Submit
              </Button>{" "}
              {this.state.loading && (
                <LoadingOutlined style={{ fontSize: 24 }} spin />
              )}
            </Col>
          </Row>

          {this.state.files.length ? (
            <img src={this.state.files[0].base64}></img>
          ) : null}
          {this.state.imageRecieved ? (
            <img src={this.state.imgrecieve}></img>
          ) : null}
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
        </Card>
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
