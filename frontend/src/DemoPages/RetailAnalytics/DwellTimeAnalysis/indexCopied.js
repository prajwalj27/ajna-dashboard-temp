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
import { Table, Tag, Space } from "antd";
import PDFCompoentn from "./PdfFile";
// import Ionicon from 'react-ionicons';
import { IoIosAnalytics } from "react-icons/io";
import PerfectScrollbar from "react-perfect-scrollbar";
import Slider from "react-slick";
import {
  pdfDwellTimeAnalysis,
  clearDwell,
} from "../../../actions/dwellTimeAnalysis.actions";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  faAngleUp,
  faAngleDown,
  faCalendarAlt,
  faEllipsisH,
  faCheck,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import CsvDownload from "react-json-to-csv";
import { Checkbox, Radio, DatePicker } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Select from "react-select";
const { Column } = Table;
const { RangePicker } = DatePicker;

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

class CopiedDwell extends Component {
  state = {
    localId: "",
    todayContact: [],
    nodes: [],
    edges: [],
    data: [],
    tableData: [],
    modal: false,
    modalImage: true,
    loading: true,
    pdfLoader: false,
    dates: [],
  };
  getId = () => {
    if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "user"
    ) {
      if (this.props.auth.user.clientId) {
        this.setState({ localId: this.props.auth.user.clientId });
        this.props.pdfDwellTimeAnalysis(
          this.props.auth.user.clientId,
          this.state.dates
        );
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      //   var size = Object.keys(this.props.admin.selectedClient).length;
      //   if (size) {
      //     this.setState({ localId: this.props.admin.selectedClient.clientId });
      //     this.getDwellTimeAllData(this.props.admin.selectedClient.clientId);
      //   } else {
      //     this.setState({
      //       alertMessage: "Please Select Any Client from Admin-dashboard",
      //     });
      //   }
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
  onSubmit = () => {};
  componentWillMount() {
    this.tableData(this.props.pdfData);
  }
  render() {
    const { loading } = this.state;
    return (
      <Fragment>
        <Container fluid>
          <Row className="mt-4">
            <Col>
              <Table dataSource={this.state.tableData} pagination={false}>
                <Column title="Serial No." dataIndex="key" key="key" />
                <Column title="Camera" dataIndex="CameraID" key="CameraID" />
                <Column
                  title="Date & Time"
                  dataIndex="Timestamp"
                  key="Timestamp"
                />
                <Column title="PersonID" dataIndex="PersonID" key="PersonID" />
                <Column title="Zone" dataIndex="Zone" key="Zone" />
                <Column
                  title="TimeSpent"
                  dataIndex="TimeSpent"
                  key="TimeSpent"
                />
              </Table>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
export default CopiedDwell;
