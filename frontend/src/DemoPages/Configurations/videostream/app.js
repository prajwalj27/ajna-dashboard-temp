import React from "react";
import JSMpeg from "jsmpeg-player";
// import "./App.css";

// import JsmpegPlayer from "./Jsmpeg1";

class App extends React.Component {
  componentDidMount() {
    // var videoUrl = '../static/media/test_video.ts';
    var ws = new WebSocket("ws://192.168.1.9:9999");
    new JSMpeg.VideoElement("#videoCanvas", ws);
  }
  render() {
    return (
      <div>
        <canvas
          class="camera"
          id="videoCanvas"
          width="640"
          height="360"
        ></canvas>
      </div>
    );
  }
}
export default App;
