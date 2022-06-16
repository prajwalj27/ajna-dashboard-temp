import React, { Fragment, useState } from "react";
import { Table, Radio, Divider, Tag, Tooltip } from "antd";
import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleReactValidator from "simple-react-validator";
import Config from "../../../config/Config";
import axios from "axios";
import { connect } from "react-redux";
import { InfoCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { Col, Row, Form, FormGroup, Label, Input } from "reactstrap";
import { masterClientSelection } from "../../../actions/user.actions";
const { Column } = Table;
let data = [];
class AvailableClients extends React.Component {
  state = {
    localId: "",
    clients: [],
  };
  getId = () => {
    if (
      this.props.auth &&
      this.props.auth.initialUser &&
      this.props.auth.initialUser.userType === "client"
    ) {
      if (this.props.auth.initialUser.branchId) {
        this.setState({ localId: this.props.auth.initialUser.branchId });
        this.getAllBranch(this.props.auth.initialUser.branchId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        this.setState({ localId: this.props.admin.selectedClient.branchId });
        this.getAllBranch(this.props.admin.selectedClient.branchId);
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  getAllBranch = (id) => {
    axios
      .get(`${Config.hostName}/api/branch/${this.props.auth.user.clientId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      })
      .then((res) => {
        this.setState({ clients: res.data });
      })
      .catch((err) => {
        if (err.response) {
          const errors = err.response.data.errors;
          if (errors) {
            errors.forEach((error) => {
              //   console.log(error.msg)
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
  };
  async componentWillMount() {
    await this.getId();
  }

  render() {
    data = [];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRow: selectedRowKeys });
        this.props.masterClientSelection(selectedRows[0]);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      getCheckboxProps: (record) => ({
        disabled: record.isActive === false,
        name: record.name,
      }),
    };
    this.state.clients.length &&
      this.state.clients.map((i, index) => {
        let obj = Object.assign(i);
        obj.key = index;
        data.push(obj);
      });
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <Tooltip
              placement="topLeft"
              title="You can see other branches data by selecting Radio button of that branch"
            >
              <InfoCircleOutlined className=" mr-1" />
            </Tooltip>
            selected Branch -{" "}
            {this.props.auth && this.props.auth.user
              ? this.props.auth.user.branchName
              : null}
          </div>
          <div className="card-body" style={{ overflow: "hidden" }}>
            {this.state.clients.length ? (
              <Table
                // scroll={{ x: 1500 }}
                // selection={1}
                rowSelection={{
                  type: "radio",

                  ...rowSelection,
                }}
                // columns={columns}
                dataSource={data}
                value={1}
              >
                <Column title="Client ID" dataIndex="clientId" key="clientId" />
                <Column title="Branch ID" dataIndex="branchId" key="branchId" />
                <Column
                  title="Branch Name"
                  dataIndex="branchName"
                  key="branchName"
                />
                {/* <Column title="Name" dataIndex="name" key="name" /> */}
                {/* <Column title="Email" dataIndex="email" key="email" /> */}
                <Column title="Location" dataIndex="location" key="location" />
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
              </Table>
            ) : null}
          </div>
          <ToastContainer
            position="top-left"
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
    );
  }
}
AvailableClients.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  initialUser: PropTypes.object.isRequired,
  masterClientSelection: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  initialUser: state.auth,
});
export default connect(mapStateToProps, { masterClientSelection })(
  AvailableClients
);
