import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Config from "../../../config/Config";
import axios from "axios";
import { Checkbox, Radio, DatePicker, Col, Row } from "antd";
import SimpleReactValidator from "simple-react-validator";
import { Form, Alert } from "reactstrap";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import { login, logout } from "../../../actions/user.actions";
import { setAlert } from "../../../actions/alert.actions";
import { v4 as uuid } from "uuid";
import { connect } from "react-redux";
const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  "Mask Detection",
  // "Face Recognition",
  "Social Distancing",
  "Contact Tracing",
  // "Safety Reporting",
  // "Crowd Density Analysis",
  // "Risk Prediction",
  // "Queue Length Detection",
  // "Waiting Time Analysis",
  // "Queue Length Prediction",
  // "Social Distancing Alert",
  // "Queue Processing Speed",
  "Footfall Analysis",
  "Path Tracking",
  "Heat Map Analysis",
  "Dwell Time Analysis",
  // "Dwell Zone",
  // "Face Detection",
];
const defaultmodules = [""];
const id = uuid();

const { RangePicker } = DatePicker;
class AddClient extends Component {
  state = {
    // masterClientId: "",
    clientId: "",
    branchName: "",
    email: "",
    contact: "",
    location: "",
    description: "",
    modules: defaultmodules,
    indeterminate: true,
    checkAll: false,
    token: "",
    amount: "",
    subscribeFor: "",
    NoOfCameras: "",
    value: "",
    subscribed: "",
    dates: [],
    alertMsg: "",
    alertColor: "",
    isMaster: true,
    NoOfBranchesExist: 1,
  };
  onChangeRadio = (e) => {
    // console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }
  componentDidMount() {
    this.getClientBranches();
  }
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
        await this.setState({ NoOfBranchesExist: res.data.length });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  rangePicker = (dates, dateStrings) => {
    console.log("rangestring", dateStrings);
    this.setState({ dates: dateStrings });
  };
  onChange = (modules) => {
    this.setState({
      modules,
      indeterminate: !!modules.length && modules.length < plainOptions.length,
      checkAll: modules.length === plainOptions.length,
    });
  };
  ontextArea = (e) => {
    this.setState({ description: e.target.value });
  };
  onCheckAllChange = (e) => {
    this.setState({
      modules: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (this.state.value === 1) {
      this.setState({ subscribed: `${this.state.subscribeFor} months` });
    } else {
      this.setState({ subscribed: `${this.state.subscribeFor} years` });
    }
  };
  createBranch = (data) => {
    axios
      .post(Config.hostName + "/api/branch", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      })
      .then((Res) => {
        console.log("res", Res.data);
        toast.success(`Your Request Sent to Admin`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        this.setState({
          clientId: "",
          branchName: "",
          email: "",
          contact: "",
          location: "",
          description: "",
          modules: defaultmodules,
          indeterminate: true,
          checkAll: false,
          token: "",
          amount: "",
          subscribeFor: "",
          NoOfCameras: "",
          value: "",
          subscribed: "",
          dates: [],
          alertMsg: "",
          alertColor: "",
        });
      })
      .catch((err) => {
        console.log("err", err);
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
  };
  submitHandler = (e) => {
    e.preventDefault();
    const { token, NoOfBranchesExist } = this.state;
    if (this.validator.allValid()) {
      let {
        branchName,
        clientId,
        modules,
        location,
        email,
        subscribed,
        amount,
        NoOfCameras,
        dates,
        // masterClientId,
        description,
      } = this.state;
      let trimmedname = branchName.split(" ").join("");
      const branchData = {
        clientId: this.props.auth.user.clientId,
        branchId: id,
        // this.props.auth.user.clientId + trimmedname + NoOfBranchesExist,
        userType: "client",
        branchName,
        Mac_address: [],
        modules,
        email: this.props.auth.user.email,
        NoOfCameras,
        camera: [],
        location,
        isAdminAccepted: false,
        isDefaultBranch: false,
        dates,
        amount,
        subscribed,
        description,
      };

      this.createBranch(branchData);
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
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">Create Branch</div>
          <div className="card-body">
            <form>
              <div className="form-group row">
                <label for="staticEmail" className="col-sm-2 col-form-label">
                  Client ID
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    // type="text"
                    disabled
                    // placeholder="Enter Client ID"
                    autoComplete="clientId"
                    // onChange={this.inputHandler}
                    // name="clientId"
                    value={this.props.auth.user.clientId}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label for="staticEmail" className="col-sm-2 col-form-label">
                  Branch Name
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    placeholder="Enter Branch Name"
                    onChange={this.inputHandler}
                    name="branchName"
                    value={this.state.branchName}
                  />
                </div>
              </div>
              {/* <div className="form-group row">
                <label for="staticEmail" className="col-sm-2 col-form-label">
                  Contact
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Enter Contact "
                    autoComplete="contact"
                    onChange={this.inputHandler}
                    name="contact"
                    value={this.state.contact}
                  />
                  <div className="text-danger">
                    {this.validator.message(
                      "contact",
                      this.state.contact,
                      "required"
                    )}
                  </div>
                </div>
              </div> */}
              <div className="form-group row">
                <label for="staticEmail" className="col-sm-2 col-form-label">
                  Location
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter New Branch Location"
                    autoComplete="location"
                    onChange={this.inputHandler}
                    name="location"
                    value={this.state.location}
                  />
                  <div className="text-danger">
                    {this.validator.message(
                      "location",
                      this.state.location,
                      "required"
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label for="staticEmail" className="col-sm-2 col-form-label">
                  Modules
                </label>
                <div className="col-sm-8">
                  <div>
                    <div className="site-checkbox-all-wrapper">
                      <Checkbox
                        // indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                      >
                        Check all
                      </Checkbox>
                    </div>
                    <br />
                    <CheckboxGroup
                      options={plainOptions}
                      value={this.state.modules}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Amount Payed</label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Enter Amount"
                    onChange={this.inputHandler}
                    name="amount"
                    value={this.state.amount}
                  />{" "}
                  <div className="text-danger">
                    {this.validator.message(
                      "amount",
                      this.state.amount,
                      "required"
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Subscribe for</label>
                <div className="col-sm-8">
                  <Radio.Group
                    onChange={this.onChangeRadio}
                    value={this.state.value}
                  >
                    <Radio value={1}>Monthly</Radio>
                    <Radio value={2}>Yearly</Radio>
                  </Radio.Group>
                  {this.state.value && (
                    <input
                      className="form-control mt-3"
                      type="number"
                      placeholder={
                        this.state.value === 1
                          ? "For How many Months"
                          : "For How many Years"
                      }
                      onChange={this.inputHandler}
                      name="subscribeFor"
                      value={this.state.subscribeFor}
                    />
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Date</label>
                <div className="col-sm-8">
                  <RangePicker onChange={this.rangePicker} showTime />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  Number of Camera
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Number of Camera"
                    onChange={this.inputHandler}
                    name="NoOfCameras"
                    value={this.state.NoOfCameras}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Description</label>
                <div className="col-sm-8">
                  <textarea
                    type="text"
                    onChange={this.ontextArea}
                    className="form-control"
                    value={this.state.description}
                    placeholder="Description"
                  />
                </div>
              </div>
              <div className="form-group row">
                <button
                  onClick={(e) => {
                    this.submitHandler(e);
                  }}
                  className="ml-5 col-2 btn btn-primary text-center"
                >
                  Save Branch
                </button>
              </div>
            </form>
            <Row>
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
      </div>
    );
  }
}

AddClient.propTypes = {
  setAlert: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(AddClient);
