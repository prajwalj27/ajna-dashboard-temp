import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { logout} from "../../../actions/user.actions";
import {connect}from 'react-redux'
import PropTypes from "prop-types";


class Page404 extends Component {
componentDidMount(){

//   localStorage.clear();
}
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">404</h1>
                <h4 className="pt-3 ">Oops! You're lost.</h4>
                <p className="text-muted float-left">The page you are looking for was not found.</p>
              </div>
              
              <div>
                  {/* <Link to="/user/login">
                              <Button onClick={e => 
                this.props.logout(e)}
                              
                              color="link" className="px-1"><h3> Again Sign In</h3></Button>
                         </Link> */}
                         </div>
              {/* <InputGroup className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-search"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input size="16" type="text" placeholder="What are you looking for?" />
                <InputGroupAddon addonType="append">
                  <Button color="info">Search</Button>
                </InputGroupAddon>
              </InputGroup> */}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Page404.propTypes = {
  logout:PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps,{logout}) (Page404);
