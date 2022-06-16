import React, { Component } from "react";
import { Switch, Divider, Select, InputNumber } from "antd";
import { connect } from "react-redux";
import PropTypes, { number } from "prop-types";
import Config from "../../../config/Config";
import Loader from "react-loaders";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "antd";
import { alertConfig } from "../../../actions/user.actions";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  CardFooter,
  Button,
} from "reactstrap";
class ShowStatus extends Component {
  state = {
    localId: "",
    loading: true,
    cameras: [],
    retailAnalytics: {},
    _isMounted: false,
  };
  fetchAlertConfig = async (id) => {
    try {
      await axios
        .get(Config.hostName + `/api/branch/alertConfig/` + id)
        .then((res) => {
          const { retailAnalytics } = res.data;
          this.setState({
            retailAnalytics,
          });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };
  getId = async () => {
    const { user } = this.props.auth;
    if (user.userType === "client") {
      if (user.clientId) {
        await this.setState({ localId: user.branchId });
        this.initialState();
        // this.fetchAlertConfig(user.branchId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localId: this.props.admin.selectedClient.clientId,
        });
        this.initialState();
        // this.fetchAlertConfig(this.props.admin.selectedClient.branchId);
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  handleChange = async (value) => {
    let obj = { ...this.state.retailAnalytics };
    obj.zones = value;
    await this.setState({ retailAnalytics: obj });
  };
  SaveChangesHandler = async () => {
    const { retailAnalytics } = this.state;
    let data = { retailAnalytics };
    this.props.auth.user.alertConfig && this.props.alertConfig(data);
    try {
      await axios
        .put(
          Config.hostName +
            `/api/branch/alertConfig/` +
            this.props.auth.user.branchId,
          {
            data,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-auth-token": this.props.auth.token,
            },
          }
        )
        .then(async (res) => {
          toast.success(`Changes Saved`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.log("error contact", error);
    }
  };
  initialState = async () => {
    const { user } = this.props.auth;
    user &&
      user.alertConfig &&
      (await this.setState({
        retailAnalytics: user.alertConfig.retailAnalytics,
      }));
  };
  async componentWillMount() {
    this.setState({ _isMounted: true });
    setTimeout(() => this.setState({ loading: false }), 1500);
    await this.getId();
  }
  async componentWillUnmount() {
    this.setState({ _isMounted: false });
  }

  render() {
    const { loading } = this.state;
    let { retailAnalytics } = this.state;
    if (this.state.localId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <div>
          <Card className="mt-5">
            <CardHeader>
              <Tooltip
                placement="topLeft"
                title="After DeSelecting, you won't recieve notification of that module"
              >
                <InfoCircleOutlined className="mb-2 mr-1" />{" "}
              </Tooltip>
              Change Alert Settings
            </CardHeader>
            <CardBody>
              <Divider />
              <Row>
                <Col md="4">
                  <strong>
                    <Tooltip
                      placement="topLeft"
                      title="Retail Analytics won't show any alerts on disabling this"
                    >
                      <InfoCircleOutlined className="mb-2 mr-1" />
                    </Tooltip>{" "}
                    Visitor Count
                  </strong>
                </Col>
                <Col>
                  <Switch
                    defaultChecked={
                      this.state.retailAnalytics.isFootfallCountActive
                    }
                    onChange={(checked) => {
                      let obj = { ...this.state.retailAnalytics };
                      obj.isFootfallCountActive = checked;
                      this.setState({ retailAnalytics: obj });
                    }}
                  />
                </Col>
                <Col md="5">
                  {this.state.retailAnalytics &&
                    !this.state.retailAnalytics.isFootfallCountActive && (
                      <h6>Visitor Count Alerts Disabled</h6>
                    )}
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={this.SaveChangesHandler}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
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
}
ShowStatus.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  alertConfig: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});
export default connect(mapStateToProps, { alertConfig })(ShowStatus);
