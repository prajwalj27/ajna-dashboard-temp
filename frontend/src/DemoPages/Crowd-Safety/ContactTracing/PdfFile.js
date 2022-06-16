import React from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";
import ContactTracing from "./StaticContact";
import  { store, persistor } from "../../../config/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import jsPDF from "jspdf";
const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
  };
  var height=0, width=0
  class App extends React.Component{

componentWillMount(){
  this.print()}
    print = () => {
    const string = renderToString(
        <ContactTracing pdfData={this.props.data} url={this.props.url}/>
       );
    const pdf = new jsPDF('l', 'pt', 'ledger');
    var imgData = this.props.url
    width = pdf.internal.pageSize.width;    
    height = pdf.internal.pageSize.height;
    pdf.text(255,25, 'Contact Tracing');
    pdf.addImage(imgData, 'PNG', 50, 55, 800, 500);
    pdf.fromHTML(string,45,850,{ 'width' : 960});
      pdf.save("ContactTracing.pdf");
      pdf.setFontSize(14);
    }
      render(){
        return(
    <div style={styles}
    >
    </div>
  );
      }
    }
  export default App