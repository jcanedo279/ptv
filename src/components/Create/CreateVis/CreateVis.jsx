import React from "react";

import "./CreateVis.css";

class CreateVis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dim: 5,
      size: 5,
      sV: "[0, 0, 0, 0, 0]",
      vLen: 0,
    };
  }

  static getDerivedStateFromProps(props) {
    const cS = props.saveDown;
    console.log("saveDown cS =", cS);
    const d = cS.dim;
    const s = cS.size;
    const sv = cS.sV;
    const vLen = cS.verts.length;
    return { dim: d, size: s, sV: sv, vLen: vLen };
  }

  render() {
    return (
      <div className="CreateVis">
        <p>
          Create State Visualizer: <br />
          Number of Tiles: {this.state.vLen}
        </p>
      </div>
    );
  }
}

export default CreateVis;
