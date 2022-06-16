import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Space,
  Checkbox,
  DatePicker,
  Select,
  Tag,
} from "antd";
import Config from "../../../config/Config";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import SimpleReactValidator from "simple-react-validator";
import { Redirect } from "react-router-dom";
import Loader from "react-loaders";
import Alert from "../../../layouts/Alert";
import { setAlert } from "../../../actions/alert.actions";
import SimpleReactValidator from "simple-react-validator";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {
  addDeviceConfiguration,
  editDeviceConfiguration,
  deleteDeviceConfiguration,
} from "../../../actions/user.actions";
import axios from "axios";
import PropTypes from "prop-types";
import {
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const { Option } = Select;

const EditableContext = React.createContext();
let dataValues = [];
const { Column } = Table;
class AddDevice extends React.Component {
  state = {
    dataSource: [],
    modal: false,
    selectedLink: "",
    loading: "",
    current_deviceId: "",
    // availableCamera: [],
    deviceName: "",
    mac: "",
    deviceCameras: [],
    availableDevice: [],
    tableData: [],
    isEditing: false,
  };

  async componentWillMount() {
    this.validator = new SimpleReactValidator();
  }
  getCameraConfig = async () => {
    try {
      await axios
        .get(
          `${Config.hostName}/api/branch/camera/${this.props.auth.user.branchId}`
        )
        .then(async (res) => {
          if (res.data) {
            await this.setState({
              dataSource: res.data.camera,
              gotResponse: true,
              count: res.data.camera.length,
            });
          }
        });
    } catch (err) {
      this.setState({ gotResponse: true });
      console.log("err", err);
    }
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
        console.log("response", res.data);
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  };
  start = async () => {
    axios
      .post(`${Config.hostName}/api/awsTrigger`, {
        trigger: JSON.stringify({
          action: "run",
          Mcid: this.props.auth.user.clientId,
          Bid: this.props.auth.user.branchId,
          // Cid: "07",
          // RTSPurl: "rtsp://admin:admin123@192.168.1.7:554/11",
        }),
      })
      .then((res) => {
        console.log("response", res.data);
        // this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  stop = async () => {
    axios
      .post(`${Config.hostName}/api/awsTrigger`, {
        trigger: JSON.stringify({
          action: "stop",
          Mcid: this.props.auth.user.clientId,
          Bid: this.props.auth.user.branchId,
          // Cid: "07",
          // RTSPurl: "rtsp://admin:admin123@192.168.1.7:554/11",
        }),
      })
      .then((res) => {
        console.log("response", res.data);
        // this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getClientBranches = async (id) => {
    axios
      .get(`${Config.hostName}/api/branch/${this.props.auth.user.clientId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      })
      .then(async (res) => {
        console.log("branches", res.data.length);
        await this.setState({ branches: res.data.length });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getDeviceConfig = async () => {
    try {
      await axios
        .get(
          `${Config.hostName}/api/branch/device/${this.props.auth.user.branchId}`
        )
        .then(async (res) => {
          this.setState({ availableDevice: res.data });
          this.tableData(res.data);
        });
    } catch (err) {
      console.log("err", err);
    }
  };
  tableData = (data) => {
    dataValues = [];
    this.props.auth.user.device.length &&
      this.props.auth.user.device.map((i, index) => {
        let obj = Object.assign(i);
        obj.key = index + 1;
        dataValues.push(obj);
      });
    this.setState({ tableData: dataValues });
  };
  handleEdit = (val) => {
    this.toggle();
    this.setState({
      deviceName: val.deviceName,
      mac: val.macAddress,
      isEditing: true,
      current_deviceId: val.deviceId,
    });
  };
  handleDelete = (val) => {
    this.props.deleteDeviceConfiguration(
      this.props.auth.user.branchId,
      val.deviceId
    );
  };
  stop = () => {};
  submitHandler = () => {
    if (this.validator.allValid()) {
      this.submit();
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };
  submit = async () => {
    let device = {
      deviceName: this.state.deviceName,
      deviceId: `${this.props.auth.user.branchId}_${this.state.deviceName}`,
      macAddress: this.state.mac,
      cameras: this.state.deviceCameras,
    };
    let emptyArr = [];
    {
      this.props.auth.user.device.map((i) => {
        emptyArr.push(i.deviceName);
      });
    }
    if (emptyArr.includes(this.state.deviceName)) {
      toast.error("Device Name Already exist", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      try {
        await this.saveConfig();
        this.props.addDeviceConfiguration(
          this.props.auth.user.branchId,
          device
        );
        this.setState({ modal: !this.state.modal });

        // await axios
        //   .post(
        //     `${Config.hostName}/api/branch/device/${this.props.auth.user.branchId}`,
        //     device,
        //     {
        //       headers: {
        //         "Content-Type": "application/json",
        //         Accept: "application/json",
        //         "x-auth-token": this.props.auth.token,
        //       },
        //     }
        //   )
        //   .then(async (res) => {
        //     toast.success("Device Added", {
        //       position: "top-right",
        //       autoClose: 5000,
        //       hideProgressBar: true,
        //       closeOnClick: true,
        //       pauseOnHover: true,
        //       draggable: true,
        //     });
        //   });
      } catch (err) {
        console.log("err", err);
      }
    }
  };
  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChange = async (value) => {
    await this.setState({ deviceCameras: value });
  };

  SaveEditing = () => {
    const device = {
      deviceName: this.state.deviceName,
      mac: this.state.mac,
      deviceId: this.state.current_deviceId,
    };
    if (this.validator.allValid()) {
      this.props.editDeviceConfiguration(
        this.props.auth.user.branchId,
        this.state.current_deviceId,
        device
      );
      this.setState({ modal: false });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };
  toggle = () => this.setState({ modal: !this.state.modal });
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    return (
      <div>
        <Alert />{" "}
        <div>
          {" "}
          <Button
            onClick={this.toggle}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add a Device
          </Button>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          // contentClassName="custom-modal-video"
        >
          <ModalHeader toggle={this.toggle}>Add Device</ModalHeader>
          <ModalBody>
            <div id="my-node">
              <form>
                <div className="form-group row">
                  <label for="staticEmail" className="col-sm-4 col-form-label">
                    Device Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Device Name"
                      autoComplete="deviceName"
                      onChange={this.inputHandler}
                      name="deviceName"
                      value={this.state.deviceName}
                    />
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
                  <label className="col-sm-4 col-form-label">Mac Address</label>
                  <div className="col-sm-8">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Mac Address"
                      autoComplete="mac"
                      onChange={this.inputHandler}
                      name="mac"
                      value={this.state.mac}
                    />
                  </div>
                  <div className="text-danger">
                    {this.validator.message(
                      "Mac Address",
                      this.state.mac,
                      "required"
                    )}
                  </div>
                </div>
                {/* <div className="form-group row">
                  <label for="staticEmail" className="col-sm-4 col-form-label">
                    Select Camera
                  </label>
                  <div className="col-sm-8">
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange}
                    >
                      {this.props.auth.user &&
                        this.props.auth.user.camera &&
                        this.props.auth.user.camera.map((i, index) => {
                          return (
                            <Option key={i.cameraName}>{i.cameraName}</Option>
                          );
                        })}
                    </Select>
                  </div>
                </div> */}

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
              <Button
                type="primary"
                color="primary"
                onClick={this.submitHandler}
              >
                Save Device
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
        <Table dataSource={this.props.auth.user.device}>
          {/* <Column title="Serial No." dataIndex="key" key="key" /> */}
          <Column title="Device ID" dataIndex="deviceId" key="deviceId" />
          <Column title="Device Name" dataIndex="deviceName" key="deviceName" />
          <Column title="Mac Address" dataIndex="macAddress" key="macAddress" />
          {/* <Column
            title="Camera"
            dataIndex="cameras"
            key="cameras"
            render={(tags) => (
              <>
                {tags.length &&
                  tags.map((tag) => {
                    let color = "green";
                    return (
                      <Tag color="green" key={tag}>
                        {tag}
                      </Tag>
                    );
                  })}
              </>
            )}
          /> */}
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <button
                  className="btn-success"
                  onClick={() => this.start(text)}
                >
                  Run
                </button>
                <button className="btn-danger" onClick={() => this.stop(text)}>
                  Stop
                </button>
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
AddDevice.propTypes = {
  setAlert: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addDeviceConfiguration: PropTypes.func.isRequired,
  editDeviceConfiguration: PropTypes.func.isRequired,
  deleteDeviceConfiguration: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps, {
  addDeviceConfiguration,
  setAlert,
  editDeviceConfiguration,
  deleteDeviceConfiguration,
})(AddDevice);
