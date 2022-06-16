import React, { Component } from "react";
import Zones from "../zones";
import { Redirect } from "react-router-dom";
// import ShowStatus from "../ShowStatus";
// import AlertConfig from "../AlertConfig";
import { Divider } from "antd";
import { Card, CardHeader, CardFooter, CardBody, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import PropTypes, { number } from "prop-types";
import Config from "../../../config/Config";
class Index extends Component {
  componentWillMount() {
    // console.log("settings", this.props);
  }
  render() {
    if (
      this.props.auth.user &&
      this.props.auth.user.userType == "user" &&
      !this.props.auth.user.editAccess.length
    )
      return <Redirect to={"/dashboard/home"} />;

    if (this.props.auth.user && this.props.auth.user.userType !== "admin") {
      return (
        <div>
          <Card>
            <CardHeader>Configurations</CardHeader>
            <CardBody>
              {this.props.auth.user.userType == "client" && (
                <>
                  {" "}
                  <Row>
                    <Col className="">
                      <strong>Add Device and Camera</strong>
                    </Col>
                    <Col>
                      <a href="/#/configurations/videoStream">Click Here</a>
                    </Col>
                  </Row>
                  <Divider />
                </>
              )}
              <Row>
                <Col className="">
                  <strong>Configure Camera Image</strong>
                </Col>
                <Col>
                  <a href="/#/configurations/image-upload">Click Here</a>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col className="">
                  <strong>Configure Path Tracking</strong>
                </Col>
                <Col>
                  <a href="/#/configurations/path-tracking">Click Here</a>
                </Col>
              </Row>{" "}
              <Divider />
              <Row>
                <Col>
                  <strong>Configure Social Distancing </strong>
                </Col>
                <Col>
                  <a href="/#/configurations/social-distancing">Click Here</a>{" "}
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col className="">
                  <strong>Configure Zones</strong>
                </Col>
                <Col>
                  <a href="/#/configurations/zones">Click Here</a>
                </Col>
              </Row>
              <Divider />
              {/* <Row>
                <Col className="">Configure Device</Col>
                <Col>
                  <a href="/#/configurations/device-stream">Click Here</a>
                </Col>
              </Row>
              <Divider /> */}
              {/* user can't add new camera as camera will be alloted by client */}
            </CardBody>
          </Card>
          {/* <Zones /> */}
          {/* <AvailableClient/> */}
          {/* <ShowStatus />
          <AlertConfig /> */}
        </div>
      );
    } else {
      return (
        <div>
          <Card>
            <CardBody> Admin Account Settings need to be updated</CardBody>
          </Card>
        </div>
      );
    }
  }
}

Index.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});
export default connect(mapStateToProps, {})(Index);
