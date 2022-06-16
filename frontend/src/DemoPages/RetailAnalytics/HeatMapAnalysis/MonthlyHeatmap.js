import React, { Component } from "react";
import { Card, Row, Col, Spin, Breadcrumb, Dropdown, Menu } from "antd";
import { ToastContainer, toast } from "react-toastify";
import HeatComponent from "./specificHeatmap";
import PdfHeatComponent from "./mutipleSpecific";
import {
  EyeTwoTone,
  CameraOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Modal, ModalBody, ModalFooter, Button, Alert } from "reactstrap";
import { DatePicker, Space } from "antd";
import Config from "../../../config/Config";
import { connect } from "react-redux";
import Loader from "react-loaders";
import Copied from "./multiPagePdf";
import axios from "axios";
const { Meta } = Card;
var currentMonthDates = [];

class CoverMonthHeatmap extends Component {
  state = {
    _isMounted: false,
    date: {},
    modal: false,
    month: "",
    impressions: [],
    localId: "",
    loading: true,
    camera: "",
    cameras: [],
    branches: [],
    branch: "",
    localClientId: "",
    localBranchId: "",
    modalHeight: 0,
    modalWidth: 0,
    pdfImages: [],
    pdfLoader: false,
    pdfModal: false,
    showLoader: false,
    mergedArray: [],
  };
  sampleImg = (index) => {
    let tags = document.querySelectorAll("img")[index];
    this.setState({
      modalHeight: tags.naturalHeight,
      modalWidth: tags.naturalWidth,
    });
  };
  pdfImages = async (url) => {
    await this.setState({
      pdfImages: url,
      pdfLoader: !this.state.pdfLoader,
      showLoader: false,
    });
  };
  onChange = async (date, dateString) => {
    await this.setState({ month: dateString, date: date });
    if (this.props.auth.user && this.props.auth.user.userType == "user")
      this.getMonthlyImpressions(this.state.localClientId);
    else {
      this.getMonthlyImpressions(this.state.localBranchId);
    }
  };
  viewHeatmap = async (i) => {
    let sub = i.toString();
    this.setState({ date: i, modal: true, pdfModal: false });
  };
  componentWillMount() {}
  async componentDidMount() {
    this.setState({ _isMounted: true });
    setTimeout(() => this.setState({ loading: false }), 1500);
    await this.getId();
  }

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
        this.getMonthlyImpressions(this.state.localBranchId);
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

      await this.getMonthlyImpressions(this.props.auth.user.clientId);

      // await getCameraConfig(props.auth.user.clientId);
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          userType: this.props.admin.selectedClient.userType,
        });
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
        });

        await this.getMonthlyImpressions(this.state.localClientId);
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
          `${Config.hostName}/api/heatmap/month/${id}/${this.state.userType}`,
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
            await this.setState({ impressions: res.data });
            this.mergeArray(res.data);
          }
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };
  mergeArray = async (response) => {
    currentMonthDates.map((i, index) => {
      let obj = {};
      obj.val = i;
      currentMonthDates[index] = Object.assign(obj);
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
            <Breadcrumb.Item href="/#/retail-analytics/heatmap-analysis">
              <CameraOutlined
                style={{ fontSize: "20px", color: "primary" }}
                className="mb-2"
              />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Monthly</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="row"
            // style={{ display: "inline" }}
          >
            <div className="col">
              <DatePicker
                className="ml-2"
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
            </div>
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
          </div>
          <Row>
            {this.state.mergedArray.length &&
              this.state.mergedArray.map((i, index) => {
                return (
                  <Col className="m-2" key={index}>
                    <div onClick={() => this.viewHeatmap(i.val)}>
                      <Card
                        key={index}
                        hoverable
                        style={{ width: 290 }}
                        cover={
                          <img
                            onClick={() => this.sampleImg(index)}
                            alt="example"
                            src={
                              imgData != "undefined"
                                ? `data:image/jpeg;base64,${imgData}`
                                : require("../../../images/No_Img_Avail.jpg")
                            }
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
                            <span style={{ color: "black" }}>
                              <h6>Heat Map Analysis</h6>
                              <span>
                                <strong> IMPRESSIONS :</strong>
                                {i.data ? (
                                  i.data.length &&
                                  i.data.map((i, index) => {
                                    return (
                                      <span key={index}>{i.Impressions}</span>
                                    );
                                  })
                                ) : (
                                  <span>Not Available</span>
                                  // <Tag>Not Available</Tag>
                                )}
                              </span>
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
                size="xl"
                contentClassName="custom-modal-style-path"
                isOpen={this.state.modal}
                toggle={() => {
                  this.setState({ modal: !this.state.modal });
                }}
              >
                <ModalBody contentClassName="custom-modal-style-path">
                  {this.state.pdfModal ? (
                    this.state.impressions.length ? (
                      <>
                        {this.state.showLoader && <Spin size="large" />}{" "}
                        <PdfHeatComponent
                          pdfImages={this.pdfImages}
                          impressions={this.state.impressions}
                          selectedDate={this.state.date}
                          selectedCamera={this.props.match.params.c_id}
                        />
                      </>
                    ) : (
                      <h2>No Data Available</h2>
                    )
                  ) : (
                    <HeatComponent
                      selectedDate={this.state.date}
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
export default connect(mapStateToprops)(CoverMonthHeatmap);
