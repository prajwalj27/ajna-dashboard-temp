import React, { Fragment } from "react";
import MegaMenuFooter from "./Components/FooterMegaMenu";
import FooterDots from "./Components/FooterDots";

class AppFooter extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="app-footer">
          <div className="app-footer__inner">
        <span ><a className="text-center" href="/">ESPL</a> &copy; 2022.</span>

            <div className="app-footer-left">
              {/* <FooterDots /> */}
            </div>
            <div className="app-footer-right">
              {/* <MegaMenuFooter /> */}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AppFooter;
