import React, { Component, Fragment } from "react";
import classnames from "classnames";
import axios from "axios";
import Chart from "react-google-charts";
import Config from "../../../config/Config";
import {
  Row,
  Col,
  Input,
  Button,
  Nav,
  Container,
  Alert,
  CardBody,
  CardTitle,
  Card,
  CardHeader,
  NavLink,
  TabContent,
  TabPane,
  Progress,
  ButtonGroup,
  CardFooter,
  Table,
  Popover,
  PopoverBody,
} from "reactstrap";
import { BarChart, XAxis, CartesianGrid, YAxis, Legend, Bar } from "recharts";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getMaskDetectionTodayCount } from "../../../actions/maskDetection.actions";
import { getFootfallAnalysisTodayData } from "../../../actions/footfallAnalysis.actions";
import {
  getSocialDistancingCount,
  getSocialDistancingTodayData,
} from "../../../actions/socialDistancing.actions";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";

import PerfectScrollbar from "react-perfect-scrollbar";
import { HorizontalBar } from "react-chartjs-2";

import {
  faAngleUp,
  faDotCircle,
  faAngleDown,
  faArrowLeft,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

import CountUp from "react-countup";
class SafetReporting extends Component {
  state = {
    localId: "",
    todayZoneBasedResults: [],
    data: [],
  };
  componentDidMount() {
    this.getId();
    console.log("props", this.props);
  }
  getTodayZoneBasedData = async (id) => {
    try {
      await axios
        .get(Config.hostName + `/api/footfall-analysis/today/` + id)
        .then((res) => {
          if (res.data.length > 1) console.log("today zone based", res.data);
          this.setState({ todayZoneBasedResults: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };
  getSafetyReportingData = async (id) => {
    let localImageArray = [];
    try {
      await axios
        .get(Config.hostName + `/api/safety-reporting/me/` + id, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((res) => {
          console.log("safety", res.data);
          this.setState({ data: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };

  getId = () => {
    if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "user"
    ) {
      if (this.props.auth.user.clientId) {
        this.setState({ localId: this.props.auth.user.clientId });
        this.props.getMaskDetectionTodayCount(this.props.auth.user.clientId);
        this.props.getFootfallAnalysisTodayData(this.props.auth.user.clientId);
        // this.props.getSocialDistancingTodayData(this.props.auth.user.clientId);
        this.props.getSocialDistancingCount(this.props.auth.user.clientId);
        this.getSafetyReportingData(this.props.auth.user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        this.setState({ localId: this.props.admin.selectedClient.clientId });
        this.getSafetyReportingData(this.props.admin.selectedClient.clientId);
        this.props.getMaskDetectionTodayCount(
          this.props.admin.selectedClient.clientId
        );
        this.props.getFootfallAnalysisTodayData(
          this.props.admin.selectedClient.clientId
        );
        // this.props.getSocialDistancingTodayData(
        //   this.props.admin.selectedClient.clientId
        // );
        this.props.getSocialDistancingCount(
          this.props.admin.selectedClient.clientId
        );
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };

  render() {
    if (this.state.localId) {
      return <Fragment></Fragment>;
    } else {
      return (
        <Alert color="danger">
          Id Is not present Please Select a Client from Admin Dashboard{" "}
        </Alert>
      );
    }
  }
}

SafetReporting.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  footfall: PropTypes.object.isRequired,
  socialDistancing: PropTypes.object.isRequired,
  maskDetection: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  footfall: state.footfall,
  socialDistancing: state.socialDistancing,
  maskDetection: state.maskDetection,
});
export default connect(mapStateToProps, {
  getMaskDetectionTodayCount,
  getSocialDistancingCount,
  getFootfallAnalysisTodayData,
  getSocialDistancingTodayData,
})(SafetReporting);
