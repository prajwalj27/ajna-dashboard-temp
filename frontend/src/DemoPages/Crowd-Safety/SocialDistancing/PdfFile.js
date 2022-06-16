import React from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";
import SocialDistancing from "./StaticSocial";
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
        <SocialDistancing pdfData={this.props.data} />
       );
    const pdf = new jsPDF('l', 'pt', 'ledger');
    var imgData = this.props.url
    pdf.text(255,25, 'Social Distancing');
    pdf.addImage(imgData, 'PNG', 100, 55, 800, 600);
    pdf.fromHTML(string,50,875,{ 'width' : 960},{margin:{top : 40,bottom : 5,useFor: 'page'}});
    // pdf.addHTML(string, 15, 20, {}, function(){}); 
    pdf.save("SocialDistancing.pdf");
      pdf.setFontSize(24);}
      render(){
        return(
    <div style={styles}
    >
    </div>
  );
      }
    }
  export default App