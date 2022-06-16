import React, { Fragment } from "react";
import { Col, Row, Button, FormGroup, Label, InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import SimpleReactValidator from 'simple-react-validator';


class RegisterBoxed extends React.Component{
  state={
    username:"",
    email:"",
    password:"",
    confirmPassword:""
      }

  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }
render(){
  return (<div>
<Fragment>
    <div className="h-100 bg-premium-dark">
      <div className="d-flex h-100 justify-content-center align-items-center">
        <Col md="8" className="mx-auto app-login-box">
          <div className="app-logo-inverse mx-auto mb-3" />
          <div className="modal-dialog w-100">
            <div className="modal-content">
              <div className="modal-body">
                <h5 className="modal-title">
                  <h4 className="mt-2">
                    <div>Welcome,</div>
                    <span>
                      It only takes a{" "}
                      <span className="text-success">few seconds</span> to
                      create your account
                    </span>
                  </h4>
                </h5>
                <Row className="divider" />
                <Row form>
                  <Col md={12}>
                    {/* <FormGroup> */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <input 
                      name="username"
                      type="text" 
                      className="form-control"
                      placeholder="User Name" 
                      autoComplete="username" 
                      onChange={this.inputHandler}
                      value={this.state.username}
                      />

                    </InputGroup>

                    <div className="text-danger">
                              {this.validator.message(
                                "username",
                                this.state.username,
                                "required|min:5"
                              )}
                            </div>
                      {/* <Input type="email" name="email" id="exampleEmail" placeholder="Email here..."/> */}
                    {/* </FormGroup> */}
                  </Col>
                  <Col md={12}> 
                  <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input 
                      type="email" 
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
                  <Col md={12}>
                  <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                       type="password"
                        placeholder="Password"
                         autoComplete="new-password"
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
                  <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                      type="password"
                       placeholder="Confirm Password"
                        autoComplete="new-password"
                        onChange={this.inputHandler}
                        name="confirmPassword"
  value={this.state.confirmPassword} />
                    </InputGroup>
                    <div className="text-danger">
                              {this.validator.message(
                                "confirmPassword",
                                this.state.confirmPassword,
                                "required|min:6"
                              )}
                            </div>
                   </Col>
                </Row>
                <FormGroup className="mt-3" check>
                  <Input type="checkbox" name="check" id="exampleCheck" />
                  <Label for="exampleCheck" check>
                    Accept our{" "}
                    <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                      Terms and Conditions
                    </a>
                    .
                  </Label>
                </FormGroup>
                <Row className="divider" />
                <h6 className="mb-0">
                  Already have an account?{" "}
                  <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()} className="text-primary">
                    Sign in
                  </a>{" "}
                  |{" "}
                  <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()} className="text-primary">
                    Recover Password
                  </a>
                </h6>
              </div>
              <div className="modal-footer d-block text-center">
                <Button color="primary" className="btn-wide btn-pill btn-shadow btn-hover-shine" size="lg">
                  Create Account
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center text-white opacity-8 mt-3">
            Copyright &copy; Ajna AI 2020
          </div>
        </Col>
      </div>
    </div>
  </Fragment>

  </div>)
}
};

export default RegisterBoxed;
