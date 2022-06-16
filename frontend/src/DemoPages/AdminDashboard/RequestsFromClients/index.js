import React, { useState, useEffect } from "react";
import { Table, Radio, Divider, Tag, Space, Tooltip, Button } from "antd";
import axios from "axios";
import Config from "../../../config/Config";
import PropTypes from "prop-types";
import { login, logout } from "../../../actions/user.actions";
import { setAlert } from "../../../actions/alert.actions";
import { showClientDetails } from "../../../actions/admin.actions";
import Loader from "react-loaders";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
import { CardHeader, CardBody, Card } from "reactstrap";
// import { Loader } from "react-bootstrap-typeahead";
const { Column } = Table;
let dataValues = [];
let data = [];
class ClientRequests extends React.Component {
  state = {
    branches: [],
    id: "",
    clientId: "",
    contact: "",
    email: "",
    location: "",
    modules: [],
    selectedRow: "",
    tableData: [],
    loading: false,
  };

  branchOperation = async (val, data) => {
    if (val) {
      try {
        axios
          .put(
            `${Config.hostName}/api/branch/${data.branchId}`,
            {
              val,
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
            console.log("res", res.data);
            toast.success(`Status Updated`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            setTimeout(() => {
              window.location.reload();
            }, 100);
          })
          .catch((err) => {
            console.log("err", err);
          });
      } catch (error) {
        console.log("admin dashboard", error);
      }
    }
  };
  getBranchesNotAccepted = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(Config.hostName + "/api/branch", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      });
      this.tableData(res.data);
      await this.setState({ branches: res.data, loading: false });
    } catch (error) {
      this.setState({ loading: false });
      console.log("admin dashboard", error);
    }
  };
  tableData = (data) => {
    dataValues = [];
    data.map((i, index) => {
      let obj = i;
      dataValues.push(obj);
    });
    this.setState({ tableData: dataValues });
  };
  componentDidMount() {
    this.getBranchesNotAccepted();
  }

  render() {
    const { loading, branches } = this.state;
    if (!loading) {
      if (this.state.branches.length)
        return (
          <div>
            <Card>
              {" "}
              <CardHeader>
                <h6>List Of branches</h6>
              </CardHeader>
              <CardBody>
                {
                  this.state.branches.length ? (
                    <Table dataSource={this.state.tableData} value={1}>
                      <Column
                        title="Client ID"
                        dataIndex="clientId"
                        key="clientId"
                      />
                      {/* {/* <Column title="Name" dataIndex="name" key="name" /> */}
                      <Column
                        title="Branch Id"
                        dataIndex="branchId"
                        key="branchId"
                      />
                      {/* <Column title="Contact" dataIndex="contact" key="contact" /> */}{" "}
                      */}
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
                      <Column
                        title="Location"
                        dataIndex="location"
                        key="location"
                      />
                      <Column
                        title="Camera"
                        dataIndex="NoOfCameras"
                        key="NoOfCameras"
                      />
                      <Column
                        title="subscription"
                        dataIndex="subscribed"
                        key="subscribed"
                      />
                      <Column
                        title="Amount Payed"
                        dataIndex="amount"
                        key="amount"
                      />
                      <Column
                        title="Action"
                        key="action"
                        render={(text, record) => (
                          <Space size="middle">
                            <Button
                              type="primary"
                              shape="round"
                              className="btn-primary"
                              onClick={() => this.branchOperation(true, text)}
                            >
                              Accept
                            </Button>
                            <Button
                              // type="secondary"
                              shape="round"
                              className="btn-secondary"
                              onClick={() => this.branchOperation(false, text)}
                            >
                              Reject
                            </Button>
                          </Space>
                        )}
                      />
                    </Table>
                  ) : null
                  //   <Spinner/>
                }
              </CardBody>{" "}
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
      else
        return (
          <div>
            <Card>
              {" "}
              <CardHeader>
                <h6>branches</h6>
              </CardHeader>
              <CardBody>
                <h5>No Pending Requests</h5>
              </CardBody>{" "}
            </Card>
          </div>
        );
    } else
      return (
        <div>
          <Loader />
        </div>
      );
  }
}

ClientRequests.propTypes = {
  setAlert: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  showClientDetails: PropTypes.func.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});

export default connect(mapStateToProps, { setAlert, showClientDetails })(
  ClientRequests
);
