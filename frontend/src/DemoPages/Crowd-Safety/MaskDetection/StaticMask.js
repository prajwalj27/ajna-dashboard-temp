import React, { Component } from "react";
import Config from "../../../config/Config";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Chart from "react-google-charts";
import { Table, Tag, Space, DatePicker,Spin } from "antd";
import moment from "moment";
import { getMaskDetectionTodayCount,pusherMask } from "../../../actions/maskDetection.actions";
import Loader from "react-loaders";
import { ToastContainer, toast } from "react-toastify";
import CountUp from "react-countup";
import CsvDownload from "react-json-to-csv";
import {
  loader,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
} from "reactstrap";
import Pusher from "pusher-js";
let totalCount = 0,
  withMask = 0,
  withoutMask = 0;
const { Column } = Table;
const { RangePicker } = DatePicker;

const dateFormat = "DD-MM-YYYY";
let dataValues = [];
class MaskDetection extends Component {
  state = {
    localId: "",
    data: [],
    modal: false,
    modalImage: "",
    alertMessage: "",
    withMask: 0,
    withoutMask: 0,
    totalCount: 0,
    dates: [],
    weeklyCordinates: [],
    rangeResult: [],
    modal: false,
    modalImage: true,
    startDate: "2020-03-07T18:30:00.000Z",
    endDate: "2020-04-15T18:30:00.000Z",
    pusherObj: {},
    tableData: [],
    loading: true,
    spinner:false
  };
  
  
  async componentWillMount() {
    this.setState({tableData:this.props.pdfData})
    // this.setState({ loading: false })
  }
  
  render() {
    const { data, withoutMask, withMask, totalCount, loading } = this.state;
    dataValues = [];
      return  (
        <div className="animated fadeIn">
        <div className="mt-4" style={{height:"90px",fontSize:"150%"}}>Mask Detection Values </div>
          <div>
          <br/><br/>
            <Row className="mt-5 mb-5">
           <Col>
                <Table dataSource={this.state.tableData} className="mt-5 mb-5"  pagination={false} >
                  <Column title="Serial No." dataIndex="key" key="key" />
                  <Column
                    title="Camera"
                    dataIndex="CameraID"
                    key="CameraID"
                  />
                  <Column title="Time" dataIndex="Timestamp" key="Timestamp" />
                  <Column
                    title="Mask Detected"
                    dataIndex="Mask_detected"
                    key="Mask_detected"
                  />
                  
                </Table>
              </Col>
            </Row>

            </div>
        
        </div>
      );
    
  }
}
export default MaskDetection;
