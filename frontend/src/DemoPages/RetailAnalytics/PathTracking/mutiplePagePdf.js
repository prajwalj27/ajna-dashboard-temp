import React from "react";
import jsPDF from "jspdf";
const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
};
let logo =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAAAlCAYAAACZOKFiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFrGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA1LTMwVDIwOjI0OjU0KzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNS0zMVQxNTo0MzoxOCswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNS0zMVQxNTo0MzoxOCswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4Njc1ZmFmNy1mMjYw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";
class App extends React.Component {
  componentWillMount() {
    this.print();
  }
  print = () => {
    const pdf = new jsPDF("p", "pt", "a4");
    let width = pdf.internal.pageSize.width;
    pdf.setFontSize(20);
    pdf.text(205, 60, "PATH TRACKING ANALYSIS");
    pdf.setFont("helvetica");
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 0; i < this.props.url.length; i++) {
      pdf.addImage(this.props.url[i].img, "PNG", 10, 115, width + 50, 450);
      pdf.setFontSize(15);
      // pdf.setTextColor(255, 255, 255);
      pdf.addImage(logo, "PNG", 10, 10, 95, 30);
      pdf.text(20, 100, `Date : ${this.props.url[i].time}`);
      pdf.addPage();
    }
    // For each page, print the page number and the total pages
    for (var i = 1; i <= pageCount; i++) {
      // Go to page i
      pdf.setPage(i);
      // pdf.addImage(logo, "PNG", 5, 5, 55, 25);
      pdf.setLineWidth(1.5);

      //   pdf.text(
      //     `Copyright © Ajna AI 2020`,
      //     210 - 20,
      //     297 - 10,
      //     null,
      //     null,
      //     "right"
      //   );
    }
    pdf.save("PathTracking.pdf");
    // pdf.setFontSize(9);
  };
  render() {
    return <div style={styles}></div>;
  }
}
export default App;
