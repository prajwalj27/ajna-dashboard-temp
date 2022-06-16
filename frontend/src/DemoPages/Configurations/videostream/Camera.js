import React from "react";
import { Table, Tooltip, Button, Space, Select } from "antd";
import Config from "../../../config/Config";
import SimpleReactValidator from "simple-react-validator";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Redirect } from "react-router-dom";
import Loader from "react-loaders";
import { setAlert } from "../../../actions/alert.actions";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {
  addCameraConfiguration,
  deleteCameraConfiguration,
  editCameraConfiguration,
} from "../../../actions/user.actions";
import {
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import PropTypes from "prop-types";
const { Option } = Select;
const { Column } = Table;

class AddCamera extends React.Component {
  state = {
    dataSource: [],
    modal: false,
    count: 0,
    selectedLink: "",
    gotResponse: false,
    loading: "",
    deviceName: "",
    cameraName: "",
    current_camera_id: "",
    current_key: 0,
    link: "",
    device: "",
    availableDevice: [],
    tableData: [],
    isEditing: false,
    allConfigurations: [],
  };

  async componentWillMount() {
    this.validator = new SimpleReactValidator();
  }
  getCameraConfig = async () => {
    this.setState({
      dataSource: this.props.auth.user.camera,
      gotResponse: true,
      count: this.props.auth.user.camera.length,
    });
  };
  saveConfig = async () => {
    this.setState({ loading: true });
    axios
      .post(`${Config.hostName}/api/awsTrigger`, {
        trigger: JSON.stringify({
          action: "save_config",
          Mcid: this.props.auth.user.clientId,
          Bid: this.props.auth.user.branchId,
          // Cid: "07",
          // RTSPurl: "rtsp://admin:admin123@192.168.1.7:554/11",
        }),
      })
      .then((res) => {
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  };
  handleAdd = async () => {
    if (this.validator.allValid()) {
      this.handleAddCamera();
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleAddCamera = async () => {
    if (
      this.props.auth.user &&
      this.props.auth.user.NoOfCameras > this.props.auth.user.camera.length
    ) {
      var newData = {
        cameraId: `${this.props.auth.user.camera.length}_${this.props.auth.user.branchId}`,
        key: this.props.auth.user.camera.length,
        cameraName: this.state.cameraName,
        deviceId: this.state.device,
        cameraStatus: true,
        Link: this.state.link,
        deviceName: this.state.deviceName,
      };
      let flag = this.props.auth.user.camera.filter(
        (i) => i.cameraId == newData.cameraId
      );
      if (flag.length) {
        let newCount = this.props.auth.user.camera.length + 1;
        let obj = Object.assign(newData);
        obj.cameraId = `${newCount}_${this.props.auth.user.branchId}`;
        obj.key = newCount;
      }
      this.CameraSave(newData);
      await this.setState({ modal: !this.state.modal });
    } else {
      {
        toast.error("Need to buy more camera", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };
  handleDelete = async (data) => {
    this.props.deleteCameraConfiguration(
      this.props.auth.user.branchId,
      data.cameraId
    );
  };
  getConfigurations = async () => {
    try {
      await axios
        .get(
          `${Config.hostName}/api/branch/allconfigure/${this.props.auth.user.branchId}`
        )
        .then(async (res) => {
          await this.setState({ allConfigurations: res.data });
        });
    } catch (err) {
      console.log("err", err);
    }
  };
  downloadConfigurations = async () => {
    await this.getConfigurations();
    await this.downloadTxtFile();
  };
  handleEdit = async (data) => {
    this.toggle();
    this.setState({
      isEditing: true,
      cameraName: data.cameraName,
      current_camera_id: data.cameraId,
      current_key: data.key,
      device: data.deviceId,
      link: data.Link,
      deviceName: data.deviceName,
    });
  };
  CameraSave = async (data) => {
    this.props.addCameraConfiguration(this.props.auth.user.branchId, data);
    this.setState({
      cameraName: "",
      deviceId: "",
      link: "",
      deviceName: "",
    });
  };
  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChange = async (value) => {
    let id = value.split(":")[0];
    let name = value.split(":")[1];
    await this.setState({ device: id, deviceName: name });
  };
  SaveEditing = async () => {
    const camera = {
      deviceId: this.state.device,
      deviceName: this.state.deviceName,
      Link: this.state.link,
      cameraName: this.state.cameraName,
    };
    if (this.validator.allValid()) {
      this.props.editCameraConfiguration(
        this.props.auth.user.branchId,
        this.state.current_camera_id,
        camera
      );
      this.setState({ modal: false });
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  };
  async componentDidMount() {
    await this.getCameraConfig();
    await this.setState({ tableData: this.state.dataSource });
  }
  SnapShot = async () => {
    axios
      .post(`${Config.hostName}/api/awsTrigger`, {
        trigger: JSON.stringify({
          action: "snapshot",
          Mcid: this.props.auth.user.clientId,
          Bid: this.props.auth.user.branchId,
          Cid: "07",
          RTSPurl: "rtsp://admin:admin123@192.168.1.7:554/11",
        }),
      })
      .then((res) => {
        console.log("response", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(this.state.allConfigurations)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "Configurations.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  toggle = () => this.setState({ modal: !this.state.modal });
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }

    return (
      <div>
        {this.state.gotResponse ? (
          <div>
            {" "}
            <Button
              onClick={this.toggle}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Add a Camera
            </Button>
          </div>
        ) : (
          <Loader />
        )}

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          // contentClassName="custom-modal-video"
        >
          <ModalHeader toggle={this.toggle}>Add Camera</ModalHeader>
          <ModalBody>
            <div id="my-node">
              <form>
                <div className="form-group row">
                  <label for="staticEmail" className="col-sm-4 col-form-label">
                    Camera Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Camera Name"
                      autoComplete="cameraName"
                      onChange={this.inputHandler}
                      name="cameraName"
                      value={this.state.cameraName}
                    />
                  </div>
                  <div className="text-danger">
                    {this.validator.message(
                      "Camera Name",
                      this.state.cameraName,
                      "required"
                    )}
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Link</label>
                  <div className="col-sm-8">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="link "
                      autoComplete="link"
                      onChange={this.inputHandler}
                      name="link"
                      value={this.state.link}
                    />
                  </div>
                  <div className="text-danger">
                    {this.validator.message(
                      "Link",
                      this.state.link,
                      "required"
                    )}
                  </div>
                </div>
                <div className="form-group row">
                  <label for="staticEmail" className="col-sm-4 col-form-label">
                    Select Device
                  </label>
                  <div className="col-sm-8">
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={(e) => this.handleChange(e)}
                      value={this.state.deviceName}
                    >
                      {this.props.auth.user &&
                        this.props.auth.user.device &&
                        this.props.auth.user.device.map((i, index) => {
                          return (
                            <Option
                              key={index}
                              value={`${i.deviceId}:${i.deviceName}`}
                            >
                              {i.deviceName}
                            </Option>
                          );
                        })}
                    </Select>
                  </div>
                  <div className="text-danger">
                    {this.validator.message(
                      "Device Name",
                      this.state.deviceName,
                      "required"
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* <button
                    onClick={(e) => this.submitHandler(e)}
                    className="ml-5 col-4 btn btn-primary text-center"
                  >
                    Save Device
                  </button> */}
                </div>
              </form>
            </div>
          </ModalBody>
          <ModalFooter>
            {!this.state.isEditing ? (
              <Button type="primary" color="primary" onClick={this.handleAdd}>
                Save Camera
              </Button>
            ) : (
              <Button type="primary" color="primary" onClick={this.SaveEditing}>
                Save Changes
              </Button>
            )}
            <Button type="secondary" color="secondary" onClick={this.toggle}>
              Cancel
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Table dataSource={this.props.auth.user.camera}>
          <Column title="Camera ID" dataIndex="cameraId" key="cameraId" />
          <Column title="Camera Name" dataIndex="cameraName" key="cameraName" />
          <Column title="Device Name" dataIndex="deviceName" key="deviceName" />
          <Column title="link Address" dataIndex="Link" key="Link" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <Button type="dashed" onClick={() => this.SnapShot(text)}>
                  Snapshot
                </Button>
              </Space>
            )}
          />
          <Column
            title="Operation"
            key="Operation"
            render={(text, record) => (
              <Space size="middle">
                <Button
                  type="link"
                  // className="btn-primary"
                  onClick={() => this.handleEdit(text)}
                >
                  <EditOutlined />
                </Button>
                <Button type="link" onClick={() => this.handleDelete(text)}>
                  <DeleteOutlined />
                </Button>
              </Space>
            )}
          />
        </Table>
        <br />
        <div onClick={this.downloadConfigurations}>
          <Tooltip placement="topLeft" title="Download All Camera Coordinates">
            <InfoCircleOutlined className=" mr-1 mb-2" />
          </Tooltip>{" "}
          <Button
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
            size="large"
            onClick={this.downloadConfigurations}
          >
            Download
          </Button>
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
AddCamera.propTypes = {
  setAlert: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addCameraConfiguration: PropTypes.func.isRequired,
  deleteCameraConfiguration: PropTypes.func.isRequired,
  editCameraConfiguration: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps, {
  addCameraConfiguration,
  setAlert,
  deleteCameraConfiguration,
  editCameraConfiguration,
})(AddCamera);
