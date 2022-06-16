import React, { Component } from "react";
import jsmpeg from "./jsmpeg";

export default class RtspVideo extends Component {
  componentDidMount() {
    var canvas = document.getElementById("videoCanvas");

    // var ws = new WebSocket("ws://localhost:9999")
    var ws = new WebSocket("ws://192.168.1.9:9999");

    var player = new jsmpeg(ws, {
      canvas: canvas,
      autoplay: true,
      audio: false,
      loop: true,
      seekable: true,
    });
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
