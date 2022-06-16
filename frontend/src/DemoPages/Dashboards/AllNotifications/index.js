import React, { Component } from "react";
import { Row, Col, Card, CardHeader } from "reactstrap";
import { connect } from "react-redux";
import Config from "../../../config/Config";
import axios from "axios";
import { Divider } from "antd";
import PropTypes, { number } from "prop-types";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
class AllNotification extends Component {
  state = {
    AllNotification: [],
  };
  componentDidMount = () => {
    this.props.auth.user &&
      this.props.auth.user.userType === "user" &&
      this.setState({ AllNotification: this.props.auth.user.notifications });
  };

  render() {
    if (this.props.auth.user && this.props.auth.user.userType === "user") {
      return (
        <div>
          <Row>
            <Col>
              <CardHeader>All Notification</CardHeader>
              <Card>
                <VerticalTimeline
                  className="vertical-time-simple vertical-without-time"
                  layout="1-column"
                >
                  {this.state.AllNotification.map((i) => {
                    return (
                      <div>
                        <VerticalTimelineElement
                          className="vertical-timeline-item mt-4"
                          icon={
                            <i className="badge badge-dot badge-dot-xl badge-danger">
                              {" "}
                            </i>
                          }
                        >
                          <strong>{i}</strong>
                        </VerticalTimelineElement>
                        <Divider />
                      </div>
                    );
                  })}
                </VerticalTimeline>
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <h3>No Notification available</h3>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(AllNotification);
