import React, { Fragment } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import { connect } from "react-redux";
import Alert from "../../../layouts/Alert";
import { login_client_user, logout } from "../../../actions/user.actions";
import { getCurrentProfile } from "../../../actions/client.actions";
import { setAlert } from "../../../actions/alert.actions";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  faUser,
  faAngleDown,
  faCalendarAlt,
  faEllipsisH,
  faCheck,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Divider } from "antd";
// Layout

class LoginBoxed extends React.Component {
  state = {
    email: "",
    password: "",
  };
  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }
  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitForm = async (e) => {
    e.preventDefault();

    if (this.validator.allValid()) {
      let { email, password } = this.state;
      await this.props.login_client_user(email, password, "user");
      if (this.props.auth.isAuthenticated) {
        await this.props.getCurrentProfile(this.props.auth.user.clientId);
      }
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  };

  render() {
    if (this.props.auth.user && this.props.auth.user.userType == "admin") {
      return <Redirect to={"/dashboard/adminHome"} />;
    }

    if (this.props.auth.user) {
      return <Redirect to={"/dashboard/home"} />;
    }
    return (
      <Fragment>
        <div className="h-100 bg-plum-plate bg-animation">
          <Alert />
          <div className="d-flex h-100 justify-content-center align-items-center">
            <Col md="8" className="mx-auto app-login-box">
              <div className="app-logo-inverse mx-auto mb-3" />
              <div className="modal-dialog w-100 mx-auto">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="h5 modal-title text-center">
                      <h4 className="mt-2">
                        <div>Welcome back,</div>
                        <span>Please sign in to your account below.</span>
                      </h4>
                    </div>
                    <Form onSubmit={this.submitForm}>
                      <Row form>
                        <Col md={12}>
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <MailOutlined />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Enter Email Here"
                              autoComplete="email"
                              onChange={this.inputHandler}
                              name="email"
                              value={this.state.email}
                            />
                          </InputGroup>

                          <div className="text-danger">
                            {this.validator.message(
                              "email",
                              this.state.email,
                              "required|email"
                            )}
                          </div>
                        </Col>
                        <Col md={12}>
                          <InputGroup className="mb-4">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <LockOutlined />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="password"
                              placeholder="Enter Password Here"
                              autoComplete="current-password"
                              onChange={this.inputHandler}
                              name="password"
                              value={this.state.password}
                            />
                          </InputGroup>
                          <div className="text-danger">
                            {this.validator.message(
                              "password",
                              this.state.password,
                              "required|min:6"
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Divider />
                      <div className="float-right">
                        <Button
                          color="primary"
                          size="lg"
                          type="submit"
                          // onSubmit={this.submitForm}
                          onClick={(e) => {
                            this.submitForm(e);
                          }}
                        >
                          Login to Dashboard
                        </Button>
                      </div>
                    </Form>
                  </div>
                  {/* <div className="modal-footer clearfix"> */}
                  {/* <div className="float-left">
                    <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()} className="btn-lg btn btn-link">
                      Recover Password
                    </a>
                  </div> */}

                  {/* </div> */}
                </div>
              </div>
              <div className="text-center text-white opacity-8 mt-3">
                {/* Copyright &copy; ArchitectUI 2019 */}
              </div>
            </Col>
          </div>
        </div>
      </Fragment>
    );
  }
}

LoginBoxed.propTypes = {
  setAlert: PropTypes.func.isRequired,
  login_client_user: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
});

export default connect(mapStateToProps, {
  login_client_user,
  setAlert,
  logout,
  getCurrentProfile,
})(LoginBoxed);
// export default LoginBoxed;
