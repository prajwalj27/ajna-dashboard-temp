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
  Container,
} from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import { connect } from "react-redux";
import Alert from "../../../layouts/Alert";
import {
  loginclient,
  login_client_user,
  redirected_login,
} from "../../../actions/user.actions";
import { login, logout } from "../../../actions/user.actions";
import { getCurrentProfile } from "../../../actions/client.actions";
import { setAlert } from "../../../actions/alert.actions";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { LockOutlined, MailOutlined, SelectOutlined } from "@ant-design/icons";
import BackgroundLogo from "../../../assets/utils/images/logo.png";
import { Divider, Select } from "antd";
const { Option } = Select;
// Layout

class ClientLogin extends React.Component {
  state = {
    email: "",
    password: "",
    type: "",
    signIn: false,
  };
  componentWillMount() {
    this.validator = new SimpleReactValidator();
    // console.log(window.location.href)
    this.directLogin()
  }
  inputHandler = async (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChange = async (value) => {
    await this.setState({ type: value });
  };
  submitForm = async (e) => {
    e.preventDefault();

    if (this.validator.allValid()) {
      let { email, password, type } = this.state;
      this.setState({ signIn: true });
      if (type === "client")
        await this.props.loginclient(email, password, "client");
      if (type === "user")
        await this.props.login_client_user(email, password, "user");

      if (this.props.auth.isAuthenticated) {
        this.setState({ signIn: false });

        await this.props.getCurrentProfile(this.props.auth.user.clientId);
      }
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  };

  directLogin = async () => {
    const loginToken = window.location.href.split("=")[1];
    console.log(loginToken);

    await this.props.redirected_login(loginToken);
 
    if (this.props.auth.user) {
      return <Redirect to={"/dashboard/home"} />;
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
              <div
                className="app-logo-inverse mx-auto mb-3"
                style={{
                  backgroundImage: `url(${BackgroundLogo})`,
                }}
              />
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
                      <Row form style={{ display: "flex" }}>
                        <Col md={12}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <MailOutlined />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              className="email-box"
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
                          <InputGroup className="mt-4">
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
                        <Col md={12}>
                          <InputGroup className="mt-4">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <SelectOutlined />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Select
                              name="type"
                              placeholder="Select Role"
                              style={{ width: 120 }}
                              onChange={this.handleChange}
                              value={
                                this.state.type.length ? this.state.type : null
                              }
                            >
                              <Option value="client">client</Option>
                              <Option value="user">user</Option>
                            </Select>
                          </InputGroup>

                          <div className="text-danger">
                            {this.validator.message(
                              "type",
                              this.state.type,
                              "required"
                            )}
                          </div>
                        </Col>
                        <Col
                          md={12}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {this.props.auth.loading ? (
                            <Button
                              className="mt-4"
                              type="primary"
                              color="primary"
                              size="lg"
                              style={{
                                paddingLeft: "55px",
                                paddingRight: "55px",
                              }}
                              type="submit"
                              onClick={(e) => {
                                this.submitForm(e);
                              }}
                            >
                              <h6 style={{ color: "white", marginTop: "5px" }}>
                                Signing in...
                              </h6>
                            </Button>
                          ) : (
                            <Button
                              // type="primary submit"
                              className="mt-4"
                              color="primary"
                              style={{
                                paddingLeft: "75px",
                                paddingRight: "75px",
                              }}
                              size="lg"
                              type="submit"
                              // onSubmit={this.submitForm}
                              onClick={(e) => {
                                this.submitForm(e);
                              }}
                            >
                              <h6 style={{ color: "white", marginTop: "5px" }}>
                                {" "}
                                Sign in
                              </h6>
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </div>
              <div className="text-center text-white opacity-8 mt-3"></div>
            </Col>
          </div>
        </div>
      </Fragment>
    );
  }
}

ClientLogin.propTypes = {
  setAlert: PropTypes.func.isRequired,
  loginclient: PropTypes.func.isRequired,
  login_client_user: PropTypes.func.isRequired,
  redirected_login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
});

export default connect(mapStateToProps, {
  loginclient,
  login_client_user,
  redirected_login,
  setAlert,
  logout,
  getCurrentProfile,
})(ClientLogin);
