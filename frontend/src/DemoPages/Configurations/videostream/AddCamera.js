import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, Space } from "antd";
import Config from "../../../config/Config";
import Alert from "../../../layouts/Alert";
import { setAlert } from "../../../actions/alert.actions";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Loader from "react-loaders";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { addCameraConfiguration } from "../../../actions/user.actions";
import Rtsp from "./rtspVideo";
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  state = {
    dataSource: [],
    modal: false,
    count: 0,
    selectedLink: "",
    gotResponse: false,
    branchId: "",
    availableCameraNames: [],
    availableCameraId: [],
  };
  columns = [
    {
      title: "Camera Id",
      dataIndex: "cameraId",
      // editable: true,
      width: "20%",
    },
    {
      title: "Camera Name",
      dataIndex: "cameraName",
      width: "30%",
      editable: true,
    },
    {
      title: "Device ID",
      dataIndex: "deviceId",
      width: "30%",
      editable: true,
    },
    {
      title: "Link",
      dataIndex: "Link",
      editable: true,
      width: "40%",
    },
    {
      title: "Live Video",
      width: "20%",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <button
            color="primary"
            style={{ border: "none", background: "white", color: "blue" }}
            onClick={async () => {
              await this.setState({ selectedLink: record.Link });
              await this.setState({ modal: !this.state.modal });
              // console.log(this.state.modal);
            }}
          >
            Watch
          </button>
        </Space>
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              this.handleDelete(record.key);
            }}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
  getCameraConfig = async () => {
    try {
      const { user } = this.props.auth;
      await axios
        .get(
          `${Config.hostName}/api/branch/camera/${user.branchId}/${user.userType}`
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
      console.log("err", err);
      this.setState({ gotResponse: true });
    }
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
  getClientCameraNames = async (id) => {
    try {
      await axios
        .get(
          `${Config.hostName}/api/branch/cameraName/${this.props.auth.user.clientId}`
        )
        .then(async (res) => {
          if (res.data.camera.length) {
            let AlreadyHavingCameraName = [];
            let AlreadyHavingCameraID = [];
            res.data.camera.map((i) => {
              AlreadyHavingCameraName.push(i.cameraName);
            });
            res.data.camera.map((i) => {
              AlreadyHavingCameraID.push(i.cameraId);
            });
            console.log(
              "first show",
              AlreadyHavingCameraName,
              AlreadyHavingCameraID
            );
            await this.setState({
              availableCameraNames: AlreadyHavingCameraName,
              availableCameraId: AlreadyHavingCameraID,
            });
          }
        });
    } catch (err) {
      console.log("err", err);
    }
  };
  componentDidMount() {
    this.getCameraConfig();
    this.getClientCameraNames();
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
        // this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleDelete = async (key) => {
    const dataSource = [...this.state.dataSource];
    await this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
    this.props.addCameraConfiguration(
      this.props.auth.user.branchId,
      this.state.dataSource
    );
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  handleAdd = async () => {
    if (
      this.props.auth.user &&
      this.props.auth.user.NoOfCameras > this.state.count
    ) {
      const { count, dataSource } = this.state;
      const newData = {
        cameraId: `${count}_${this.props.auth.user.branchId}`,
        key: count,

        cameraName: `Camera ${count + 1}`,
        cameraStatus: true,
        Link: `http://192.168.1.5:8080/video`,
      };
      if (this.state.dataSource.length) {
        const { dataSource } = this.state;
        let flag = dataSource.filter((i) => i.cameraId == newData.cameraId);
        if (flag.length) {
          let newCount = count + 1;
          this.setState({ count: count + 1 });
          let obj = Object.assign(newData);
          obj.cameraId = `${newCount}_${this.props.auth.user.branchId}`;
          obj.key = newCount;
          // return (
          //   (newData.cameraId = `${newCount}_${this.props.auth.user.branchId}`),
          //   (newData.key = newCount)
          // );
        }
      }
      await this.setState({
        count: count + 1,
        dataSource: [...dataSource, newData],
      });
      this.CameraSave();
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

  handleSave = async (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    await this.setState({
      dataSource: newData,
    });
    this.CameraSave();
  };
  CameraSave = async () => {
    let recentItem = this.state.dataSource[this.state.dataSource.length - 1];
    if (
      recentItem &&
      this.state.availableCameraNames.includes(recentItem.cameraName)
    ) {
      toast.error(
        "This Client Already use this Camera Name Please select another name",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } else {
      this.props.addCameraConfiguration(
        this.props.auth.user.branchId,
        this.state.dataSource
      );
    }
  };
  toggle = () => this.setState({ modal: !this.state.modal });
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        {this.state.gotResponse ? (
          <div>
            <Alert />{" "}
            <Button
              onClick={this.handleAdd}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Add a camera
            </Button>
            <Table
              components={components}
              rowClassName={() => "editable-row"}
              bordered
              dataSource={dataSource}
              columns={columns}
            />
          </div>
        ) : (
          <Loader />
        )}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          // contentClassName="custom-modal-video"
          className="modal-xl"
        >
          <ModalHeader toggle={this.toggle}>Take a Snapshot</ModalHeader>
          <ModalBody>
            <div id="my-node">
              <Rtsp />
              {/* <img
                name="main"
                id="main"
                border="0"               
                width="1090"
                height="480"
                //   src={require("../socialDistancing/store.jpeg")}
                // src="http://192.168.1.4:8080/video"
                src={this.state.selectedLink}
              ></img> */}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.SnapShot}
              // style={{
              //   backgroundColor: "white",
              //   border: "1px solid white",
              // }}
            >
              SnapShot
            </Button>
            <Button color="primary" onClick={this.toggle}>
              Ok
            </Button>{" "}
          </ModalFooter>
        </Modal>
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

EditableTable.propTypes = {
  setAlert: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addCameraConfiguration: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  // dwellTimeAnalysis:state.dwellTimeAnalysis
});
export default connect(mapStateToProps, { addCameraConfiguration, setAlert })(
  EditableTable
);
