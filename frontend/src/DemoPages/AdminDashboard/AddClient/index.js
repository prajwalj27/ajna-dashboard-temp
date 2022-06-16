import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
import { Checkbox, Radio, DatePicker, Col, Row } from "antd";
import SimpleReactValidator from "simple-react-validator";
import { Spin, Alert } from "antd";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import { login, logout } from "../../../actions/user.actions";
import { setAlert } from "../../../actions/alert.actions";
import { v4 as uuid } from "uuid";
import { connect } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  "Mask Detection",
  // "Face Recognition",
  "Social Distancing",
  "Contact Tracing",
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
  // "Face Detection",
];
const defaultmodules = [""];
const { RangePicker } = DatePicker;
const id = uuid();
const clientId = uuid();
class AddClient extends Component {
  state = {
    // masterClientId: "",
    clientId: "",
    name: "",
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
    isRequestAccepted: false,
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
  componentDidMount() {}
  rangePicker = (dates, dateStrings) => {
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
  createBranch = (branchdata, clientData) => {
    axios
      .post(Config.hostName + "/api/branch", branchdata, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      })
      .then(async (Res) => {
        if (Res.data) {
          const { branchId, branchName } = await Res.data.branch;
          let obj = await {};
          obj[branchId] = await branchName;
          clientData.branches = await [obj];
          await this.createClient(clientData, branchId);
        }
      })
      .catch((err) => {
        this.setState({ isRequestAccepted: false });
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
  createClient = async (ClientData, branchId) => {
    await axios
      .post(Config.hostName + "/api/clients", ClientData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      })
      .then((Res) => {
        if (Res.data) {
          this.setState({ isRequestAccepted: false });
          toast.success(`${this.state.branchName} Branch added successfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          this.setState({
            branchName: "",
            clientId: "",
            name: "",
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
            isMaster: false,
          });
        }
      })
      .catch(async (err) => {
        this.setState({ isRequestAccepted: false });
        console.log("branchid", branchId);
        await axios.delete(Config.hostName + "/api/branch/" + branchId);

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
  submitHandler = async (e) => {
    const { token } = this.state;
    e.preventDefault();
    if (this.validator.allValid()) {
      let {
        name,
        // clientId,
        contact,
        modules,
        location,
        email,
        subscribed,
        amount,
        NoOfCameras,
        dates,
        branchName,
        // masterClientId,
        description,
        isMaster,
      } = this.state;

      const ClientData = {
        clientId,
        name,
        email,
        password: "123456",
        userType: "client",
        contact,
        location,
        // isActive,
        subscribed,
        dates,
        amount,
        // country,
        description,
      };
      const branchData = {
        clientId,
        branchId: id,
        branchName,
        userType: "client",
        Mac_address: [],
        modules,
        email,
        NoOfCameras,
        camera: [],
        location,
        isAdminAccepted: true,
        isDefaultBranch: true,
        dates,
        amount,
        subscribed,
        description,
      };
      this.setState({ isRequestAccepted: true });
      await this.createBranch(branchData, ClientData);
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
    e.preventDefault();
    // console.log("state", this.state);
  };
  render() {
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">Add Client</div>
          <div className="card-body">
            <form>
              {/* <div className="form-group row">
                <label  className="col-sm-2 col-form-label">
                  Client ID
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Client ID"
                    autoComplete="clientId"
                    onChange={this.inputHandler}
                    name="clientId"
                    value={this.state.clientId}
                  />
                  <div className="text-danger">
                    {this.validator.message(
                      "clientId",
                      this.state.clientId,
                      "required"
                    )}
                  </div>
                </div>
              </div> */}
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Client Name</label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    // type="text"
                    placeholder="Name"
                    autoComplete="name"
                    onChange={this.inputHandler}
                    name="name"
                    value={this.state.name}
                  />
                  <div className="text-danger">
                    {this.validator.message(
                      "name",
                      this.state.name,
                      "required"
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Branch Name</label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Branch Name"
                    autoComplete="branchName"
                    onChange={this.inputHandler}
                    name="branchName"
                    value={this.state.branchName}
                  />
                  <div className="text-danger">
                    {this.validator.message(
                      "Branch Name",
                      this.state.branchName,
                      "required"
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    onChange={this.inputHandler}
                    name="email"
                    value={this.state.email}
                  />
                  <div className="text-danger">
                    {this.validator.message(
                      "email",
                      this.state.email,
                      "required"
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Contact</label>
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
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Location</label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Location"
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
                <label className="col-sm-2 col-form-label">Modules</label>
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
                      // options={plainOptions}
                      value={this.state.modules}
                      onChange={this.onChange}
                    >
                      {plainOptions.map((i, index) => {
                        return (
                          <div key={index} className="row">
                            {" "}
                            <Col span={24}>
                              <Checkbox value={i}>{i}</Checkbox>
                            </Col>
                          </div>
                        );
                      })}
                    </CheckboxGroup>
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
                  />
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
                  Save Client
                </button>
                {this.state.isRequestAccepted && <Spin indicator={antIcon} />}
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
