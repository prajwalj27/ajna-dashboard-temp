import React, { Component, Fragment } from "react";
import Config from "../../../../config/Config";
import { Stage, Layer, Circle, Text, Line, Arrow, Spin } from "react-konva";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import htmlToImage from "html-to-image";
import axios from "axios";
import moment from "moment";
let imgData = "";
class PathTracking extends Component {
  state = {
    localClientId: "",
    localBranchId: "",
    userType: "",
    todayContact: [],
    data: [],
    modal: false,
    modalImage: true,
    loading: true,
    arrow: [],
    mergedData: [],
    fetchedImage: "",
    branches: [],
    cameras: [],
    dates: [],
    url: "",
    camera: "",
    startTime: "",
    endTime: "",
    recievingStamps: false,
    count: 0,
    pdfImages: [],
    blocked: false,
    uniqueImpressionLen: 0,
    mergedTempArr: [],
    uniqueCamera: [],
  };
  ReportHandling = async (time, len) => {
    await htmlToImage
      .toPng(document.getElementById("my-node"), {
        backgroundColor: "white",
      })
      .then(async (dataUrl) => {
        let obj = {};
        obj.img = dataUrl;
        obj.time = time;
        await this.setState({
          url: [...this.state.url, obj],
          mergedData: [],
        });
        if (this.state.uniqueImpressionLen == len) {
          this.props.pdfImages(this.state.url);
        }
      });
  };
  getId = async () => {
    const { user } = this.props.auth;
    if (user && user.userType === "client") {
      if (user.clientId) {
        await this.setState({
          localClientId: user.clientId,
          localBranchId: user.branchId,
          userType: user.userType,
          // cameras: user.camera,
        });

        // await this.getArrow(user.branchId);
        // await this.getPathTracking(user.clientId);

        // await this.getMergedArray();
      } else {
        this.setState({ alertMessage: "Client ID doesn't exist" });
      }
    } else if (this.props.auth && user && user.userType === "user") {
      await this.setState({
        localClientId: user.clientId,
        userType: user.userType,
      });
      // await this.getArrow(user.clientId);
      //   await this.getPathTracking(user.clientId);

      // this.getMergedArray();
    } else {
      var size = Object.keys(this.props.admin.selectedClient).length;
      if (size) {
        await this.setState({
          localClientId: this.props.admin.selectedClient.clientId,
          localBranchId: this.props.admin.selectedClient.branchId,
          userType: this.props.admin.selectedClient.userType,
        });
        // await this.getPathTracking(this.props.admin.selectedClient.clientId);

        // await this.getArrow(this.props.admin.selectedClient.branchId);
        // this.getMergedArray();
      } else {
        this.setState({
          alertMessage: "Please Select Any Client from Admin-dashboard",
        });
      }
    }
  };

  getMergedArray = async () => {
    if (this.state.data.length) {
      let data = this.state.data,
        datascd = this.state.arrow;
      let merged = [];
      for (let i = 0; i < data.length; i++) {
        merged.push({
          ...data[i],
          ...datascd.find((itmInner) => itmInner.zone === data[i].zone),
        });
      }
      await this.setState({ mergedTempArr: merged });
    } else {
      await this.setState({ mergedTempArr: [] });
    }
  };
  getPathTracking = async (id) => {
    const { userType, camera, date } = this.state;
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    try {
      let newDate = convertUTCDateToLocalDate(
        new Date(this.state.date)
      ).toISOString();
      await this.setState({ recievingStamps: true });
      await axios
        .post(
          `${Config.hostName}/api/path-tracking/dates/${id}/${userType}`,
          {
            date: newDate,
            start: this.state.startTime,
            end: this.state.endTime,
            camera,
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
          res.data.length && (await this.setState({ data: res.data }));
          //   await this.getMergedArray();
          await this.setState({ recievingStamps: false });
        });
    } catch (err) {
      await this.setState({ recievingStamps: false });
      console.log("server err", err);
    }
  };
  async componentWillMount() {
    await this.setState({
      data: this.props.impressions,
    });
    // Different Camera have different arrow so plot different arrow on diff image
    let cameraSet = new Set();
    this.state.data.map((impression) => {
      cameraSet.add(impression.CameraID);
    });
    let unique = Array.from(cameraSet);
    this.setState({ uniqueCamera: unique });
    let formattedDate = {},
      tempArr = [];
    for (let cam = 0; cam < unique.length; cam++) {
      let SpecificCameraData = [];
      for (let i = 0; i < this.props.impressions.length; i++) {
        if (this.props.impressions[i].CameraID == unique[cam]) {
          SpecificCameraData.push(this.props.impressions[i]);
          await this.setState({ arrow: this.props.impressions[i].arrow });
        }
      }
      await this.setState({ data: SpecificCameraData });
      (await this.state.arrow) &&
        this.state.arrow.length &&
        (await this.getMergedArray());
      for (let i = 0; i < this.state.mergedTempArr.length; i++) {
        imgData = this.state.mergedTempArr[i].cameraFrame;
        formattedDate = moment(this.state.mergedTempArr[i].Timestamp).format(
          "LL"
        );
        if (!tempArr.includes(formattedDate)) tempArr.push(formattedDate);
      }
      await this.setState({ uniqueImpressionLen: tempArr.length });
      let wholeImpression = this.state.mergedTempArr;
      for (let i = 0; i < tempArr.length; i++) {
        let oneDate = [];
        for (let j = 0; j < wholeImpression.length; j++) {
          formattedDate = moment(wholeImpression[j].Timestamp).format("LL");
          if (formattedDate == tempArr[i]) oneDate.push(wholeImpression[j]);
        }
        await this.setState({ mergedData: oneDate });
        await this.ReportHandling(tempArr[i], i + 1);
      }
    }
  }

  render() {
    return (
      <Fragment>
        <div
          id="my-node"
          className="container"
          style={{
            backgroundRepeat: "no-repeat",
            backgroundImage: imgData
              ? `url(${`data:image/jpeg;base64,${imgData}`})`
              : `url(${require("../../../../images/No_Img_Avail.jpg")})`,
          }}
        >
          {this.state.mergedData.length &&
            this.state.arrow.length &&
            this.state.data.length && (
              <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                  {this.state.arrow.length &&
                    this.state.arrow.map((i, index) => {
                      let point = i.points;
                      return (
                        <Arrow
                          key={index}
                          points={[point[0], point[1], point[2], point[3]]}
                          stroke="black"
                          strokeWidth={10}
                        ></Arrow>
                      );
                    })}
                  {this.state.data.length &&
                  this.state.mergedData.length &&
                  this.state.arrow.length
                    ? this.state.mergedData.map((i, index) => {
                        if (i.points && i.points.length) {
                          let point = i.points;
                          let X = point[0] + 10;
                          let Y = point[1] + 10;
                          let txt = `${i.PersonTimestamps}`;
                          return (
                            <>
                              <Text
                                key={index}
                                fontSize={25}
                                fontStyle="bold"
                                fontFamily="poppins"
                                x={X}
                                y={Y}
                                text={
                                  txt && txt.length > 0
                                    ? `${txt}-${i.zone}`
                                    : "0"
                                }
                                ellipsis={true}
                              />
                            </>
                          );
                        }
                      })
                    : null}
                </Layer>
              </Stage>
            )}
        </div>
      </Fragment>
    );
  }
}
PathTracking.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  client: state.client,
  admin: state.admin,
});
export default connect(mapStateToProps)(PathTracking);
