import React, { Component } from "react";
import Chart from "react-google-charts";

export default class ZonesChart extends Component {
  render() {
    if (this.props.data[0]) {
      return (
        <div>
          <Chart
            // width={780}
            height={300}
            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={this.props.data[0]}
            options={{
              title: `Zone ${this.props.title}`,
              hAxis: { title: "Week", titleTextStyle: { color: "#333" } },
              vAxis: { minValue: 0 },
              // For the legend to fit, we make the chart area smaller
              chartArea: { width: "60%", height: "70%" },
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
