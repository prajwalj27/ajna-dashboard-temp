import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody } from "reactstrap";
import { Space, Typography, Divider } from "antd";

// import {} from "@ant-design/icons";
export default class index extends Component {
  render() {
    return (
      <div>
        <Card className="p-2">
          <CardHeader>REPORTS</CardHeader>
          <CardBody className="pt-5">
            <div className="row pt-1">
              <div className="col">
                <Space direction="vertical">
                  <h5>FOOTFALL ANALYSIS</h5>
                  <Link to="/retail-analytics/footfall-analysis">
                    Branch Based Analysis
                  </Link>
                  <Link to="/retail-analytics/footfall-analysis">
                    Camera Based Analysis
                  </Link>
                  <Link to="/retail-analytics/footfall-analysis">
                    Zone Based Analysis
                  </Link>
                </Space>
              </div>
              <div className="col">
                <Space direction="vertical">
                  <h5>HEATMAP ANALYSIS</h5>
                  <Link to="/retail-analytics/heatmap-analysis">
                    Branch Based Analysis
                  </Link>
                  <Link to="/retail-analytics/heatmap-analysis">
                    Camera Based Analysis
                  </Link>
                </Space>
              </div>
              <div className="col">
                <Space direction="vertical">
                  <h5>DWELL TIME ANALYSIS</h5>
                  <Link to="/retail-analytics/dwell-time-analysis">
                    Branch Based Analysis
                  </Link>
                  <Link to="/retail-analytics/dwell-time-analysis">
                    Camera Based Analysis
                  </Link>
                  <Link to="/retail-analytics/dwell-time-analysis">
                    Zone Based Analysis
                  </Link>
                </Space>
              </div>
            </div>
            <br />
            <Divider />
            <div className="row pt-3">
              <div className="col">
                <Space direction="vertical">
                  <h5>PATH TRACKING</h5>
                  <Link to="/retail-analytics/path-tracking">
                    Branch Based Analysis
                  </Link>
                  <Link to="/retail-analytics/path-tracking">
                    Camera Based Analysis
                  </Link>
                </Space>
              </div>
              <div className="col">
                <Space direction="vertical">
                  <h5>GENERAL REPORT</h5>
                  <Link to="/site-reports/daily">Branch Based Analysis</Link>
                  <Link to="/site-reports/daily">Camera Based Analysis</Link>
                  <Link to="/site-reports/daily">Metric Based Analysis</Link>
                </Space>
              </div>
              <div className="col">
                <Space direction="vertical">
                  <h5>COMPARISON REPORT</h5>
                  <Link to="/site-reports/weekly">Week VS Weekend</Link>
                  <Link to="/site-reports/weekly">Compare Different Zones</Link>
                </Space>
              </div>
            </div>
          </CardBody>{" "}
        </Card>
      </div>
    );
  }
}
