import React from "react";

import CreateForm from "./CreateForm/CreateForm";

import CreateSetup from "./CreateSetup/CreateSetup";

import CreateOut from "./CreateOut/CreateOut";

import "./Create.css";

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dim: "",
      size: "",
      tileSize: 15,
      sC: "",
      sM: "",
      sV: "",
      source: "",
      target: "",
      kTSet: new Set(),
      idToVal: {},
      idToCol: {},
      verts: [],
      tile: {},
      curOutMode: "",
    };
  }

  setTS(tS) {
    this.setState({ tileSize: tS });
  }

  setidToVal(idToVal) {
    this.setState({ idToVal });
  }

  setSingleDij() {
    this.setState({ curOutMode: "singleDij" });
  }

  setBFS() {
    this.setState({ curOutMode: "BFS" });
  }

  setDFS() {
    this.setState({ curOutMode: "DFS" });
  }

  setK2() {
    this.setState({ curOutMode: "K2" });
  }

  clearCurOutMode() {
    this.setState({ curOutMode: " " });
  }

  setSourceTargetData(source, target) {
    this.setState({ source, target });
  }

  setkTSet(kTSet) {
    this.setState({ kTSet });
  }

  resetDijOut() {
    this.setState({ curOutMode: "", source: "", target: "" });
  }

  clearWalls() {
    this.setState({ idToVal: {} });
  }

  render() {
    return (
      <div className="Create" ref={(createDiv) => (this.createDiv = createDiv)}>
        <CreateForm
          setSingleDij={this.setSingleDij.bind(this)}
          clearCurOutMode={this.clearCurOutMode.bind(this)}
          clearWalls={this.clearWalls.bind(this)}
          resetDijOut={this.resetDijOut.bind(this)}
          tileSize={this.state.tileSize}
          saveUp={(s) => {
            this.setState(s);
          }}
          saveColors={(colors) => {
            this.setState({ colors });
          }}
          savettm={(ttm) => {
            this.setState({ ttm: ttm });
            this.render();
          }}
          saveVerts={(v) => {
            const keys = Object.keys(v);
            var verts = keys.map(function (key) {
              return v[key];
            });
            let dim = Number(this.state.dim);
            let size = Number(this.state.size); // This is a temporary fix, go back and figure out why this is a string
            let tiles = [];
            for (let r = 0; r < dim - 1; r++) {
              let rV = [];
              for (let s = r + 1; s < dim; s++) {
                let rsV = [];
                for (let a = -size; a < size + 1; a++) {
                  let rsaV = [];
                  for (let b = -size; b < size + 1; b++) {
                    let str = `${r} ${s} ${a} ${b}`;
                    let vert = v[str];
                    rsaV.push(vert);
                    // console.log("rsaV", rsaV);
                    // tiles[r][s][a][b] = vert;
                  }
                  rsV.push(rsaV);
                }
                rV.push(rsV);
              }
              tiles.push(rV);
            }
            this.setState({ verts: verts, tiles: tiles });
          }}
        />

        <br />
        <br />

        <CreateSetup
          dim={this.state.dim}
          size={this.state.size}
          sC={this.state.sC}
          sM={this.state.sM}
          tileSize={this.state.tileSize}
          vertices={this.state.verts}
          tiles={this.state.tiles}
          colors={this.state.colors}
          ttm={this.state.ttm}
          source={this.state.source}
          target={this.state.target}
          // Set click data
          setTS={this.setTS.bind(this)}
          setidToVal={this.setidToVal.bind(this)}
          setSourceTargetData={this.setSourceTargetData.bind(this)}
          setkTSet={this.setkTSet.bind(this)}
          // Search algorithms
          setSingleDij={this.setSingleDij.bind(this)}
          setBFS={this.setBFS.bind(this)}
          setDFS={this.setDFS.bind(this)}
          setK2={this.setK2.bind(this)}
        />

        <br />
        <br />

        <CreateOut
          saveDown={this.state}
          setSingleDij={this.setSingleDij.bind(this)}
        />
      </div>
    );
  }
}

export default Create;
