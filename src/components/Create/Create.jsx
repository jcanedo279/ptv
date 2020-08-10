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
      verts: [],
      tile: {},
      curOutMode: "singleDij",
    };
  }

  setTS(tS) {
    this.setState({ tileSize: tS });
  }

  setSingleDij() {
    this.setState({ curOutMode: "singleDij" });
  }

  render() {
    console.log(this.state.tileSize);
    return (
      <div className="Create" ref={(createDiv) => (this.createDiv = createDiv)}>
        <CreateForm
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
            {
              console.log("tiles *", tiles);
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
          vertices={this.state.verts}
          tiles={this.state.tiles}
          colors={this.state.colors}
          ttm={this.state.ttm}
          setTS={this.setTS.bind(this)}
          setSingleDij={this.setSingleDij.bind(this)}
        />

        <br />
        <br />

        <CreateOut saveDown={this.state} />
      </div>
    );
  }
}

export default Create;
