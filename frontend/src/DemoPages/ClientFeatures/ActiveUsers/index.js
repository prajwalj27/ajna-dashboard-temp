import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
import {
  Checkbox,
  Radio,
  DatePicker,
  Col,
  Row,
  Table,
  Space,
  Tag,
  TreeSelect,
  Select,
  Tooltip,
  Spin,
  Button,
} from "antd";
import SimpleReactValidator from "simple-react-validator";
import {
  Modal,
  ModalHeader,
  Alert,
  CardBody,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  LoadingOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import { login, logout } from "../../../actions/user.actions";
import { setAlert } from "../../../actions/alert.actions";
import { connect } from "react-redux";
const { Column } = Table;
const defaultmodules = [""];
const CheckboxGroup = Checkbox.Group;

const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;
const { Option } = Select;
class ActiveUser extends Component {
  state = {
    alertMsg: "",
    alertColor: "",
    localId: "",
    users: [],
    modal: false,
    ShowEditUserComponent: false,
    selectedCamera: [],
    EmployeeId: "",
    name: "",
    email: "",
    contact: "",
    location: "",
    modules: defaultmodules,
    indeterminate: true,
    checkAll: false,
    token: "",
    NoOfCameras: "",
    alertMsg: "",
    alertColor: "",
    isMaster: true,
    value: [],
    branches: [],
    treeData: [],
    camera: [],
    editAccess: [],
    loading: false,
    usersCount: 0,
    // users: [],
    userBranches: [],
  };
  fetchUsers = async () => {
    await axios
      .get(`${Config.hostName}/api/users/${this.state.localId}`)
      .then(async (res) => {
        await this.setState({ users: res.data });
      })
      .catch((err) => {});
  };
  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }
  DeleteUser = async (data) => {
    await axios
      .delete(`${Config.hostName}/api/users/${data.EmployeeId}`, {
        params: {
          clientId: this.props.auth.user.clientId,
        },
      })
      .then(async (res) => {
        toast.success(`User Deleted`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 200);
      })

      .catch((err) => {});
  };
  getId = async () => {
    if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "client"
    ) {
      if (this.props.auth.user.clientId) {
        await this.setState({ localId: this.props.auth.user.clientId });
        await this.fetchUsers();
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localId: this.props.admin.selectedClient.clientId,
        });
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  toggle = () => this.setState({ modal: !this.state.modal });
  componentDidMount() {
    this.getClientBranches();
    this.getId();
  }
  onChange = (modules) => {
    this.setState({
      modules,
      indeterminate:
        !!modules.length &&
        modules.length < this.props.auth.user.modules.length,
      checkAll: modules.length === this.props.auth.user.modules.length,
    });
  };
  onCheckAllChange = (e) => {
    this.setState({
      modules: e.target.checked ? this.props.auth.user.modules : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  EditUser = async (data, re) => {
    const { modules, EmployeeId, email, name, editAccess, camera } = data;

    await this.setState({
      ShowEditUserComponent: true,
      modal: !this.state.modal,
      modules,
      EmployeeId,
      email,
      name,
      editAccess: [],
      camera,
    });
  };
  mappedSelectedTree = (selectedData) => {
    let Data = [];
    Data = selectedData.map((i) => {
      return i.camera;
    });
    let arr = this.state.treeData;
    let temp = [];
    Data.map((i) => {
      for (let j = 0; j < arr.length; j++) {
        let child = arr[j].children;
        for (let k = 0; k < child.length; k++) {
          if (i.cameraId == child[k].value) {
            let obj = {};
            obj.branchName = arr[j].title;
            obj.branchId = arr[j].value;
            obj.cameras = [child[k]];
            temp.push(obj);
          }
        }
      }
    });
    let output = [];
    temp.forEach(function (item) {
      var existing = output.filter(function (v, i) {
        return v.branchId == item.branchId;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].cameras = [
          ...output[existingIndex].cameras,
          ...item.cameras,
        ];
      } else {
        item.cameras = [...item.cameras];
        output.push(item);
      }
    });
    output.map((i) => {
      const oldObj = i.cameras;
      i.cameras = [];
      let newarr = [];
      oldObj.map((item) => {
        let obj = {
          cameraName: item.title,
          cameraId: item.value,
        };
        newarr.push(obj);
      });
      i.cameras.push(newarr);
    });

    this.setState({ camera: output });
  };
  SendSelectedCameraObj = async () => {
    const { branches, value, camera } = this.state;
    let userBranches = [];
    let selectedCamera = [];

    for (let val = 0; val < value.length; val++) {
      branches.map((i) => {
        if (i.branchId == value[val]) {
          i.camera.map((j) => {
            userBranches.push(value[val]);
            selectedCamera.push({ camera: j, branchName: i.branchName });
          });
        } else {
          i.camera.map((j) => {
            if (j.cameraId == value[val]) {
              userBranches.push(i.branchId);
              selectedCamera.push({ camera: j, branchName: i.branchName });
            }
          });
        }
      });
    }
    let set = new Set(userBranches);
    userBranches = Array.from(set);
    this.mappedSelectedTree(selectedCamera);
    await this.setState({ userBranches, selectedCamera });
  };
  editCamera = async (change) => {
    this.setState({ editAccess: change });
  };
  onTreeChange = async (value) => {
    await this.setState({ value });
    await this.SendSelectedCameraObj();
  };
  treeStructure = async (data) => {
    let arr = [];
    data.map((i) => {
      let obj = {};
      obj.title = i.branchName;
      obj.value = i.branchId;
      let childArr = [];
      i.camera.map((j) => {
        let childObj = {};
        childObj.title = j.cameraName;
        childObj.value = j.cameraId;
        childArr.push(childObj);
      });
      obj.children = childArr;
      arr.push(obj);
    });
    await this.setState({ treeData: arr });
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
        await this.setState({ branches: res.data });
        this.treeStructure(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  submitHandler = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      let {
        name,
        EmployeeId,
        contact,
        camera,
        modules,
        location,
        email,
        editAccess,
        userBranches,
      } = this.state;

      let camera_game = [...camera];
      let EmptyArr = [];
      camera_game.map((item) => {
        let obj = {};
        obj.branchName = item.branchName;
        obj.branchId = item.branchId;
        let newObj = item.cameras[0];
        let subObj = newObj.filter((i) => {
          if (editAccess.includes(i.cameraId)) return i;
        });
        obj.cameras = subObj;
        EmptyArr = [...EmptyArr, obj];
      });

      const data = {
        name,
        EmployeeId,
        modules,
        email,
        clientId: this.props.auth.user.clientId,
        password: "123456",
        camera,
        userType: "user",
        editAccess: EmptyArr,
        userBranches,
      };

      this.setState({ loading: true });
      axios
        .post(Config.hostName + "/api/users/edituser", data, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((Res) => {
          this.toggle();
          this.setState({ loading: false });

          toast.success(`User Edited `, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setTimeout(() => {
            window.location.reload();
          }, 200);
        })
        .catch((err) => {
          this.setState({ loading: false });
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
        });
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  };
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { buttonLabel, className } = this.props;
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const treeData = this.state.treeData;
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onTreeChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: "Please select",
      style: {
        width: "100%",
      },
    };
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">Active Users</div>
          <div className="card-body">
            <Row>
              <Col>
                <CardBody>
                  {this.state.users.length ? (
                    <Table dataSource={this.state.users} value={1}>
                      <Column
                        title="Employee Id"
                        dataIndex="EmployeeId"
                        key="EmployeeId"
                      />
                      <Column title="Name" dataIndex="name" key="name" />{" "}
                      <Column
                        title="Client ID"
                        dataIndex="clientId"
                        key="clientId"
                      />
                      (
                      <Column
                        title="Modules"
                        dataIndex="modules"
                        key="modules"
                        render={(tags) => (
                          <>
                            {tags.map((tag) => {
                              let color = "green";
                              return (
                                <Tag color={color} key={tag}>
                                  {tag}
                                </Tag>
                              );
                            })}
                          </>
                        )}
                      />
                      <Column title="Email" dataIndex="email" key="email" />
                      {/* <Column
                        title="camera"
                        dataIndex="camera"
                        key="camera"
                        render={(tags) => (
                          <>
                            {tags.map((tag, index) => {
                              let color = "green";
                              // tag.children.map((item) => {
                              return (
                                <Tag color={color} key={index}>
                                  {tag.title}
                                </Tag>
                              );
                              // });
                            })}
                          </>
                        )}
                      /> */}
                      <Column
                        title="Operation"
                        key="action"
                        render={(text, record) => (
                          <Space size="middle">
                            <Button
                              type="link"
                              onClick={() => this.EditUser(text, record)}
                            >
                              <EditOutlined />
                            </Button>
                            <Button
                              type="link"
                              onClick={() => this.DeleteUser(text)}
                            >
                              <DeleteOutlined />
                            </Button>
                          </Space>
                        )}
                      />
                    </Table>
                  ) : null}
                </CardBody>{" "}
              </Col>
              <Col>
                {this.state.alertMsg.length ? (
                  <Alert color={this.state.alertColor}>
                    {this.state.alertMsg}
                  </Alert>
                ) : null}
              </Col>
              <Col></Col>
            </Row>
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
        </div>

        {this.state.ShowEditUserComponent ? (
          <div>
            <div>
              <Button color="danger" onClick={this.toggle}>
                {buttonLabel}
              </Button>
              <Modal
                size="xl"
                isOpen={this.state.modal}
                toggle={this.toggle}
                className={className}
              >
                <ModalHeader toggle={this.toggle} charCode="Y">
                  Edit User
                </ModalHeader>
                <ModalBody>
                  <form>
                    <div className="form-group row">
                      <label
                        for="staticEmail"
                        className="col-sm-2 col-form-label"
                      >
                        Client ID
                      </label>
                      <div className="col-sm-8">
                        <input
                          className="form-control"
                          // type="text"
                          disabled
                          // placeholder="Enter Employee ID"
                          // autoComplete="EmployeeId"
                          onChange={this.inputHandler}
                          // name="EmployeeId"
                          value={this.props.auth.user.clientId}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">
                        User Name
                      </label>
                      <div className="col-sm-8">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Name"
                          autoComplete="name"
                          onChange={this.inputHandler}
                          name="name"
                          value={this.state.name}
                        />
                        <div className="text-danger">
                          {/* {this.validator.message(
                                "name",
                                this.state.name,
                                "required"
                              )} */}
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        for="staticEmail"
                        className="col-sm-2 col-form-label"
                      >
                        Email
                      </label>
                      <div className="col-sm-8">
                        <input
                          className="form-control"
                          type="email"
                          disabled
                          placeholder="Email"
                          autoComplete="email"
                          onChange={this.inputHandler}
                          name="email"
                          value={this.state.email}
                        />
                        <div className="text-danger">
                          {/* {this.validator.message(
                                "email",
                                this.state.email,
                                "required"
                              )} */}
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        for="staticEmail"
                        className="col-sm-2 col-form-label"
                      >
                        Password
                      </label>
                      <div className="col-sm-8">
                        <input
                          className="form-control"
                          disabled
                          value="123456"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        for="staticEmail"
                        className="col-sm-2 col-form-label"
                      >
                        <Tooltip
                          className="mb-2"
                          placement="topLeft"
                          title="User Can view Camera"
                        >
                          <InfoCircleOutlined className="mr-2" />
                        </Tooltip>{" "}
                        Select Camera
                      </label>
                      <div className="col-sm-8">
                        <TreeSelect {...tProps} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        for="staticEmail"
                        className="col-sm-2 col-form-label"
                      >
                        <Tooltip
                          className="mb-2"
                          placement="topLeft"
                          title="User Can edit Configurations"
                        >
                          <InfoCircleOutlined className="mr-2" />
                        </Tooltip>
                        Edit Access
                      </label>
                      <div className="col-sm-8">
                        <div className="site-checkbox-all-wrapper">
                          <Select
                            mode="multiple"
                            allowClear
                            style={{ width: "100%" }}
                            placeholder="Please select"
                            value={this.state.editAccess}
                            // defaultValue={["a10", "c12"]}
                            onChange={(change) => this.editCamera(change)}
                          >
                            {this.state.selectedCamera.length
                              ? this.state.selectedCamera.map((i, index) => {
                                  return (
                                    <Option
                                      key={index}
                                      value={i.camera.cameraId}
                                    >{`${i.branchName}-${i.camera.cameraName}`}</Option>
                                  );
                                })
                              : null}
                          </Select>
                        </div>
                        <br />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        for="staticEmail"
                        className="col-sm-2 col-form-label"
                      >
                        Your Modules
                      </label>
                      <div className="col-sm-8">
                        <div>
                          <div className="site-checkbox-all-wrapper">
                            <Checkbox
                              indeterminate={this.state.indeterminate}
                              onChange={this.onCheckAllChange}
                              checked={this.state.checkAll}
                            >
                              Check all
                            </Checkbox>
                          </div>
                          <br />
                          <CheckboxGroup
                            options={this.props.auth.user.modules}
                            value={this.state.modules}
                            onChange={this.onChange}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </ModalBody>
                <ModalFooter>
                  {/* <button
                    color="primary"
                    onClick={(e) => {
                      this.submitHandler(e);
                    }}
                    className="ml-5 col-2 btn btn-primary text-center"
                  >
                    Save User
                  </button> */}
                  {this.state.loading && <Spin indicator={antIcon} />}
                  <Button
                    color="primary"
                    onClick={(e) => {
                      this.submitHandler(e);
                    }}
                  >
                    Save User
                  </Button>{" "}
                  <Button color="secondary" onClick={this.toggle}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

ActiveUser.propTypes = {
  setAlert: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(ActiveUser);
