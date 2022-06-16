import React, { Component, Fragment } from "react";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import PerfectScrollbar from "react-perfect-scrollbar";

class ChatExample extends Component {
  render() {
    return (
      <Fragment>
        <div className="scroll-area-sm">
          <PerfectScrollbar>
            <div className="p-3">
              <VerticalTimeline
                layout="1-column"
                className="vertical-without-time"
              >
                <VerticalTimelineElement
                  className="vertical-timeline-item"
                  icon={
                    <i className="badge badge-dot badge-dot-xl badge-success">
                      {" "}
                    </i>
                  }
                >
                  <h4 className="timeline-title">No System Errors</h4>
                  {/* <p>
                    Lorem ipsum dolor sic amet, today at{" "}
                    <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                      12:00 PM
                    </a>
                  </p> */}
                </VerticalTimelineElement>
              </VerticalTimeline>
            </div>
          </PerfectScrollbar>
        </div>
      </Fragment>
    );
  }
}

export default ChatExample;
