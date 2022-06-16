import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  Button,
  CardHeader,
  Container,
  Card,
  CardBody,
  Modal,
  Alert,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Graph from "react-graph-vis";
import Config from "../../../config/Config";
import { Pie } from "react-chartjs-2";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Loader from "react-loaders";
import moment from "moment";
import CountUp from "react-countup";
import { Table, Tag, Space, DatePicker } from "antd";

// import Ionicon from 'react-ionicons';
import { IoIosAnalytics } from "react-icons/io";
import PerfectScrollbar from "react-perfect-scrollbar";
import Slider from "react-slick";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  faAngleUp,
  faAngleDown,
  faCalendarAlt,
  faEllipsisH,
  faCheck,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Select from "react-select";
const { Column } = Table;

let objEdges = {},
  edgesArr = [];
let dataValues = [];
const options = {
  layout: {
    // hierarchical: true,
  },
  edges: {
    color: "#000000",
  },
  height: "500px",
};

const events = {
  select: function (event) {
    var { nodes, edges } = event;
  },
};

class DwellTimeAnalysis extends Component {
  state = {
    localId: "",
    todayContact: [],
    nodes: [],
    edges: [],
    data: [],
    tableData: [],
    modal: false,
    modalImage: true,
    loading:true
  };
  getId = () => {
    if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "user"
    ) {
      if (this.props.auth.user.clientId) {
        this.setState({ localId: this.props.auth.user.clientId });
        this.getDwellTimeAllData(this.props.auth.user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        this.setState({ localId: this.props.admin.selectedClient.clientId });
        this.getDwellTimeAllData(this.props.admin.selectedClient.clientId);
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };

  tableData = (data) => {
    dataValues = [];
    data.map((i, index) => {
      let date = moment(i.Timestamp);
      let format = date.format("LLL");
      i.Timestamp = format;
      let obj = Object.assign(i);
      obj.key = index + 1;
      dataValues.push(obj);
    });
    this.setState({ tableData: dataValues });
  };

  getDwellTimeAllData = async (id) => {
    try {
      await axios
        .get(Config.hostName + "/api/dwell-time-analysis//me/" + id, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((res) => {
          this.setState({ data: res.data });
          this.tableData(res.data);
        })
        .catch((err) => {
          console.log("dwell err", err);
        });
    } catch (error) {}
  };
  async componentDidMount() {
    await this.getId();
    setTimeout(() => this.setState({ loading: false }), 1500);

  }
  render() {
    const {loading}=this.state
    if (this.state.localId) {
      return (
      loading? <Loader type="line-scale-party" />:

        <Fragment>
         
        </Fragment>
      );
    } else {
      return (
        <Alert color="danger">
          Id Is not present Please Select a Client from Admin Dashboard{" "}
        </Alert>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(DwellTimeAnalysis);
