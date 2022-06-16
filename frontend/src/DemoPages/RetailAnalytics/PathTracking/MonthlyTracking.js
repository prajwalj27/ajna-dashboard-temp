import React, { Component } from "react";
import { Card, Row, Col, Tag, Breadcrumb } from "antd";
import PathTracking from "./SpecificPathTracking";
import { ToastContainer, toast } from "react-toastify";
import MultipleImgs from "./multipleSpecificImg";
import {
  EyeTwoTone,
  CameraOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Copied from "./mutiplePagePdf";
import { Modal, ModalBody, ModalFooter, Button, Alert } from "reactstrap";
import { DatePicker, Menu, Dropdown } from "antd";
import Config from "../../../config/Config";
import { connect } from "react-redux";
import Loader from "react-loaders";
import axios from "axios";
import "./index.css";
const { Meta } = Card;
var currentMonthDates = [];

class CoverMonthPathTracking extends Component {
  state = {
    _isMounted: false,
    showMainComponent: false,
    date: {},
    modal: false,
    month: "",
    impressions: [],
    localId: "",
    loading: true,
    mergedArray: [],
    camera: "",
    cameras: [],
    branches: [],
    branch: "",
    localClientId: "",
    localBranchId: "",
    pdfModal: false,
    pdfImages: [],
  };

  pdfImages = (url) => {
    this.setState({ pdfImages: url, pdfLoader: !this.state.pdfLoader });
  };
  onChange = async (date, dateString) => {
    await this.setState({ month: dateString, date: date });
    this.props.auth.user.userType == "client" &&
      this.getMonthlyImpressions(this.state.localBranchId);
    this.props.auth.user.userType == "user" &&
      this.getMonthlyImpressions(this.state.localClientId);
  };
  viewPath = (i) => {
    this.setState({ showMainComponent: true, date: i, modal: true });
  };
  async componentDidMount() {
    this.setState({ _isMounted: true });
    setTimeout(() => this.setState({ loading: false }), 1500);
    await this.getId();
    // await this.mergeArray();
  }
  mergeArray = async (response) => {
    currentMonthDates.map((i, index) => {
      let obj = {};
      obj.val = i;
      return (currentMonthDates[index] = Object.assign(obj));
    });

    for (let i = 0; i < currentMonthDates.length; i++) {
      let arr = [];
      for (let j = 0; j < response.length; j++) {
        let dateOnly = parseInt(
          response[j].Timestamp.split("T")[0].split("-")[2]
        );

        if (dateOnly == currentMonthDates[i].val.getDate()) {
          arr.push(response[j]);
          //  +1 array initialise with zero index
          currentMonthDates[i].data = arr;
        }
      }
    }
    await this.setState({ mergedArray: currentMonthDates });
  };
  componentWillUnmount() {
    this.setState({ _isMounted: false });
  }
  getId = async () => {
    if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "client"
    ) {
      if (this.props.auth.user.clientId) {
        await this.setState({ localClientId: this.props.auth.user.clientId });
        await this.setState({ userType: this.props.auth.user.userType });
        await this.setState({ localBranchId: this.props.auth.user.branchId });

        this.getMonthlyImpressions(this.props.auth.user.branchId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.userType === "user"
    ) {
      await this.setState({ localClientId: this.props.auth.user.clientId });
      await this.setState({ userType: this.props.auth.user.userType });

      this.getMonthlyImpressions(this.props.auth.user.clientId);
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          userType: this.props.admin.selectedClient.userType,
        });
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
        });
        this.getMonthlyImpressions(this.state.localClientId);
      } else {
      }
    }
  };
  getMonthlyImpressions = async (id) => {
    if (!this.state.date._d) {
      await this.setState({ date: new Date() });
    }
    try {
      await axios
        .post(
          `${Config.hostName}/api/path-tracking/month/${id}/${this.state.userType}`,
          {
            month: this.state.date,
            camera: this.props.match.params.c_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-auth-token": this.props.auth.token,
            },
          }
        )
        .then(async (res) => {
          if (res.data) {
            console.log("resd", res.data);
            await this.setState({ impressions: res.data });
            this.mergeArray(res.data);
          }
        });
    } catch (error) {
      console.log("error cover path", error);
    }
  };
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <button
            onClick={async () => {
              await this.setState({
                pdfModal: !this.state.pdfModal,
                modal: true,
                showLoader: true,
              });
              this.state.impressions.length &&
                toast.info(`Please Wait!! Pdf Generating ...`, {
                  position: "top-left",
                  // autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
            }}
            style={{
              backgroundColor: "white",
              border: "1px solid white",
            }}
          >
            PDF
          </button>
        </Menu.Item>
      </Menu>
    );
    let imgData = localStorage.getItem("imgData");

    const { month, loading } = this.state;
    var date = new Date();
    const getDaysInMonth = (month, year) =>
      new Array(31)
        .fill("")
        .map((v, i) => new Date(year, month - 1, i + 1))
        .filter((v) => v.getMonth() === month - 1);
    let showMonth = date.getMonth() + 1;
    let showYear = date.getFullYear();
    if (this.state.month) {
      showMonth = month.split("-")[1];
      showMonth = parseInt(showMonth);
      showYear = parseInt(month.split("-")[0]);
    }

    currentMonthDates = getDaysInMonth(showMonth, showYear);
    if (this.state.localClientId) {
      return loading ? (
        <Loader type="line-scale-party" />
      ) : (
        <div>
          {this.state.pdfLoader && <Copied url={this.state.pdfImages} />}

          <Breadcrumb>
            <Breadcrumb.Item href="/#/retail-analytics/path-tracking">
              <CameraOutlined
                style={{ fontSize: "20px", color: "primary" }}
                className="mb-2"
              />
              {/* <span className="mb-0">Camera List</span> */}
            </Breadcrumb.Item>
            <Breadcrumb.Item>Monthly</Breadcrumb.Item>
          </Breadcrumb>

          <Row>
            <Col>
              <DatePicker
                className="ml-3"
                suffixIcon
                width={170}
                //   prefixCls="Select Month"
                style={{
                  height: "auto",
                  width: "300",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
                onChange={this.onChange}
                picker="month"
              />
            </Col>
            <div className="col mr-5">
              <Dropdown.Button
                className="mr-5"
                style={{ float: "right" }}
                shape="round"
                type="primary"
                overlay={menu}
                icon={
                  <DownloadOutlined
                    style={{
                      fontSize: "20px",
                      // color: "#3ac47d"
                    }}
                  />
                }
              >
                Download
              </Dropdown.Button>
            </div>
          </Row>
          <Row>
            {this.state.mergedArray.map((i, index) => {
              // console.log("month", i);
              return (
                <Col className="m-2" key={index}>
                  <div onClick={() => this.viewPath(i)}>
                    <Card
                      key={index}
                      hoverable
                      style={{ width: 290 }}
                      cover={
                        <img
                          alt="path track"
                          src={
                            imgData != "undefined"
                              ? `data:image/jpeg;base64,${imgData}`
                              : require("../../../images/No_Img_Avail.jpg")
                          }
                          // src={require("../../../images/store_img.png")}
                        />
                      }
                    >
                      <Meta
                        title={
                          <span>
                            <EyeTwoTone />{" "}
                            <> {i.val.toDateString().substring(0, 10)}</>
                          </span>
                        }
                        description={
                          <span>
                            {i.data ? (
                              i.data.length &&
                              i.data.map((i, index) => {
                                return (
                                  <Tag key={index}>
                                    <strong>{i.zone} :</strong>
                                    {i.Impressions}
                                  </Tag>
                                );
                              })
                            ) : (
                              <Tag>Not Available</Tag>
                            )}
                          </span>
                        }
                      />
                    </Card>
                  </div>
                </Col>
              );
            })}

            {
              <Modal
                contentClassName="full-page"
                size="xl"
                // style={{
                //   height: "3000px",
                // }}
                // className="modal-lg"
                isOpen={this.state.modal}
                toggle={() => {
                  this.setState({ modal: !this.state.modal });
                }}
              >
                <ModalBody className="scrollable-container">
                  {!this.state.pdfModal ? (
                    <PathTracking
                      selectedDate={this.state.date}
                      selectedCamera={this.props.match.params.c_id}
                    />
                  ) : (
                    <MultipleImgs
                      pdfImages={this.pdfImages}
                      impressions={this.state.impressions}
                      selectedCamera={this.props.match.params.c_id}
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={() => {
                      this.setState({ modal: !this.state.modal });
                    }}
                  >
                    Done
                  </Button>
                </ModalFooter>
              </Modal>
            }
          </Row>
        </div>
      );
    } else {
      return (
        <Alert color="danger">
          Id Is not present Please Select a Client from Admin Dashboard{" "}
        </Alert>
      );
    }
  }
}
const mapStateToprops = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  // heatmap: state.heatmap,
});
export default connect(mapStateToprops)(CoverMonthPathTracking);
