import React, { Component } from "react";
import AvailableClient from "../AvailableBranches";
import ShowStatus from "../ShowStatus";
import AlertConfig from "../AlertConfig";
import { Card, CardHeader, CardFooter, CardBody } from "reactstrap";
import { connect } from "react-redux";
import PropTypes, { number } from "prop-types";
import Config from "../../../config/Config";
class Index extends Component {
  componentWillMount() {
    // console.log("settings", this.props);
  }
  render() {
    if (this.props.auth.user && this.props.auth.user.userType === "client") {
      return (
        <div>
          <AvailableClient />
          {/* <ShowStatus /> */}
          <AlertConfig />
        </div>
      );
    } else {
      return (
        <div>
          <Card>
            <CardBody> Admin Account Settings need to be updated</CardBody>
          </Card>
        </div>
      );
    }
  }
}

Index.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});
export default connect(mapStateToProps, {})(Index);
