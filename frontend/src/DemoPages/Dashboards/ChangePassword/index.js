import React, { Fragment, useState } from "react";
import { Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleReactValidator from "simple-react-validator";
import Config from "../../../config/Config";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Col, Row, Form, FormGroup, Label, Input } from "reactstrap";
import { Divider } from "antd";
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
    };
    this.validator = new SimpleReactValidator();
  }
  componentDidMount() {}
  onSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, newPassword } = this.state;

    if (this.validator.allValid()) {
      if (password !== confirmPassword)
        return toast.error("Password not match", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      try {
        const { user } = this.props.auth;
        if (user && user.userType && user.userType === "client") {
          await axios
            .put(Config.hostName + "/api/clients/" + user.clientId, {
              password: password,
              newpassword: newPassword,
            })
            .then((res) => {
              toast.success("Password Changed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });

              this.setState({ modal: !this.state.modal });
            })
            .catch((err) => {
              const errors = err.response.data.errors;
              console.log("err", errors);
              if (errors) {
                errors.forEach((error) =>
                  toast.error(error.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  })
                );
              }
            });
        } else if (user && user.userType && user.userType === "user") {
          await axios
            .put(
              Config.hostName + "/api/users/" + this.props.auth.user.clientId,
              {
                password: password,
                newpassword: newPassword,
              }
            )
            .then((res) => {
              toast.success("Password Changed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });

              this.setState({ modal: !this.state.modal });
            })
            .catch((err) => {
              const errors = err.response.data.errors;
              console.log("err", errors);
              if (errors) {
                errors.forEach((error) =>
                  toast.error(error.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  })
                );
              }
            });
        } else {
          toast.error("Didn't Provide Permission to Admin to Change Password", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (err) {
        const errors = err.response.data.errors;
        console.log(errors);
        if (errors) {
          errors.forEach((error) =>
            toast.error(error.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            })
          );
        }
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    return (
      <div className="animated fadeIn">
        <div className="card mr-5 ml-5">
          <div className="card-header">Change Password</div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Current Password"
                name="password"
                value={this.state.password}
                onChange={(event) =>
                  this.setState({
                    password: event.target.value,
                  })
                }
                onBlur={(e) => this.validator.showMessageFor("password")}
              />
            </div>
            <div className="text-danger">
              {this.validator.message(
                "password",
                this.state.password,
                "required|min:6"
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                onChange={(event) =>
                  this.setState({
                    confirmPassword: event.target.value,
                  })
                }
                onBlur={(e) => this.validator.showMessageFor("confirmPassword")}
              />
            </div>
            <div className="text-danger">
              {this.validator.message(
                "confirmPassword",
                this.state.confirmPassword,
                "required|min:6"
              )}
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                name="newPassword"
                value={this.state.newPassword}
                onChange={(event) =>
                  this.setState({
                    newPassword: event.target.value,
                  })
                }
                onBlur={(e) => this.validator.showMessageFor("newPassword")}
              />
            </div>
            <div className="text-danger">
              {this.validator.message(
                "newPassword",
                this.state.newPassword,
                "required|min:6"
              )}
            </div>
            <Row>
              <Col className="ml-2" md="1">
                <Button color="primary" onClick={(e) => this.onSubmit(e)}>
                  Update
                </Button>{" "}
              </Col>
              <Col md="3">
                <Button
                  color="secondary"
                  onClick={() => this.setState({ modal: false })}
                >
                  Cancel
                </Button>
              </Col>
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
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(ChangePassword);
