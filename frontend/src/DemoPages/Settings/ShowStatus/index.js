import React, { Component } from 'react'
import { Switch,Divider,Tooltip } from 'antd';
import { connect } from "react-redux";
import PropTypes, { number } from "prop-types";
import Config from "../../../config/Config";
import Loader from "react-loaders";
import axios from "axios";

import {CameraFilled,CheckCircleTwoTone,InfoCircleOutlined
  } from '@ant-design/icons';
import {Card,CardBody,CardHeader,Row,Col}from 'reactstrap'
class ShowStatus extends Component {
    state={
        localId:"",
        loading:true,
        cameras:[]
    }
     onChange=(checked)=> {
        // console.log(`switch to ${checked}`);
      }
      getId = async() => {
        if (this.props.auth.user.userType === "user") {
          if (this.props.auth.user.clientId) {
            await this.setState({ localId: this.props.auth.user.clientId });
            this.getCameraStatus(this.props.auth.user.clientId)
          } else {
            this.setState({ alertMessage: "Client ID doesn't exist" });
          }
        } else {
          var size = Object.keys(this.props.admin.selectedClient).length;
          if (size) {
            await this.setState({ localId: this.props.admin.selectedClient.clientId });
            this.getCameraStatus(this.props.admin.selectedClient.clientId)
          } else {
            this.setState({
              alertMessage: "Please Select Any Client from Admin-dashboard",
            });
          }
        }
      };

  getCameraStatus = (id) => {
    axios
      .get(`${Config.hostName}/api/users/cameraStatus/${id}`)
      .then((res) => {
        // console.log("cameraStatus", res.data);
        this.setState({ cameras: res.data });
      })
      .catch((err) => {
        if (err.response) {
          const errors = err.response.data.errors;
          if (errors) {
            errors.forEach((error) => {
            console.log("error",error)
            });
          }
        }
      });
  };
      async componentWillMount(){
    setTimeout(() => this.setState({ loading: false }), 1500);
        await this.getId()
      }
    render() {
        const {loading}=this.state
        if (this.state.localId) {
             return loading?(<Loader type="line-scale-party" />
             ) : (
            <div>
                <Card className="mt-5">
                    <CardHeader>
            <Tooltip placement="topLeft" title="Check Whether camera is in active or inactive state">
            <InfoCircleOutlined className=" mr-1"/></Tooltip>            Show Camera State
                      </CardHeader>
                    <CardBody>
                      {this.state.cameras.length&&this.state.cameras.map((i,index)=>{
                        return <div>
                          <Row key={index}>
                            <Col md="1"><CameraFilled style={{ fontSize: '20px', color: '#08c' }}/></Col>
                            <Col md="3">{i.cameraName}</Col>
                            <Col><Switch disabled defaultChecked={i.cameraStatus} onChange={this.onChange} /></Col>
                        </Row>
                        <Divider/>
                        </div>
                      })}
                        {/* <Row>
                            <Col md="1"><CameraFilled style={{ fontSize: '20px', color: '#08c' }}/></Col>
                            <Col md="3">Basement</Col>
                            <Col><Switch defaultChecked={false} onChange={this.onChange} /></Col>
                        </Row>
                        <Divider/>
                        <Row>
                            <Col md="1"><CameraFilled style={{ fontSize: '20px', color: '#08c' }}/></Col>
                            <Col md="3">Aisle 1</Col>
                            <Col><Switch defaultChecked={true} onChange={this.onChange} />{" "}
                            <CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize:"30px"}}/>
                            </Col>
                            
                        </Row> */}
                    </CardBody>
                </Card>
            </div>
        )
    }
}
}
ShowStatus.propTypes = {
    auth: PropTypes.object.isRequired,
    admin:PropTypes.object.isRequired,
  };
  
  const mapStateToProps = (state) => ({
    auth: state.auth,
    admin:state.admin
  });
  export default connect(mapStateToProps,{})(ShowStatus);
  