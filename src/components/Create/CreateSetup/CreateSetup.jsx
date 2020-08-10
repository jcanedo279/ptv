import React from "react";

import PTBar from "./PTBar/PTBar";
import PTVis from "./PTVis/PTVis";
import PTSubmit from "./PTSubmit/PTSubmit";

import "./CreateSetup.css";

class CreateSetup extends React.Component {
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
      iTV: {},
      cW: false,
      cl: false,
      aS: false,
      aT: false,
      source: "",
      target: "",
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

  setAS(aS) {
    this.setState({ aS });
  }

  setAT(aT) {
    this.setState({ aT });
  }

  resetCL() {
    this.setState({ cl: false });
  }

  setITV(iTV) {
    this.setState({ iTV });
  }

  setSource(source) {
    this.setState({ source });
  }

  setTarget(target) {
    this.setState({ target });
  }

  setSingleDij() {
    this.props.setSingleDij();
  }

  render() {
    return (
      <div className="CreateSetup w3-teal">
        <PTBar
          cl={this.state.cl}
          setCW={this.setCW.bind(this)}
          setCL={this.setCL.bind(this)}
          setAS={this.setAS.bind(this)}
          setAT={this.setAT.bind(this)}
        />

        <PTVis
          dim={this.state.dim}
          size={this.state.size}
          vertices={this.state.verts}
          tiles={this.state.tiles}
          colors={this.state.colors}
          ttm={this.state.ttm}
          cW={this.state.cW}
          aS={this.state.aS}
          aT={this.state.aT}
          cl={this.state.cl}
          idToVal={this.state.iTV}
          source={this.state.source}
          target={this.state.target}
          //
          setITV={this.setITV.bind(this)}
          setSource={this.setSource.bind(this)}
          setTarget={this.setTarget.bind(this)}
          resetCL={this.resetCL.bind(this)}
        />

        <PTSubmit setSingleDij={this.setSingleDij.bind(this)} />
      </div>
    );
  }
}

export default CreateSetup;
