import React, { Component } from "react";
import Chart from "react-google-charts";

export default class ZonesChart extends Component {
  render() {
    if (this.props.data[0]) {
      return (
        <div>
          <Chart
            style={{ overflow: "hidden" }}
            // width={780}
            height={300}
            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={this.props.data[0]}
            options={{
              title: `Zone ${this.props.title}`,
              hAxis: { title: "Weekly Data", titleTextStyle: { color: "red" } },
              vAxis: { minValue: 0 },
              // For the legend to fit, we make the chart area smaller
              chartArea: { width: "60%", height: "60%" },
              // lineWidth: 10
            }}
            // For tests
            rootProps={{ "data-testid": "1" }}
          />
        </div>
      );
    }
  }
}
