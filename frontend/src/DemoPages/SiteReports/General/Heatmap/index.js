import React from "react";
import { TimePicker, Select, Button, Table, Carousel } from "antd";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import "../steps.css";
import Config from "../../../../config/Config";
import axios from "axios";
import PdfHeatComponent from "./PlotHeatmap";
import { Card } from "reactstrap";
let allCameras = [];
const items = [
  {
    id: 1,
    altText: "Slide 1",
    caption: "Slide 1",
  },
  {
    id: 2,
    altText: "Slide 2",
    caption: "Slide 2",
  },
  {
    id: 3,
    altText: "Slide 3",
    caption: "Slide 3",
  },
];
class App extends React.Component {
  state = {
    _isMount: false,
    userType: "",
    localBranchId: "",
    localClientId: "",
    visible: false,
    branches: [],
    branch: [],
    cameras: [],
    camera: [],
    radioOption: "day",
    showTime: false,
    date: "",
    time: "",
    month: "",
    week: "",
    pdfLoader: false,
    pdfModal: false,
    modal: false,
    metric: [],
    fetchedImage: "",
    loading: false,
    impressions: [],
    heatCamera: "",
    pdfImages: [],
    showLoader: false,
    activeIndex: 0,
    animating: false,
    items: [],
    fetchedImages: [],
  };
  pdfImages = async (url) => {
    await this.setState({
      pdfImages: url,
      modal: false,
    });
    this.props.heatmapReportGeneration(url);
  };
  noCameraAvail = async () => {
    if (!this.state.camera.length) {
      let userCameraArray = [];
      this.state.cameras.map((i) => {
        userCameraArray.push(i.cameraId);
      });
      await this.setState({ camera: userCameraArray });
    }
  };
  async componentDidMount() {
    this.props.onRef(this);
    this.getId();
    const {
      localBranchId,
      localClientId,
      camera,
      date,
      radioOption,
      week,
      month,
    } = this.props;
    await this.setState({
      localClientId,
      localBranchId,
      camera,
      date,
      week,
      radioOption,
      month,
    });
    this.getSpecificCameraImage(
      this.state.localBranchId,
      "client",
      this.state.camera[0]
    );
  }
  componentWillMount() {
    this.setState({ _isMount: true });
  }
  componentWillUnmount() {
    this.props.onRef(null);
    this.setState({ _isMount: false });
  }
  handleSizeChange = async (e) => {
    e.preventDefault();
    await this.setState({ radioOption: e.target.value });
  };
  getAllBranches = (id) => {
    axios
      .get(`${Config.hostName}/api/branch/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": this.props.auth.token,
        },
      })
      .then((res) => {
        this.setState({ branches: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getId = async () => {
    const { user } = this.props.auth;
    const { cameras, userType } = this.state;
    await this.setState({ userType: this.props.auth.user.userType });
    if (this.props.auth && user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          cameras: user.camera,
          localBranchId: user.branchId,
          localClientId: user.clientId,
          userType: user.userType,
          metric: ["count", "passerBy"],
        });

        allCameras = user.camera.map((i) => {
          return i.cameraId;
        });
        await this.setState({
          camera: allCameras,
        });
        this.noCameraAvail();
        this.getAllBranches(user.clientId);
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      this.getUserBranchFromProps();
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
        // localBranchId: user.camera.length && user.camera[0].branchId,
      });
      this.noCameraAvail();
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          cameras: this.props.admin.selectedClient.camera,
          localBranchId: this.props.admin.selectedClient.branchId,
          localClientId: this.props.admin.selectedClient.clientId,
          userType: this.props.admin.selectedClient.userType,
        });
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };
  onHeatAccept = async () => {
    const {
      localBranchId,
      localClientId,
      camera,
      date,
      radioOption,
      week,
      month,
    } = this.props;
    await this.setState({
      localClientId,
      localBranchId,
      camera,
      date,
      week,
      radioOption,
      month,
    });
    await this.getClientCameras();
    console.log(
      "this.props.heatmapreportGenerate",
      this.props.heatmapreportGenerate
    );
    if (radioOption == "day")
      (await this.props.heatmapreportGenerate) &&
        this.getMonthlyImpressions(localBranchId, radioOption, date);
    if (radioOption == "week")
      (await this.props.heatmapreportGenerate) &&
        this.getMonthlyImpressions(localBranchId, radioOption, week);
    if (radioOption == "month")
      (await this.props.heatmapreportGenerate) &&
        this.getMonthlyImpressions(localBranchId, radioOption, month);
  };
  getMonthlyImpressions = async (id, option, date) => {
    if (!date) {
      date = new Date();
      await this.setState({ date: new Date() });
    }
    try {
      await axios
        .post(
          `${Config.hostName}/api/pdf/heatmap/${id}`,
          {
            date: date,
            option: option,
            camera: this.state.camera,
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
            this.dataProcessed(res.data);
          }
        });
    } catch (error) {
      console.log("error Heatmap Impressions", error);
    }
  };
  dataProcessed = async (data) => {
    const { clientCameras } = this.state;
    const impressions = data;
    for (let i = 0; i < impressions.length; i++) {
      for (let j = 0; j < clientCameras.length; j++) {
        if (impressions[i].CameraID == clientCameras[j].cameraId) {
          impressions[i].cameraFrame = clientCameras[j].cameraFrame;
        }
      }
    }
    await this.setState({ impressions, modal: true });
  };
  getSpecificCameraImage = async (id, type, camera) => {
    try {
      await this.setState({ loading: true });
      await axios
        .get(`${Config.hostName}/api/branch/cameraimages/${id}`)
        .then(async (res) => {
          if (res.data) {
            await this.setState({
              fetchedImages: res.data,
              //   loading: false,
            });
          }
        });
    } catch (err) {
      this.setState({ loading: false });
      console.log("err", err);
    }
  };
  getClientCameras = async () => {
    let id = this.state.localBranchId;
    try {
      await axios
        .post(
          `${Config.hostName}/api/branch/allcamera/${id}/client`,
          { camera: this.state.camera },
          {
            params: {
              branch: this.props.auth.user.branchId,
            },
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
            this.setState({
              clientCameras: res.data,
              isImagesFetched: true,
            });
          }
        });
    } catch (error) {
      console.log("error Heatmap", error);
    }
  };
  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/pages/login"} />;
    }
    return (
      <div style={{ maxWidth: "980px" }}>
        <Card style={{ maxWidth: "980px" }}>
          <h3
            className="pt-2 pb-2"
            style={{
              textAlign: "center",
              width: "400px",
              margin: "0 auto",
              marginTop: "5px",
            }}
          >
            HEATMAP ANALYSIS
          </h3>{" "}
          <Carousel afterChange={this.onChange} autoplay={true} arrows>
            {this.state.fetchedImages.map((i) => {
              return (
                <div>
                  <img alt="frame" src={`data:image/jpeg;base64,${i}`} />
                </div>
              );
            })}
          </Carousel>
        </Card>
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
              {this.props.heatmapreportGenerate &&
              this.state.impressions.length ? (
                <>
                  <PdfHeatComponent
                    pdfImages={this.pdfImages}
                    impressions={this.state.impressions}
                    selectedCamera={this.state.camera}
                  />
                </>
              ) : (
                this.props.heatmapreportGenerate && <h2>No Data Available</h2>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
  footfall: state.footfall,
});
export default connect(mapStateToProps, {})(App);
