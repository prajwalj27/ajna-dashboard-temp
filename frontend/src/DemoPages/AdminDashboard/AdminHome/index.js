import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Carousel,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
} from "reactstrap";
import PropTypes from "prop-types";
import { setAlert } from "../../../actions/alert.actions";
import { connect } from "react-redux";
import Loader from "react-loaders";
import { Redirect } from "react-router-dom";

import axios from "axios";
import ClientList from "./clientList";
import Config from "../../../config/Config";

let response;

class AdminHome extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      url: "",
      modal: false,
      data: {},
      token: "",
      clients: [],
      loading: true,
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center text-white">
      Loading...
    </div>
  );

  async componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 1000);
  }
  render() {
    if (this.props.auth.user && this.props.auth.user.userType == "client") {
      return <Redirect to={"/dashboard/home"} />;
    }
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    const { loading } = this.state;
    return loading ? (
      <Loader type="line-scale-party" />
    ) : (
      <div className="animated fadeIn ">
        <Row className="d-flex justify-space-between">
          <Col>
            <Card>
              <CardBody>
                {this.props.auth &&
                  this.props.auth.user &&
                  this.props.auth.user.userType === "admin" && <ClientList />}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
AdminHome.propTypes = {
  setAlert: PropTypes.func.isRequired,
  // login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(AdminHome);
