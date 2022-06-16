import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
import PropTypes, { number } from "prop-types";
import { connect } from "react-redux";
import Chart from "react-google-charts";
import { Row, Col, Card, CardBody, Alert } from "reactstrap";
import { Table } from "antd";
import CountUp from "react-countup";
import Circle from "react-circle";
import Loader from "react-loaders";
import CsvDownload from "react-json-to-csv";

import Pusher from "pusher-js";
// import Spinner from '../../../layouts/Spinner'
import moment from "moment";
import ZonesChart from "./ZonesChart";
import {
  getFootfallAnalysisTodayData,
  getFootfallAllData,
  pusherFootfall,
} from "../../../actions/footfallAnalysis.actions";
const { Column } = Table;
let dataValues = [];
class FootfallAnalysis extends Component {
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
    loading: true,
  };

  async componentWillMount() {
    this.setState({ tableValues: this.props.pdfData });
  }
  render() {
    dataValues = [];
    const { data, loading } = this.state;
    return (
      <div className="animated fadeIn">
        {/* <Row className="mb-3">
          </Row> */}
        <div className="mt-4" style={{ height: "90px", fontSize: "150%" }}>
          Footfall Analysis Values{" "}
        </div>
        <div>
          <Row className="mt-4">
            <Col>
              <Table dataSource={this.state.tableValues} pagination={false}>
                <Column title="S No." dataIndex="key" key="key" />
                <Column title="Camera" dataIndex="CameraID" key="CameraID" />
                <Column
                  title="Date & Time"
                  dataIndex="Timestamp"
                  key="Timestamp"
                />
                <Column title="Zone" dataIndex="Zone" key="Zone" />
                <Column
                  title="Total"
                  dataIndex="Total_Person_Count"
                  key="Total_Person_Count"
                />
                <Column title="Density" dataIndex="Density" key="Density" />
              </Table>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default FootfallAnalysis;
