import React from "react";

import "./PTAnim.css";

import axios from "axios";

const TILE_SIZE = 10;

export default class PTAnim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vertices: [],
      canvasSize: { canvasWidth: 800, canvasHeight: 600 },
      center: { x: 400, y: 300 },
    };

    this.drawTile.bind(this);
    this.sVPostReq.bind(this);
  }

  createPTData(dim, size, sC, sM, manualCols, numCols) {
    const sV = this.sVPostReq(dim, sC, sM);
    console.log("sV", sV);
    // var data = {};
    // for (let r = 0; r < dim - 1; r++) {
    //   for (let s = r + 1; s < dim; s++) {
    //     for (let a = -size; a < size + 1; a++) {
    //       for (let b = -size; b < size + 1; b++) {
    //         const tInd = (r, s, a, b);
    //         var val = [];
    //         data.push({ tInd: val });
    //       }
    //     }
    //   }
    // }
    // return data;
  }

  updatePTData(data) {
    return data;
  }

  componentWillReceiveProps(nextProps) {
    var dim = nextProps.dim;
    var size = nextProps.size;
    var sC = nextProps.sC;
    var sM = nextProps.sM;
    this.setState({ vertices: (verts = verts) });

    const context = this.canvasPT.getContext("2d");
    context.clearRect(
      0,
      0,
      this.state.canvasSize.canvasWidth,
      this.state.canvasSize.canvasHeight
    );

    for (let i = 0; i < verts.length; i++) {
      let vertexL = verts[i];
      this.drawTile(this.canvasPT, vertexL);
    }
  }

  componentDidMount() {
    const { canvasWidth, canvasHeight } = this.state.canvasSize;
    this.canvasPT.width = canvasWidth;
    this.canvasPT.height = canvasHeight;
    //const multigrid = getInitialGrid(this.state.dim, this.state.size, this.state.sV);
  }

  drawTile(canvasID, verts) {
    const ctx = canvasID.getContext("2d");
    ctx.strokeStyle = `rgb(0, 0, 0)`;
    ctx.beginPath();
    ctx.moveTo(
      verts[0][0] + this.state.center.x,
      verts[0][1] + this.state.center.y
    );

    ctx.lineTo(
      verts[1][0] + this.state.center.x,
      verts[1][1] + this.state.center.y
    );
    ctx.lineTo(
      verts[2][0] + this.state.center.x,
      verts[2][1] + this.state.center.y
    );
    ctx.lineTo(
      verts[3][0] + this.state.center.x,
      verts[3][1] + this.state.center.y
    );

    ctx.lineTo(
      verts[0][0] + this.state.center.x,
      verts[0][1] + this.state.center.y
    );
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  sVPostReq(d, sc, sm) {
    axios
      .post("http://localhost:3000/backend/getV", {
        params: {
          dim: d,
          sC: sc,
          sM: sm,
        },
      })
      .then((response) => {
        // API output data
        console.log("Post-Req response.data.sV =", response.data.sV);
        return response.data.sV;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    //const {dim, size, sV} = this.state;
    // const normVect = genNormVect(this.state.dim);
    // const multigrid = getInitialGrid(dim, size, sV);

    return (
      <>
        {/* <Form/> */}

        {/* <Form2/> */}

        <div className="PTAnim">
          <canvas ref={(canvasPT) => (this.canvasPT = canvasPT)} />
        </div>

        {/* <div className="multigrid">
                    {multigrid.map((tile, pIdx) => {
                        const {r, a, s, b, vertices, isFinish, isStart} = tile;
                        return (
                            <Tile
                                key={pIdx}
                                r={r}
                                s={s}
                                a={a}
                                b={b}
                                vertices={vertices}
                                isFinish={isFinish}
                                isStart={isStart}
                            ></Tile>
                        );
                    })}
                </div> */}
      </>
    );
  }
}
