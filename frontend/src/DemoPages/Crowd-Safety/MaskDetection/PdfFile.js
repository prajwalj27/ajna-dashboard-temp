import React from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";
import MaskDetection from "./StaticMask";
import  { store, persistor } from "../../../config/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import jsPDF from "jspdf";
import 'jspdf-autotable'
 
// const doc = new jsPDF()
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
        <MaskDetection pdfData={this.props.data} url={this.props.url}/>
       );
    const pdf = new jsPDF('l', 'pt', 'ledger');
    
    var imgData = this.props.url
    width = pdf.internal.pageSize.width;    
    height = pdf.internal.pageSize.height;
    pdf.text(255,25, 'Mask Detection');
    pdf.addImage(imgData, 'PNG', 50, 55, 800, 700);
    // pdf.text(255,850, 'somthing');

    pdf.fromHTML(string,45,800,
      {
        retina: true,
        pagesplit: true,
        margin: {
          top: 50,
          right: 25,
          bottom: 50,
          left: 25,
          useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
        }
      }
        // { 'width' : 960}
        );
      pdf.save("MaskDetection.pdf");
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