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
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Graph from "react-graph-vis";
import { ToastContainer, toast } from "react-toastify";
import Config from "../../../config/Config";
import { connect } from "react-redux";
import CsvDownload from "react-json-to-csv";
import PropTypes from "prop-types";
import axios from "axios";
import Loader from "react-loaders";
import moment from "moment";
import CountUp from "react-countup";
import { Table, Tag, Space, DatePicker,Spin } from "antd";
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

class ContactTracing extends Component {
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
    spinner:false
  };
 
  nodesEdges = (data) => {
    let setdata = [];
    if (data.length) {
      data.map((i) => {
        let set = new Set(i);
        setdata.push(Array.from(set));
      });
      let all = setdata[0].concat(setdata[1]);
      let tempData = new Set(all);
      let temp = [];
      temp.push(Array.from(tempData));
      let arrNodes = [];
      temp[0].map((i, index) => {
        var obj = { id: index + 1, label: i };
        arrNodes.push(obj);
      });
      this.setState({ nodes: arrNodes });
      let personArr = data[0];
      let contactedArr = data[1];
      for (let node = 0; node < arrNodes.length; node++) {
        for (let i = 0; i < personArr.length; i++) {
          if (personArr[i] === arrNodes[node].label) {
            personArr[i] = arrNodes[node].id;
          }
          if (contactedArr[i] === arrNodes[node].label)
            contactedArr[i] = arrNodes[node].id;
        }
      }
      var edges = [];
      for (let i = 0; i < personArr.length; i++) {
        var obj = {};
        obj.from = personArr[i];
        obj.to = contactedArr[i];
        edges.push(obj);
      }
      this.setState({ edges });
    }
  };
  showImage = async (image, index) => {
    this.setState({spinner:true})
    try {
      await axios
        .get(`${Config.hostName}/api/contact-tracing/img/${index._id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((res) => {
          this.setState({
            spinner:false,
            modalImage: res.data.img,
            modal: !this.state.modal,
          });
        });
    } catch (err) {
      this.setState({spinner:false})
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

  async componentWillMount() {
    this.tableData(this.props.pdfData);
// console.log("omg ",this.props.url)
    // this.setState({nodes:this.props.nodes,edges:this.props.edges})
  }
  render() {
    
    const graph = {
      nodes: this.state.nodes,
      edges: this.state.edges,
    };
      return(
        <Fragment>
        <div className="mt-4" style={{height:"90px",fontSize:"150%"}}>Contact Tracing Values </div>
          <Row className="mb-3">
          </Row>
          <Container fluid>
            <ResponsiveContainer height="50%">
              <Card className="mb-3">
                <CardHeader className="card-header-tab">
                  <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i className="header-icon lnr-laptop-phone mr-3 text-muted opacity-6">
                      {" "}
                    </i>
                    Contact Traced
                  </div>
                </CardHeader>
                {/* <img src={this.props.url}></img> */}
                {/* <CardBody>
                  <Graph
                    graph={graph}
                    options={options}
                    events={events}
                    height={400}
                  />
                </CardBody> */}
              </Card>
            </ResponsiveContainer>
            <Row >
              <Col>
            {/* <h1>Contact Tracing</h1> */}
                <Table dataSource={this.state.tableData}pagination={false}>
                  <Column title="Serial No." dataIndex="key" key="key" />
                  <Column
                    title="Camera"
                    dataIndex="CameraID"
                    key="CameraID"
                  />
                  <Column title="Date & Time" dataIndex="Timestamp" key="Timestamp" />
                  <Column
                    title="Person"
                    dataIndex="PersonID"
                    key="PersonID"
                  />
                  <Column
                    title="Contacted Person"
                    dataIndex="ContactedPersonID"
                    key="ContactedPersonID"
                  />
                  {/* <Column
                    title="Image"
                    dataIndex="Image"
                    key="Image"
                    render={(text, record) => (
                      <Space size="middle">
                        <a
                          className="text-primary"
                          onClick={() => this.showImage(text, record)}
                        >
                          Show Image
                        </a>
                      </Space>
                    )}
                  /> */}
                </Table>
              </Col>
            </Row>
            <Modal
              className="modal-lg"
              isOpen={this.state.modal}
              toggle={() => {
                this.setState({ modal: !this.state.modal });
              }}
            >
              <ModalBody>
                <img
                  top
                  width="100%"
                  height={500}
                  src={`data:image/jpeg;base64,${this.state.modalImage}`}
                  alt="image"
                ></img>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => {
                    this.setState({ modal: !this.state.modal });
                  }}
                >
                  Done
                </Button>
              </ModalFooter>
            </Modal>
          </Container>
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
        </Fragment>
      )
  }
}
export default ContactTracing