import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
// import AddCamera from "./AddCamera";
import AddCamera from "./Camera";
import AddDevice from "./AddDevice";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";

class MainComp extends React.Component {
  state = {
    camera: "",
    localId: "",
    cameras: [],
    branches: [],
    branch: "",
    modal: false,
    url: "",
  };

  SnapShot = async () => {
    console.log("take snapshot");
    axios
      .post(`${Config.hostName}/api/awsTrigger`, {
        trigger: JSON.stringify({ action: "snapshot" }),
      })
      .then((res) => {
        console.log("response", res.data);
        // this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getId = async () => {
    if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "client"
    ) {
      if (this.props.auth.user.clientId) {
        await this.setState({ localId: this.props.auth.user.clientId });
        this.setState({ cameras: this.props.auth.user.camera });
        this.getAllClient(this.props.auth.user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        this.setState({ localId: this.props.admin.selectedClient.clientId });
        this.setState({ cameras: this.props.admin.selectedClient.camera });
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  async componentWillMount() {
    this.validator = new SimpleReactValidator();
    await this.getId();

    console.log("configuration", this.props);
  }
  async componentDidMount() {}
  cameraHandleChange = (value) => {
    this.setState({ camera: value });
  };
  branchHandleChange = (value) => {
    this.setState({ localId: value });
  };
  getAllClient = (id) => {
    axios
      .get(`${Config.hostName}/api/users/${id}`)
      .then((res) => {
        this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  toggle = () => this.setState({ modal: !this.state.modal });

  render() {
    return (
      <div>
        <AddDevice />
        <br />
        <AddCamera />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps, {})(MainComp);
