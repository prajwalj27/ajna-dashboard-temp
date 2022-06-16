import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Config from "../../../../config/Config";
import axios from "axios";
import PropTypes, { number } from "prop-types";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import PerfectScrollbar from "react-perfect-scrollbar";

class TimelineEx extends Component {
  state = {
    notifications: [],
  };
  getNotifications = () => {
    axios
      .get(
        `${Config.hostName}/api/users/notification/${this.props.auth.user.clientId}`
      )
      .then((res) => {
        console.log("notifications", res.data);
        this.setState({ notifications: res.data });
      })
      .catch((err) => {
        console.log("error notification", err);
      });
  };
  async componentWillMount() {
    // this.getNotifications();
  }
  render() {
    if (this.state.notifications.length) {
      return (
        <Fragment>
          <div className="scroll-area-sm">
            {/* {this.PusherComponent()} */}
            <PerfectScrollbar>
              <div className="p-3">
                <VerticalTimeline
                  className="vertical-time-simple vertical-without-time"
                  layout="1-column"
                >
                  {/* {this.state.notifications
                    ? this.state.notifications.map((i) => {
                        return (
                          <VerticalTimelineElement
                            className="vertical-timeline-item"
                            icon={
                              <i className="badge badge-dot badge-dot-xl badge-success">
                                {" "}
                              </i>
                            }
                          >
                            <div className="timeline-title">{i}</div>
                          </VerticalTimelineElement>
                        );
                      })
                    : null} */}
                  {/* <VerticalTimelineElement className="vertical-timeline-item">
                //   <h4 className="timeline-title">All Hands Meeting</h4>
                // </VerticalTimelineElement>
                 <VerticalTimelineElement className="vertical-timeline-item">
                //   <p>
                //     Another meeting today, at{" "}
                //     <b className="text-danger">12:00 PM</b>
                //   </p>
                // </VerticalTimelineElement>
                 <VerticalTimelineElement className="vertical-timeline-item">
                //   <h4 className="timeline-title">
                //     Build the production release
                //   </h4>
                // </VerticalTimelineElement>
                <VerticalTimelineElement className="vertical-timeline-item">
                //   <h4 className="timeline-title">All Hands Meeting</h4>
                // </VerticalTimelineElement>
                <VerticalTimelineElement className="vertical-timeline-item">
                //   <h4 className="timeline-title text-success">
                //     FontAwesome Icons
                //   </h4>
                // </VerticalTimelineElement>
                 <VerticalTimelineElement className="vertical-timeline-item">
                //   <h4 className="timeline-title">
                //     Build the production release
                //   </h4>
                // </VerticalTimelineElement>
                 <VerticalTimelineElement className="vertical-timeline-item"> */}
                  {/* <p>
                    Another meeting today, at{" "}
                    <b className="text-warning">12:00 PM</b>
                  </p>
                </VerticalTimelineElement> */}
                </VerticalTimeline>
              </div>
            </PerfectScrollbar>
          </div>
        </Fragment>
      );
    } else {
      return <Fragment></Fragment>;
    }
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(TimelineEx);
