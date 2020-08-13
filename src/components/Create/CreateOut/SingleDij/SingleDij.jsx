import React from "react";

import axios from "axios";

import "./SingleDij.css";

class SingleDij extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxGen: 10,
      saveDown: {},
      canvasSize: {
        canvasWidth: window.innerWidth * 0.9,
        canvasHeight: window.innerWidth * 0.6,
      },
      center: {
        x: (window.innerWidth * 0.9) / 2,
        y: (window.innerWidth * 0.6) / 2,
      },
    };

    this.canvasPT = React.createRef();
    this.canvasSingleDij = React.createRef();

    this.startAnimation = this.startAnimation.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.genTilingNeighbourhoods = this.genTilingNeighbourhoods.bind(this);
    this.vertToStr = this.vertToStr.bind(this);
    this.genPhase = this.genPhase.bind(this);
    this.getPhase = this.getPhase.bind(this);
    this.genVDist = this.genVDist.bind(this);
    this.getDist = this.getDist.bind(this);
    this.getCenter = this.getCenter.bind(this);

    this.displayGrid = this.displayGrid.bind(this);
    this.displayInvalid = this.displayInvalid.bind(this);
    this.displayMinDist = this.displayMinDist.bind(this);
    this.displayN = this.displayN.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ saveDown: nextProps.saveDown }, () => {
      this.startAnimation();
    });
  }

  updateWindowDimensions() {
    if (
      this.canvasSingleDij === undefined ||
      this.canvasSingleDij === null ||
      this.canvasPT === undefined ||
      this.canvasPT === null
    ) {
      return;
    }
    this.clearCanvas(this.canvasPT);
    this.clearCanvas(this.canvasSingleDij);
    const canvasSize = {
      canvasWidth: window.innerWidth * 0.9,
      canvasHeight: window.innerWidth * 0.6,
    };
    const center = {
      x: (window.innerWidth * 0.9) / 2,
      y: (window.innerWidth * 0.6) / 2,
    };
    this.setState({ canvasSize: canvasSize, center: center });
  }

  clearCanvas(canvas) {
    const context = canvas.getContext("2d");
    context.clearRect(
      0,
      0,
      this.state.canvasSize.canvasWidth,
      this.state.canvasSize.canvasHeight
    );
  }

  componentDidMount() {
    const { canvasWidth, canvasHeight } = this.state.canvasSize;
    this.canvasPT.width = canvasWidth;
    this.canvasPT.height = canvasHeight;
    this.canvasSingleDij.width = canvasWidth;
    this.canvasSingleDij.height = canvasHeight;

    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  async startAnimation() {
    let tilingNeighbourhoodData = this.genTilingNeighbourhoods();
    let tIndToNeighbourhood = tilingNeighbourhoodData.tIndToNeighbourhood;
    let idTotInd = tilingNeighbourhoodData.idTotInd;

    const idToVal = this.state.saveDown.idToVal;
    let idToCol = this.state.saveDown.idToCol;

    console.log(idToVal);

    let source = this.state.saveDown.source;

    let vertToMinDist = {};
    vertToMinDist[source] = 0;
    let minDistsPrev = {};
    minDistsPrev[source] = "Source";

    let tiles = this.state.saveDown.tiles;

    let verts = [];

    let dim = this.state.saveDown.dim;
    let size = this.state.saveDown.size;

    for (let r = 0; r < dim - 1; r++) {
      for (let s = 0; s < dim - r - 1; s++) {
        for (let a = 0; a < 2 * size + 1; a++) {
          for (let b = 0; b < 2 * size + 1; b++) {
            if (dim % 2 === 0 && s === dim / 2 - 1) {
              continue;
            }
            const vert = tiles[r][s][a][b];
            const dist = this.genVDist(vert);
            const phase = this.genPhase(vert);
            const id = `${dist} ${phase}`;
            if (idToVal[id] !== -1) {
              verts.push(vert);
            }
          }
        }
      }
    }

    let unvisited = new Set(verts);

    let curTvert = source;

    let curGen = 0;

    this.displayGrid();
    this.displayInvalid(idTotInd);
    // this.displayMinDist(vertToMinDist);

    // LOOP
    // convert curTvert to id
    while (unvisited.size > 0 && curGen < this.state.maxGen) {
      unvisited.delete(curTvert);

      const dist = this.genVDist(curTvert);
      const phase = this.genPhase(curTvert);
      const curid = `${dist} ${phase}`;
      const curTind = idTotInd[curid];
      // resplit id with commas
      const curTflag = curTind.split(" ").join(",");
      // get curr neighbourhood with flag and iterate over it
      const curNeighbourhood = tIndToNeighbourhood[curTflag];
      const curNLen = curNeighbourhood.length;

      for (let nInd = 0; nInd < curNLen; nInd++) {
        const nTind = curNeighbourhood[nInd].map(Number);
        const curNVert = tiles[nTind[0]][nTind[2]][nTind[1]][nTind[3]];
        const curNdist = this.genVDist(curNVert);
        const curNphase = this.genPhase(curNVert);
        const idStr = `${curNdist} ${curNphase}`;
        // let id = idStr.split(" ");
        // id = id.map(Number);
        // let nvVert = tiles[id[0]][id[2]][id[1]][id[3]];
        // const newNdist = this.genVDist(nvVert);
        // const newNphase = this.genPhase(nvVert);
        // console.log(idToVal[`${newNdist} ${newNphase}`]);

        if (idToVal[idStr] === -1) {
          continue;
        }

        const curDist = vertToMinDist[curTvert] + 1;

        if (
          vertToMinDist[curNVert] === undefined ||
          curDist < vertToMinDist[curNVert]
        ) {
          vertToMinDist[curNVert] = curDist;
          minDistsPrev[curNVert] = curTind;
        }
      }

      await this.displayMinDist(vertToMinDist);

      let curMin = "hello";
      let curMinDist = Number.POSITIVE_INFINITY;
      for (const [vert, minDist] of Object.entries(vertToMinDist)) {
        let newVert = vert.split(",");
        newVert = newVert.map(Number);
        const finalVert = [
          [newVert[0], newVert[1]],
          [newVert[2], newVert[3]],
          [newVert[4], newVert[5]],
          [newVert[6], newVert[7]],
        ];
        const nvdist = this.genVDist(finalVert);
        const nvphase = this.genPhase(finalVert);
        const idStr = idTotInd[`${nvdist} ${nvphase}`];
        let id = idStr.split(" ");
        id = id.map(Number);
        let nvVert = tiles[id[0]][id[2]][id[1]][id[3]];
        if (minDist < curMinDist && unvisited.has(nvVert)) {
          curMinDist = minDist;
          curMin = nvVert;
        }
      }

      if (curMin === "hello") {
        // We have found a solution
        return;
      }

      curGen += 1;
      curTvert = curMin;
    }
  }

  async displayMinDist(vertToMinDist) {
    const minDistSet = new Set(Object.values(vertToMinDist));
    const minDists = Array.from(minDistSet);
    minDists.sort();
    const numCols = minDists.length;
    const colors = await this.asyncColorsReq(numCols, "chp");

    let minDistToCol = {};
    for (let c = 0; c < numCols; c++) {
      minDistToCol[minDists[c]] = colors[c];
    }

    for (const [vert, minDist] of Object.entries(vertToMinDist)) {
      let distCol = minDistToCol[minDist];
      distCol = this.rgbNorm(distCol);
      const v = vert.split(",").map(parseFloat);
      const newV = [
        [v[0], v[1]],
        [v[2], v[3]],
        [v[4], v[5]],
        [v[6], v[7]],
      ];
      this.drawTile(this.canvasSingleDij, newV, distCol);
    }
  }

  displayGrid() {
    let dim = this.state.saveDown.dim;
    let size = this.state.saveDown.size;
    let ttm = this.state.saveDown.ttm;
    let idToCol = this.state.saveDown.idToCol;
    let colors = this.state.saveDown.colors;
    let tiles = this.state.saveDown.tiles;
    for (let r = 0; r < dim - 1; r++) {
      for (let s = 0; s < dim - r - 1; s++) {
        // let col = colors[ttm[r][s]];
        // let filCol = this.hsv2rgb(col);
        let sCorrect = r + s + 1;
        let col = colors[ttm[r][sCorrect]];
        let filCol = this.rgbNorm(col);
        let strokeStyle = "rgb(0, 0, 0)";

        for (let a = 0; a < 2 * size + 1; a++) {
          for (let b = 0; b < 2 * size + 1; b++) {
            if (dim % 2 === 0 && s === dim / 2 - 1) {
              continue;
            }
            // Ppulate idToCol here
            let vert = tiles[r][s][a][b];
            const dist = this.genVDist(vert);
            const phase = this.genPhase(vert);
            idToCol[`${dist} ${phase}`] = filCol;

            // 0 -> normal // -1 -> invalid // val =>manualVal
            this.drawTile(this.canvasPT, vert, filCol);
          }
        }
      }
    }
  }

  displayInvalid(idTotInd) {
    let lITV = this.state.saveDown.idToVal;
    let idToCol = this.state.saveDown.idToCol;
    let tiles = this.state.saveDown.tiles;

    let lastKeys = Object.keys(lITV);
    // Draw paths
    for (let i = 0; i < lastKeys.length; i++) {
      let lID = lastKeys[i];
      if (lITV[lID] !== 0) {
        let dist = parseFloat(lID.substring(0, lID.indexOf(" ")));
        let phase = parseFloat(lID.substring(lID.indexOf(" ")));
        let id = `${dist} ${phase}`;
        let tIndStr = idTotInd[id];
        let tInd = tIndStr.split(" ");
        tInd = tInd.map(Number);
        let vert = tiles[tInd[0]][tInd[2]][tInd[1]][tInd[3]];
        let filCol = "rgb(0, 0, 0)";
        let strokeStyle = idToCol[lID];

        this.drawTile(this.canvasPT, vert, filCol, strokeStyle);
      }
    }
  }

  drawTile(
    canvasID,
    verts,
    filCol = `rgb(255, 255, 0)`,
    strokeStyle = this.state.saveDown.invalidColor
  ) {
    if (canvasID === null || canvasID === undefined) {
      return;
    }
    const ctx = canvasID.getContext("2d");
    ctx.strokeStyle = strokeStyle;
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
    ctx.fillStyle = filCol;
    ctx.fill();
    ctx.closePath();
  }

  rgbNorm(rgb) {
    if (rgb === undefined) {
      return "rgb(0, 0, 0)";
    }
    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];
    if (r <= 1 && g <= 1 && b <= 1) {
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
    }
    return `rgb(${r} ${g} ${b})`;
  }

  async asyncColorsReq(numCols, colorPalette) {
    numCols = parseInt(numCols);

    let colors = await axios
      .post("http://localhost:3000/backend/getColors", {
        params: {
          curCols: colorPalette,
          numCols: numCols,
        },
      })
      .then((response) => {
        // API output data
        this.setState({ colors: response.data.colors });
        return response.data.colors;
      })
      .catch((error) => {
        console.log(error);
      });
    return colors;
  }

  getCenter(vert) {
    // vert[0] is opposite to vert[2], meaning their diagonal (which bisects the diag of vert[1] & vert[3])
    // has centerpoint as shown bellow
    const x = (vert[0][0] + vert[2][0]) / 2;
    const y = (vert[0][1] + vert[2][1]) / 2;
    return {
      x: x,
      y: y,
    };
  }

  genPhase(vert) {
    const cord = this.getCenter(vert);
    const phase = this.getPhase(cord.x, cord.y);
    return phase;
  }

  getDist(x, y) {
    x = x - 0.0000000001;
    y = y - 0.0000000001;
    return Math.sqrt(x ** 2 + y ** 2);
  }

  getPhase(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  genVDist(vert) {
    let d0 = this.getDist(vert[0][0], vert[0][1]);
    let d1 = this.getDist(vert[1][0], vert[1][1]);
    let d2 = this.getDist(vert[2][0], vert[2][1]);
    let d3 = this.getDist(vert[3][0], vert[3][1]);

    let dc = (d0 + d1 + d2 + d3) / 4;
    return dc;
  }

  handleInputChange(event) {
    console.log(`${event.target.name} value changed to`, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  genTilingNeighbourhoods() {
    let tIndToNeighbourhood = {};
    let idTotInd = {};

    let dim = this.state.saveDown.dim;
    let size = this.state.saveDown.size;
    let vertToVertSet = {};

    for (let r = 0; r < dim - 1; r++) {
      for (let s = 0; s < dim - r - 1; s++) {
        for (let a = 0; a < 2 * size + 1; a++) {
          for (let b = 0; b < 2 * size + 1; b++) {
            if (dim % 2 === 0 && s === dim / 2 - 1) {
              continue;
            }
            // Populate idToCol here
            let verts = this.state.saveDown.tiles[r][s][a][b];
            const dist = this.genVDist(verts);
            const phase = this.genPhase(verts);
            const id = `${dist} ${phase}`;
            const indId = `${r} ${a} ${s} ${b}`;
            idTotInd[id] = indId;

            for (let i = 0; i < 4; i++) {
              const vert = verts[i];

              if (vertToVertSet[vert] !== undefined) {
                let vertSet = vertToVertSet[vert];
                vertSet.push(indId);
                vertToVertSet[vert] = vertSet;
              } else {
                let vertSet = [];
                vertSet.push(indId);
                vertToVertSet[vert] = vertSet;
              }
            }
          }
        }
      }
    }
    let listOfNeighbourhoodSets = Object.values(vertToVertSet);
    let listOfNeighbourhoodLists = [];

    const numSets = listOfNeighbourhoodSets.length;
    for (let i = 0; i < numSets; i++) {
      let neighbourhoodList = [];
      let neighbourhoodSet = listOfNeighbourhoodSets[i];
      const numNeighbours = neighbourhoodSet.length;
      for (let j = 0; j < numNeighbours; j++) {
        const neighbour = neighbourhoodSet[j];
        const tInd = neighbour.split(" ");
        neighbourhoodList.push(tInd);
      }
      listOfNeighbourhoodLists.push(neighbourhoodList);
    }
    let visited = new Set();
    let numLists = listOfNeighbourhoodLists.length;
    for (let i = 0; i < numLists; i++) {
      let neighbourhoodList = listOfNeighbourhoodLists[i];
      let neighbourhoodListCopy = [...neighbourhoodList];

      const numNeighbours = neighbourhoodList.length;
      for (let j = 0; j < numNeighbours; j++) {
        const tInd = neighbourhoodList[j];
        const indId = tInd.join(" ");

        if (visited.has(indId)) {
          let tnh = tIndToNeighbourhood[tInd];
          let tempNeighbourhood = [...neighbourhoodListCopy];
          let newTN = [];
          let tNLen = tempNeighbourhood.length;
          for (let k = 0; k < tNLen; k++) {
            let n = tempNeighbourhood[k];
            if (!tnh.includes(n) && n !== tInd) {
              newTN.push(n);
            }
          }
          tempNeighbourhood = newTN;
          tnh = tnh.concat(tempNeighbourhood);
          tIndToNeighbourhood[tInd] = tnh;
        } else {
          let neighbourhoodList = [];
          neighbourhoodList = [...neighbourhoodListCopy];
          let newTN = [];
          let tNLen = neighbourhoodList.length;
          for (let k = 0; k < tNLen; k++) {
            let n = neighbourhoodList[k];
            if (n !== tInd) {
              newTN.push(n);
            }
          }
          neighbourhoodList = newTN;
          tIndToNeighbourhood[tInd] = neighbourhoodList;
          visited.add(indId);
        }
      }
    }

    for (const [tInd, neighbourhood] of Object.entries(tIndToNeighbourhood)) {
      let newN = Array.from(new Set(neighbourhood));
      tIndToNeighbourhood[tInd] = newN;
    }

    this.setState({ tIndToNeighbourhood, idTotInd });
    return { tIndToNeighbourhood: tIndToNeighbourhood, idTotInd: idTotInd };
  }

  vertToStr(vert) {
    return `${vert[0]} ${vert[1]}`;
  }

  displayN(n) {
    const nLen = n.length;
    for (let nl = 0; nl < nLen; nl++) {
      const curN = n[nl];
      const nVert = this.state.idTotInd[curN];
      this.drawTile(
        this.canvasSingleDij,
        nVert,
        "rgb(255,255,255)",
        this.state.saveDown.invalidColor
      );
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="maxGen">Max Gen</label>
          <input
            name="maxGen"
            type="number"
            onChange={this.handleInputChange}
            placeholder={this.state.maxGen}
          />
          <button type="submit">Re-Animate</button>
        </form>

        <div className="canvasDiv">
          <canvas
            className="canvasDij"
            ref={(canvasPT) => (this.canvasPT = canvasPT)}
          />
          <canvas
            className="canvasDij"
            ref={(canvasSingleDij) => (this.canvasSingleDij = canvasSingleDij)}
          />
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "resize",
      this.updateWindowDimensions.bind(this)
    );
  }
}

export default SingleDij;
