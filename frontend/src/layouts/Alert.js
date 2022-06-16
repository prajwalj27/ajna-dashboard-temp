import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { UncontrolledAlert } from "reactstrap";
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <UncontrolledAlert
      align="center"
      color={alert.alertType}
      fade
      style={{ marginTop: "10px", position: "relative" }}
    >
      {alert.msg}
    </UncontrolledAlert>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);