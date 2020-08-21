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
      source: "",
      target: "",
      kTSet: new Set(),
      verts: [],
      tile: {},
      idToVal: {},
      idToCol: {},
      cW: false,
      cl: false,
      aS: false,
      aT: false,
      kT: false,
      curOutMode: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps createSetup", nextProps);
    let dim = Number(nextProps.dim);
    let size = Number(nextProps.size);
    let sC = Number(nextProps.sC);
    let sM = nextProps.sM;
    let tileSize = nextProps.tileSize;
    let verts = nextProps.vertices;
    let tiles = nextProps.tiles;
    let colors = nextProps.colors;
    let ttm = nextProps.ttm;
    let source = nextProps.source;
    let target = nextProps.target;
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
      tileSize: tileSize,
      verts: verts,
      tiles: tiles,
      colors: colors,
      ttm: ttm,
      source: source,
      target: target,
    });
  }

  setCW(cW) {
    this.setState({ cW });
  }

  setCL() {
    this.setState({ cl: true });
    this.setState({ idToVal: {} });
  }

  setAS(aS) {
    this.setState({ aS });
  }

  setAT(aT) {
    this.setState({ aT });
  }

  setKT(kT) {
    this.setState({ kT });
  }

  resetCL() {
    this.setState({ cl: false });
  }

  setidToVal(idToVal) {
    this.setState({ idToVal });
    this.props.setidToVal(idToVal);
  }

  setidToCol(idToCol) {
    this.setState({ idToCol });
  }

  setSource(source) {
    this.setState({ source }, () => {
      this.props.setSourceTargetData(source, this.state.target);
    });
  }

  setTarget(target) {
    this.setState({ target }, () => {
      this.props.setSourceTargetData(this.state.source, target);
    });
  }

  setKTSet(kT) {
    this.setState({ kT }, () => {
      this.props.setkTSet(kT);
    });
  }

  setSingleDij() {
    // If the source and target are not set, we return to prevent singleDij without a source and target
    if (this.state.source === "" || this.state.target === "") {
      return;
    }
    // If the source and target are set, we clear here so we can remake it from somewhere else
    this.props.setSingleDij();
    this.setState({ curOutMode: "singleDij", source: "", target: "" }, () => {
      this.props.setSingleDij();
    });
  }

  setBFS() {
    // If the source and target are not set, we return to prevent BFS without a source and target
    if (this.state.source === "" || this.state.target === "") {
      return;
    }
    // If the source and target are set, we clear here so we can remake it from somewhere else
    this.props.setBFS();
    this.setState({ curOutMode: "BFS", source: "", target: "" }, () => {
      this.props.setBFS();
    });
  }

  setDFS() {
    // If the source and target are not set, we return to prevent DFS without a source and target
    if (this.state.source === "" || this.state.target === "") {
      return;
    }
    // If the source and target are set, we clear here so we can remake it from somewhere else
    this.props.setDFS();
    this.setState({ curOutMode: "DFS", source: "", target: "" }, () => {
      this.props.setDFS();
    });
  }

  setK2() {
    // If the source and target are not set, we return to prevent DFS without a source and target
    if (
      this.state.source === "" ||
      this.state.target === "" ||
      this.state.kTSet === new Set()
    ) {
      return;
    }
    // If the source and target are set, we clear here so we can remake it from somewhere else
    this.props.setK2();
    this.setState({ curOutMode: "K2", source: "", target: "" }, () => {
      this.props.setK2();
    });
  }

  setSourceTargetData(source, target) {
    this.props.setSourceTargetData(source, target);
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
          setKT={this.setKT.bind(this)}
        />

        <PTVis
          dim={this.state.dim}
          size={this.state.size}
          tileSize={this.state.tileSize}
          vertices={this.state.verts}
          tiles={this.state.tiles}
          colors={this.state.colors}
          ttm={this.state.ttm}
          cW={this.state.cW}
          aS={this.state.aS}
          aT={this.state.aT}
          kT={this.state.kT}
          cl={this.state.cl}
          idToVal={this.state.idToVal}
          idToCol={this.state.idToCol}
          source={this.state.source}
          target={this.state.target}
          kTSet={this.state.kTSet}
          //
          setidToVal={this.setidToVal.bind(this)}
          setidToCol={this.setidToCol.bind(this)}
          setSource={this.setSource.bind(this)}
          setTarget={this.setTarget.bind(this)}
          setKTSet={this.setKTSet.bind(this)}
          resetCL={this.resetCL.bind(this)}
        />

        <PTSubmit
          setSingleDij={this.setSingleDij.bind(this)}
          setBFS={this.setBFS.bind(this)}
          setDFS={this.setDFS.bind(this)}
          setK2={this.setK2.bind(this)}
        />
      </div>
    );
  }
}

export default CreateSetup;
