import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
import PropTypes, { number } from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
import Chart from "react-google-charts";
import {
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  CardHeader,
} from "reactstrap";
import { Table, Space, Spin } from "antd";
import Circle from "react-circle";
import Loader from "react-loaders";
import CsvDownload from "react-json-to-csv";
import CountUp from "react-countup";
import Pusher from "pusher-js";
import moment from "moment";
import ZonesChart from "./ZonesChart";
import {
  getSocialDistancingCount,
  getSocialDistancingTodayData,
  pusherSocial,
} from "../../../actions/socialDistancing.actions";
import {
  getFootfallAnalysisTodayData,
  getFootfallAllData,
} from "../../../actions/footfallAnalysis.actions";
const { Column } = Table;
let dataValues = [];
class SocialDistancing extends Component {
  state = {
    data: [],
    alertMessage: "",
    localId: "",
    noOfClientZone: 0,
    todayZoneBasedResults: [],
    todayTotalCount: 0,
    todayCurrentCount: 0,
    tableValues: [],
    WeeklyZoneBasedResults: [],
    allData: [],
    totalCount: 0,
    modal: false,
    loading: true,
    spinner: false,
  };

  async componentWillMount() {
    this.setState({ tableValues: this.props.pdfData });
  }
  render() {
    dataValues = [];
    const { data, loading } = this.state;
    return (
      <div className="animated fadeIn">
        <div className="mt-4" style={{height:"90px",fontSize:"150%"}}>Social Distancing Values </div>
        <div>
              <Row className="mt-4">
                <Col>
                  <Table dataSource={this.state.tableValues}pagination={false}>
                    <Column title="Serial No." dataIndex="key" key="key" />
                    <Column
                      title="Camera ID"
                      dataIndex="CameraID"
                      key="CameraID"
                    />
                    <Column
                      title="Date"
                      dataIndex="Timestamp"
                      key="Timestamp"
                    />
                    <Column title="Zone" dataIndex="Zone" key="Zone" />
                    <Column
                      title="Person ID"
                      dataIndex="PersonID"
                      key="PersonID"
                    />
                    <Column
                      title="Contacted ID"
                      dataIndex="Contacted_PersonID"
                      key="Contacted_PersonID"
                    />
                    <Column
                      title="Current Index"
                      dataIndex="current_violation_index"
                      key="current_violation_index"
                    />
                    <Column
                      title="Violation Index"
                      dataIndex="today_violation_index"
                      key="today_violation_index"
                    />
                  </Table>
                </Col>
              </Row>
        </div>
      </div>
    );
  }
}

export default SocialDistancing;
