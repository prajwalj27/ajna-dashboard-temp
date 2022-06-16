import React, { Fragment, Component } from "react";

import Slider from "react-slick";
import SimpleReactValidator from "simple-react-validator";
import { connect } from "react-redux";
import Alert from "../../../layouts/Alert";
import PropTypes from "prop-types";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

import { loginadmin } from "../../../actions/user.actions";
import { setAlert } from "../../../actions/alert.actions";
import { Redirect } from "react-router-dom";
import bg1 from "../../../assets/utils/images/originals/city.jpg";
import bg2 from "../../../assets/utils/images/originals/citydark.jpg";
import bg3 from "../../../assets/utils/images/originals/citynights.jpg";

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

class Login extends Component {
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
  submitForm(e) {
    e.preventDefault();
    if (this.validator.allValid()) {
      let { email, password } = this.state;

      this.props.loginadmin(email, password, "admin");
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  }

  render() {
    if (this.props.auth.user && this.props.auth.user.userType == "client") {
      return <Redirect to={"/dashboard/home"} />;
    }
    if (this.props.auth.user) {
      return <Redirect to={"/admindashboard/adminhome"} />;
    }
    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      initialSlide: 0,
      autoplay: true,
      adaptiveHeight: true,
    };
    return (
      <Fragment>
        <div className="h-100">
          <Alert />
          <Row className="h-100 no-gutters">
            <Col lg="4" className="d-none d-lg-block">
              <div className="slider-light">
                <Slider {...settings}>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                    <div
                      className="slide-img-bg"
                      style={{
                        backgroundImage: "url(" + bg1 + ")",
                      }}
                    />
                    <div className="slider-content">
                      <h3>Perfect Balance</h3>
                      <p>
                        ArchitectUI is like a dream. Some think it's too good to
                        be true! Extensive collection of unified React Boostrap
                        Components and Elements.
                      </p>
                    </div>
                  </div>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                    <div
                      className="slide-img-bg"
                      style={{
                        backgroundImage: "url(" + bg3 + ")",
                      }}
                    />
                    <div className="slider-content">
                      <h3>Scalable, Modular, Consistent</h3>
                      <p>
                        Easily exclude the components you don't require.
                        Lightweight, consistent Bootstrap based styles across
                        all elements and components
                      </p>
                    </div>
                  </div>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-sunny-morning">
                    <div
                      className="slide-img-bg opacity-6"
                      style={{
                        backgroundImage: "url(" + bg2 + ")",
                      }}
                    />
                    <div className="slider-content">
                      <h3>Complex, but lightweight</h3>
                      <p>
                        We've included a lot of components that cover almost all
                        use cases for any type of application.
                      </p>
                    </div>
                  </div>
                </Slider>
              </div>
            </Col>
            <Col
              lg="8"
              md="12"
              className="h-100 d-flex bg-white justify-content-center align-items-center"
            >
              <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                <div
                  className="app-logo"
                  style={{
                    backgroundImage: require("../../../assets/utils/images/logo-inverse.png"),
                  }}
                />
                <h4 className="mb-0">
                  <div>Welcome back,</div>
                  <span>Please sign in to your account.</span>
                </h4>
                <h6 className="mt-3">
                  {/* No account?{" "} */}
                  {/* <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()} className="text-primary">
                    Sign up now
                  </a> */}
                </h6>
                <Row className="divider" />
                <div>
                  <Form onSubmit={this.submitForm}>
                    <Row>
                      <Col md={6}>
                        <Label for="exampleEmail">Email</Label>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <MailOutlined />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Email"
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
                      <Col md={6}>
                        <Label for="examplePassword">Password</Label>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <LockOutlined />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            placeholder="Password"
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
                    <Row className="divider" />
                    <div className="d-flex align-items-center">
                      <div className="ml-auto">
                        {/* <Button
                          color="primary"
                          size="lg"
                          type="submit"
                          onClick={(e) => {
                            this.submitForm(e);
                          }}
                        >
                          Login to Dashboard
                        </Button> */}

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
                      </div>
                    </div>
                  </Form>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}

Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  loginadmin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loginadmin, setAlert })(Login);
