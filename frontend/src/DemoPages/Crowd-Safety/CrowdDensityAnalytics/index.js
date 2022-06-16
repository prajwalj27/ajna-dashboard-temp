import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  Button,
  CardHeader,
  Container,
  Card,
  CardBody,
  Progress,
  ListGroup,
  ListGroupItem,
  CardFooter,
  CustomInput,
  Input,
  Dropdown,
  Alert,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
} from "reactstrap";
import Config from '../../../config/Config'
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { Pie } from "react-chartjs-2";
import axios from 'axios'
import CountUp from "react-countup";
import {connect}from 'react-redux'
import ReactTable from "react-table";

import avatar1 from "../../../assets/utils/images/avatars/1.jpg";
import avatar2 from "../../../assets/utils/images/avatars/2.jpg";

// import Ionicon from 'react-ionicons';
import { IoIosAnalytics } from "react-icons/io";

import PerfectScrollbar from "react-perfect-scrollbar";

import Slider from "react-slick";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

import { Sparklines, SparklinesCurve } from "react-sparklines";

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

    
 

class CrowdDensity extends Component {
  state = {
    localId: null,
    data:[]
  };
  getCrowdDensityData = async (id) => {
    let localImageArray = [];
    try {
      await axios
        .get(Config.hostName + `/api/crowd-density/me/` + id, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then((res) => {
          console.log("crowd",res.data)
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
        this.getCrowdDensityData(this.props.auth.user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        this.setState({ localId: this.props.admin.selectedClient.clientId });
        this.getCrowdDensityData(this.props.admin.selectedClient.clientId);
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };
componentDidMount(){
  this.getId()
}

  render() {
    const { data } = this.state;
console.log("render",data)
// const pieData = {
//   labels: [`${data[0].Density}`, `${data[1].Density}`, `${data[2].Density}`],
//   datasets: [
//     {
//       data: [data[0].PercentValue, data[1].PercentValue, data[2].PercentValue],
//       backgroundColor: ["#8dace7", "#71deb9", "#ef869e"],
//       hoverBackgroundColor: ["#8dace7", "#71deb9", "#ef869e"],
//     },
//   ],
// };
if(this.state.localId){
    return (
      <Fragment>
        <Container fluid>
          <Row>
            <Col md="6" xl="4">
              <div className="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-success border-success">
                <div className="widget-chat-wrapper-outer">
                  <div className="widget-chart-content pt-3 pl-3 pb-1">
                    <div className="widget-chart-flex">
                      <div className="widget-numbers">
                        <div className="widget-chart-flex">
                          <div className="fsize-4">
                            <small className="opacity-5">$</small>
                            <CountUp start={0} end={874} separator="" decimals={0} decimal="" prefix="" duration="10"/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h6 className="widget-subheading mb-0 opacity-5">
                      Face Detected
                    </h6>
                  </div>
                </div>
              </div>
            </Col>
            <Col md="6" xl="4">
              <div className="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-primary border-primary">
                <div className="widget-chat-wrapper-outer">
                  <div className="widget-chart-content pt-3 pl-3 pb-1">
                    <div className="widget-chart-flex">
                      <div className="widget-numbers">
                        <div className="widget-chart-flex">
                          <div className="fsize-4">
                            <small className="opacity-5">$</small>
                            <CountUp start={0} end={1283} separator="" decimals={0} decimal="" prefix="" duration="10"/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h6 className="widget-subheading mb-0 opacity-5">
                    With Mask
                    </h6>
                  </div>
                </div>
              </div>
            </Col>
            <Col md="6" xl="4">
              <div className="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-warning border-warning">
                <div className="widget-chat-wrapper-outer">
                  <div className="widget-chart-content pt-3 pl-3 pb-1">
                    <div className="widget-chart-flex">
                      <div className="widget-numbers">
                        <div className="widget-chart-flex">
                          <div className="fsize-4">
                            <small className="opacity-5">$</small>
                            <CountUp start={0} end={1286} separator="" decimals={0} decimal="" prefix="" duration="10"/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h6 className="widget-subheading mb-0 opacity-5">
                      Without Mask
                    </h6>
                  </div>
                </div>
              </div>
            </Col>
            
          </Row>
          {/* <Row  className="mb-3">
              <Col md="10" xl="10">
              <Card>
             {this.state.data.length&& <Pie dataKey="value" data={pieData} />}
              </Card>
              </Col>
            </Row> */}
          
          <div className="card no-shadow bg-transparent no-border rm-borders mb-3">
            
          </div>
        </Container>
      </Fragment>
    );
  }
  else{
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
export default connect(mapStateToProps)(CrowdDensity)