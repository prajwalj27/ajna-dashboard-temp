import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleReactValidator from "simple-react-validator";
import Config from "../../../config/Config";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tag } from "antd";
import { Col, Row, Form, FormGroup, Label, Input, Button } from "reactstrap";
import moment from "moment";

import { Divider } from "antd";
let startDate = 0,
  endDate = 0;
class MyAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: "",
      image: "",
      startDate: "",
      endDate: "",
    };
    this.validator = new SimpleReactValidator();
  }
  componentDidMount() {
    // console.log("setting", this.props.client);
  }
  submitImage = () => {
    const data = new FormData();
    data.append("file", this.state.image);
    console.log("mydata", data);
  };
  imageHandler = (event) => {
    const file = event.target.files[0];
    this.setState({ image: file });
    // console.log(file)
  };
  componentWillMount() {
    if (this.props.client && this.props.client.profile) {
      let startDate = moment(this.props.client.profile.dates[0]);
      let endDate = moment(this.props.client.profile.dates[1]);
      startDate = startDate.format("LLL");
      endDate = endDate.format("LLL");
      this.setState({ startDate, endDate });
    }
  }
  render() {
    if (this.props.client && this.props.client.profile) {
      let startDate = moment(this.props.client.profile.dates[0]);
      let endDate = moment(this.props.client.profile.dates[1]);
      startDate = startDate.format("LLL");
      endDate = endDate.format("LLL");
    }
    return (
      <div className="animated fadeIn">
        <div className="card mr-5 ml-5">
          <div className="card-header">My Account - Default Branch</div>
          <div className="card-body">
            {this.props.client && this.props.client.profile ? (
              <>
                <Form>
                  {/* <FormGroup row>
        <Label sm={2}>Upload </Label>
        <Col sm={8}>
          <Input type="file" 
          onChange={this.imageHandler}
            />
        </Col>
        <Col sm={2}>
        <Button onClick={this.submitImage}>Submit Image</Button>
        </Col>
      </FormGroup> */}
                  <FormGroup row>
                    <Label sm={2}>Client ID</Label>
                    <Col sm={10}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.props.client.profile.clientId}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Name</Label>
                    <Col sm={10}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.props.client.profile.name}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Email</Label>
                    <Col sm={10}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.props.client.profile.email}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Location</Label>
                    <Col sm={10}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.props.client.profile.location}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Contact</Label>
                    <Col sm={10}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.props.client.profile.contact}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Subscribed for</Label>
                    <Col sm={10}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.props.client.profile.subscribed}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>From</Label>
                    <Col sm={4}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.state.startDate}
                      />
                    </Col>
                    <Label clas sm={1}>
                      To
                    </Label>
                    <Col sm={5}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.state.endDate}
                      />
                    </Col>
                  </FormGroup>
                  {/* <FormGroup row>
                    <Label sm={2}>No of Camera</Label>
                    <Col sm={10}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.props.client.profile.NoOfCameras}
                      />
                    </Col>
                  </FormGroup> */}
                  <FormGroup row>
                    <Label sm={2}>Amount Payed</Label>
                    <Col sm={10}>
                      <Input
                        disabled
                        type="text"
                        placeholder={this.props.client.profile.amount}
                      />
                    </Col>
                  </FormGroup>
                </Form>
              </>
            ) : (
              <>
                <h5> Client Not Available</h5>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(MyAccount);
