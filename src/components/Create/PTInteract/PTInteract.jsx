import React from "react";

import PTBar from "./PTBar/PTBar";
import PTVis from "./PTVis/PTVis";

import "./PTInteract.css";

class PTInteract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dim: "",
      size: "",
      sC: "",
      sM: "",
      sV: "",
      verts: [],
      tile: {},
      cW: false,
      cl: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
    let dim = Number(nextProps.dim);
    let size = Number(nextProps.size);
    let sC = Number(nextProps.sC);
    let sM = nextProps.sM;
    let verts = nextProps.vertices;
    let tiles = nextProps.tiles;
    let colors = nextProps.colors;
    let ttm = nextProps.ttm;
    if (
      dim === undefined ||
      verts === undefined ||
      tiles === undefined ||
      colors === undefined
    ) {
      return;
    }

    this.setState({
      dim: dim,
      size: size,
      sC: sC,
      sM: sM,
      verts: verts,
      tiles: tiles,
      colors: colors,
      ttm: ttm,
    });
  }

  setCW(cW) {
    this.setState({ cW });
  }

  setCL() {
    this.setState({ cl: true });
    this.setState({ iTV: {} });
  }

  resetCL() {
    this.setState({ cl: false });
  }

  setITV(iTV) {
    this.setState({ iTV });
  }

  render() {
    return (
      <div>
        <PTBar
          cl={this.state.cl}
          setCW={this.setCW.bind(this)}
          setCL={this.setCL.bind(this)}
        />

        <PTVis
          dim={this.state.dim}
          size={this.state.size}
          vertices={this.state.verts}
          tiles={this.state.tiles}
          colors={this.state.colors}
          ttm={this.state.ttm}
          cW={this.state.cW}
          cl={this.state.cl}
          idToVal={this.state.iTV}
          //
          setITV={this.setITV.bind(this)}
          resetCL={this.resetCL.bind(this)}
        />
      </div>
    );
  }
}

export default PTInteract;
