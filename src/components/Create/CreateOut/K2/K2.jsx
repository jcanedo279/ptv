import React from "react";

import {
  TextField,
  Button,
  Select,
  MenuItem,
  ListSubheader,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@material-ui/core";
import { Palette, Replay, Stop } from "@material-ui/icons";

import InputSlider from "../../../Reusables/InputSlider/InputSlider";
import Typography from "@material-ui/core/Typography";

import axios from "axios";

import "./K2.css";

class K2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algMutexInUse: false,
      mouseDown: false,
      maxGen: 1,
      curCol: "mc",
      Astar: false,
      saveDown: {},
      canvasSize: {
        canvasWidth: window.innerWidth * 0.94,
        canvasHeight: window.innerWidth * 0.6,
      },
      center: {
        x: (window.innerWidth * 0.94) / 2,
        y: (window.innerWidth * 0.6) / 2,
      },
      scoring: {
        sourceBias: 1,
        targetBias: 1,
      },
    };

    this.canvasPT = React.createRef();
    this.canvasSingleDij = React.createRef();

    this.maxGenRef = React.createRef();

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
      canvasWidth: window.innerWidth * 0.94,
      canvasHeight: window.innerWidth * 0.6,
    };
    const center = {
      x: (window.innerWidth * 0.94) / 2,
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
    this.setState({ maxGen: this.state.maxGen, algMutexInUse: true });
    let tilingNeighbourhoodData = this.genTilingNeighbourhoods();
    let tIndToNeighbourhood = tilingNeighbourhoodData.tIndToNeighbourhood;
    let idTotInd = tilingNeighbourhoodData.idTotInd;

    const idToVal = this.state.saveDown.idToVal;

    let verts = [];

    let dim = this.state.saveDown.dim;
    let size = this.state.saveDown.size;
    let tiles = this.state.saveDown.tiles;
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

    let vertToMinDist = {};
    let minDistsPrev = {};

    let paths = new Set();

    let source = this.state.saveDown.source;
    let target = this.state.saveDown.target;
    let kTSet = this.state.saveDown.kTSet;

    let printPath = false;

    let mstPairs = this.genMstPairs(source, target, kTSet);
    console.log("mstPairs ,", mstPairs);
    for (let mstInd = 0; mstInd < mstPairs.length; mstInd++) {
      const curSourceTarget = mstPairs[mstInd];
      const curSource = curSourceTarget[0];
      const curTarget = curSourceTarget[1];

      vertToMinDist = {};
      vertToMinDist[curSource] = 0;
      minDistsPrev = {};
      minDistsPrev[curSource] = "Source";

      let unvisited = new Set(verts);

      let curTvert = curSource;

      let curGen = 0;

      printPath = false;

      this.clearCanvas(this.canvasSingleDij);
      this.displayGrid();
      this.displayInvalid(idTotInd);

      const kTArr = Array.from(kTSet);

      // LOOP
      while (unvisited.size > 0 && curGen < this.state.maxGen) {
        console.log(printPath);
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

          if (curNVert == curTarget) {
            printPath = true;
          }

          const curNdist = this.genVDist(curNVert);
          const curNphase = this.genPhase(curNVert);
          const idStr = `${curNdist} ${curNphase}`;

          if (idToVal[idStr] === -1) {
            continue;
          }

          const curDist = vertToMinDist[curTvert] + 1;

          if (
            vertToMinDist[curNVert] === undefined ||
            curDist < vertToMinDist[curNVert]
          ) {
            vertToMinDist[curNVert] = curDist;
            minDistsPrev[curNVert] = curTvert;
          }
        }

        await this.displayMinDist(vertToMinDist);
        if (printPath) {
          await this.findPath(minDistsPrev, curSource, curTarget, true);
        }

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

          if (this.state.Astar) {
            let targetBias = this.state.scoring.targetBias;
            let sourceBias = this.state.scoring.sourceBias;

            let nvCenter = this.getCenter(nvVert);
            let targetCenter = this.getCenter(curTarget);

            let interCenterDist = this.findInterCenterDist(
              nvCenter,
              targetCenter
            );

            let score = sourceBias * minDist + targetBias * interCenterDist;

            if (score < curMinDist && unvisited.has(nvVert)) {
              curMinDist = score;
              curMin = nvVert;
            }
          } else {
            if (minDist < curMinDist && unvisited.has(nvVert)) {
              curMinDist = minDist;
              curMin = nvVert;
            }
          }
        }

        if (curMin === "hello") {
          // The algorithm is stuck
          this.setState({ algMutexInUse: false });
          return;
        }
        // Display Current tile
        this.drawTile(
          this.canvasSingleDij,
          curTvert,
          "gold",
          this.state.invalidColor
        );
        // Display T/S targets
        this.drawTile(
          this.canvasSingleDij,
          this.state.saveDown.source,
          "gold",
          this.state.saveDown.invalidColor
        );
        this.drawTile(
          this.canvasSingleDij,
          this.state.saveDown.target,
          "gold",
          this.state.saveDown.invalidColor
        );
        this.drawText(
          this.canvasSingleDij,
          "S",
          this.getCenter(this.state.saveDown.source)
        );
        this.drawText(
          this.canvasSingleDij,
          "T",
          this.getCenter(this.state.saveDown.target)
        );
        // Display K targets
        for (let k = 0; k < kTArr.length; k++) {
          const tVert = kTArr[k];
          this.drawTile(
            this.canvasSingleDij,
            tVert,
            this.state.targetColor,
            this.state.tileOutlineColor
          );
          this.drawText(this.canvasSingleDij, "K", this.getCenter(tVert));
        }
        // Display current source and target
        this.drawTile(
          this.canvasSingleDij,
          curSource,
          "gold",
          this.state.saveDown.invalidColor
        );
        this.drawTile(
          this.canvasSingleDij,
          curTarget,
          "gold",
          this.state.saveDown.invalidColor
        );
        this.drawText(
          this.canvasSingleDij,
          "S",
          this.getCenter(curSource),
          "red"
        );
        this.drawText(
          this.canvasSingleDij,
          "T",
          this.getCenter(curTarget),
          "red"
        );
        // Display all found paths
        const pathsArray = Array.from(paths);
        for (let p = 0; p < pathsArray.length; p++) {
          const dispPath = pathsArray[p];
          this.displayPath(dispPath);
        }

        curGen += 1;
        curTvert = curMin;
      }

      if (printPath) {
        const curPath = await this.findPath(minDistsPrev, curSource, curTarget);
        paths.add(curPath);
      }

      // Display Current tile
      this.drawTile(
        this.canvasSingleDij,
        curTvert,
        "gold",
        this.state.invalidColor
      );
      // Display T/S targets
      this.drawTile(
        this.canvasSingleDij,
        this.state.saveDown.source,
        "gold",
        this.state.saveDown.invalidColor
      );
      this.drawTile(
        this.canvasSingleDij,
        this.state.saveDown.target,
        "gold",
        this.state.saveDown.invalidColor
      );
      this.drawText(
        this.canvasSingleDij,
        "S",
        this.getCenter(this.state.saveDown.source)
      );
      this.drawText(
        this.canvasSingleDij,
        "T",
        this.getCenter(this.state.saveDown.target)
      );
      // Display K targets
      for (let k = 0; k < kTArr.length; k++) {
        const tVert = kTArr[k];
        this.drawTile(
          this.canvasSingleDij,
          tVert,
          this.state.targetColor,
          this.state.tileOutlineColor
        );
        this.drawText(this.canvasSingleDij, "K", this.getCenter(tVert));
      }
      // Display current source and target
      this.drawTile(
        this.canvasSingleDij,
        curSource,
        "gold",
        this.state.saveDown.invalidColor
      );
      this.drawTile(
        this.canvasSingleDij,
        curTarget,
        "gold",
        this.state.saveDown.invalidColor
      );
      this.drawText(
        this.canvasSingleDij,
        "S",
        this.getCenter(curSource),
        "red"
      );
      this.drawText(
        this.canvasSingleDij,
        "T",
        this.getCenter(curTarget),
        "red"
      );
    }

    this.setState({ algMutexInUse: false });
  }

  async displayMinDist(vertToMinDist) {
    const minDistSet = new Set(Object.values(vertToMinDist));
    const minDists = Array.from(minDistSet);
    minDists.sort();
    const numCols = minDists.length;
    const colors = await this.asyncColorsReq(numCols, this.state.curCol);

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
      this.drawTile(this.canvasSingleDij, newV, distCol, distCol);
    }
  }

  genMstPairs(source, target, kTSet) {
    let targets = new Set();
    targets.add(source);
    targets.add(target);
    let kTArr = Array.from(kTSet);
    for (let i = 0; i < kTArr.length; i++) {
      targets.add(kTArr[i]);
    }

    let targetsList = Array.from(targets);

    let G = [];
    for (let gx = 0; gx < targetsList.length; gx++) {
      let curGRow = [];
      for (let gy = 0; gy < targetsList.length; gy++) {
        let c1 = this.getCenter(targetsList[gx]);
        let c2 = this.getCenter(targetsList[gy]);

        let dist = this.findInterCenterDist(c1, c2);

        curGRow.push(dist);
      }
      G.push(curGRow);
    }

    let mst = this.findMST(G);

    console.log("mst ,", mst);

    let orderedPairs = [];

    let mstArray = Array.from(mst);
    console.log("mstArray ,", mstArray);
    for (let ms = 0; ms < mstArray.length; ms++) {
      const mstEdge = mstArray[ms];
      orderedPairs.push([targetsList[mstEdge[0]], targetsList[mstEdge[1]]]);
    }
    return orderedPairs;
  }

  findMST(G) {
    const n = G.length;
    const m = n - 1;

    let priorityQueue = [];
    let mst = new Set();

    let numEdges = 0;
    let curVertex = 0;
    let visited = new Set();

    while (numEdges < m) {
      for (let i = 0; i < n; i++) {
        if (G[curVertex][i] != 0) {
          priorityQueue.push([curVertex, i, G[curVertex][i]]);
        }
      }

      const minE = this.minEdge(priorityQueue, visited);

      visited.add(`${minE[0]} ${minE[1]}`);
      mst.add(minE);
      numEdges += 1;

      var index = priorityQueue.indexOf(minE);
      priorityQueue.splice(index, 1);

      curVertex = minE[1];
    }
    return mst;
  }

  minEdge(priorityQueue, visited) {
    if (priorityQueue.length == 0) return null;
    let minVertex = priorityQueue[0];
    for (let cV = 1; cV < priorityQueue.length; cV++) {
      const curVertex = priorityQueue[cV];
      if (
        curVertex[2] < minVertex[2] &&
        !visited.has(`${curVertex[0]} ${curVertex[1]}`) &&
        !visited.has(`${curVertex[1]} ${curVertex[0]}`)
      ) {
        minVertex = curVertex;
      }
    }
    return minVertex;
  }

  // Find the distance between two centers
  findInterCenterDist(c1, c2) {
    return Math.sqrt((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2);
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
            this.drawTile(this.canvasPT, vert, filCol, filCol);
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
        // Very very hacky
        if (tIndStr === undefined) {
          continue;
        }
        let tInd = tIndStr.split(" ");
        tInd = tInd.map(Number);
        let vert = tiles[tInd[0]][tInd[2]][tInd[1]][tInd[3]];
        let filCol = "rgb(0, 0, 0)";
        let strokeStyle = idToCol[lID];

        this.drawTile(this.canvasPT, vert, filCol, strokeStyle);
      }
    }
  }

  async findPath(minDistPrev, curSource, curTarget, final = false) {
    let curT = curTarget;

    let path = [curT];
    while (curT !== curSource) {
      curT = minDistPrev[curT];
      path.push(curT);
    }
    await this.displayPath(path, final);
    return path;
  }

  async displayPath(path, final) {
    for (let p = 0; p < path.length; p++) {
      let canv = this.canvasPT;
      if (final) {
        canv = this.canvasSingleDij;
      }
      this.drawTile(canv, path[p], "gold", "gold");
    }
  }

  drawText(canvasID, text, center, fillStyle = "black") {
    if (canvasID === null || canvasID === undefined) {
      return;
    }
    const ctx = canvasID.getContext("2d");
    const fontSize = Math.max(2, this.state.saveDown.tileSize - 5);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = fillStyle;
    ctx.fillText(
      text,
      center.x + this.state.center.x - fontSize / 2 + 2,
      center.y + this.state.center.y + fontSize / 2 - 1
    );
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

  handleAstarClick() {
    console.log(`Astar value changed to`, !this.state.Astar);
    this.setState({ Astar: !this.state.Astar });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.algMutexInUse) {
      this.props.reAnimate();
    }
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

  dragCanvas = (e) => {
    const mouseUpCord = this.getMouseCordInCanvas(e);
    const deltaX = mouseUpCord.x - this.state.mouseDownCord.x;
    const deltaY = mouseUpCord.y - this.state.mouseDownCord.y;
    const newCenter = {
      x: this.state.center.x + deltaX,
      y: this.state.center.y + deltaY,
    };
    this.setState({ center: newCenter });
  };

  getMouseCordInCanvas = (e) => {
    const rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left - this.state.center.x; //x position within the element.
    var y = e.clientY - rect.top - this.state.center.y; //y position within the element.
    x = Number(x);
    y = Number(y);
    return { x: x, y: y };
  };

  onMouseMove = (e) => {
    if (this.state.mouseDown) {
      this.dragCanvas(e);
    } else {
      // console.log("The moving mouse is up");
    }
  };

  onMouseDown = (e) => {
    if (!this.state.mouseDown) {
      this.setState({ tempGen: this.state.maxGen, maxGen: 1 });
      this.setState({ curPath: new Set() });
      console.log("new path");
      this.setState({
        mouseDown: true,
        mouseDownCord: this.getMouseCordInCanvas(e),
      });
    }
  };

  onMouseUp = () => {
    this.setState(
      {
        mouseDown: false,
        maxGen: this.state.tempGen,
      },
      () => {
        this.clearCanvas(this.canvasSingleDij);
        this.clearCanvas(this.canvasPT);
        this.startAnimation();
      }
    );
  };

  render() {
    return (
      <div className="w3-container w3-teal">
        <form className="w3-white w3-margin" onSubmit={this.handleSubmit}>
          <br />
          <TextField
            inputRef={(ref) => {
              this.maxGenRef = ref;
            }}
            id="id_maxGen"
            type="number"
            defaultValue={this.state.maxGen}
            name="maxGen"
            onChange={this.handleInputChange}
            label="Max Generation"
            inputProps={{ min: 1 }}
          />
          <br />
          <br />
          <Palette />{" "}
          <Select
            helpertext="Color Palettes"
            id="id_curCol"
            name="curCol"
            defaultValue={this.state.curCol}
            onChange={this.handleInputChange}
          >
            <ListSubheader>Cube Helix Palettes</ListSubheader>
            <MenuItem value="chp">CHP</MenuItem>
            <MenuItem value="chp_rnd4">CHP Palette r-.4</MenuItem>
            <MenuItem value="chp_s2d8_rd1">CHP s2.8 r.1</MenuItem>
            <ListSubheader>MPL Palettes</ListSubheader>
            <MenuItem value="mplp_GnBu_d">MPLP GnBu</MenuItem>
            <MenuItem value="mplp_seismic">MPLP seismic</MenuItem>
            <ListSubheader>CP: Miscellaneous</ListSubheader>
            <MenuItem value="cp">Color Palette (CP)</MenuItem>
            <MenuItem value="cp_Accent">CP Accent</MenuItem>
            <MenuItem value="cp_cubehelix">CP cubehelix</MenuItem>
            <MenuItem value="cp_flag">CP flag</MenuItem>
            <MenuItem value="cp_Paired">CP Paired</MenuItem>
            <MenuItem value="cp_Pastel1">CP Pastel1</MenuItem>
            <MenuItem value="cp_Pastel2">CP Pastel2</MenuItem>
            <MenuItem value="cp_tab10">CP tab10</MenuItem>
            <MenuItem value="cp_tab20">CP tab20</MenuItem>
            <MenuItem value="cp_tab20c">CP tab20c</MenuItem>
            <ListSubheader>CP: Rainbow</ListSubheader>
            <MenuItem value="mc">Manual Colors</MenuItem>
            <MenuItem value="cp_gistncar">CP gist_ncar</MenuItem>
            <MenuItem value="cp_gistrainbow">CP gist_rainbow</MenuItem>
            <MenuItem value="cp_hsv">CP hsv</MenuItem>
            <MenuItem value="cp_nipyspectral">CP nipy_spectral</MenuItem>
            <MenuItem value="cp_rainbow">CP rainbow</MenuItem>
            <ListSubheader>CP: Gradient2</ListSubheader>
            <MenuItem value="cp_afmhot">CP afmhot</MenuItem>
            <MenuItem value="cp_autumn">CP autumn</MenuItem>
            <MenuItem value="cp_binary">CP binary</MenuItem>
            <MenuItem value="cp_bone">CP bone</MenuItem>
            <MenuItem value="cp_cividis">CP cividis</MenuItem>
            <MenuItem value="cp_cool">CP cool</MenuItem>
            <MenuItem value="cp_copper">CP copper</MenuItem>
            <MenuItem value="cp_hot">CP hot</MenuItem>
            <MenuItem value="cp_inferno">CP inferno</MenuItem>
            <MenuItem value="cp_magma">CP magma</MenuItem>
            <MenuItem value="cp_mako">CP mako</MenuItem>
            <MenuItem value="cp_plasma">CP plasma</MenuItem>
            <MenuItem value="cp_PuBuGn">CP PuBuGn</MenuItem>
            <MenuItem value="cp_Purples">CP Purples</MenuItem>
            <MenuItem value="cp_RdPu">CP RdPu</MenuItem>
            <MenuItem value="cp_rocket">CP rocket</MenuItem>
            <MenuItem value="cp_spring">CP spring</MenuItem>
            <MenuItem value="cp_summer">CP summer</MenuItem>
            <MenuItem value="cp_viridis">CP viridis</MenuItem>
            <MenuItem value="cp_winter">CP winter</MenuItem>
            <MenuItem value="cp_Wistia">CP Wistia</MenuItem>
            <MenuItem value="cp_YlOrRd">CP YlOrRd</MenuItem>
            <ListSubheader>CP: Gradient3</ListSubheader>
            <MenuItem value="cp_BrBG">CP BrBG</MenuItem>
            <MenuItem value="cp_brg">CP brg</MenuItem>
            <MenuItem value="cp_bwr">CP bwr</MenuItem>
            <MenuItem value="cp_CMRmap">CP CMRmap</MenuItem>
            <MenuItem value="cp_gistearth">CP gist_earth</MenuItem>
            <MenuItem value="cp_giststern">CP gist_stern</MenuItem>
            <MenuItem value="cp_gnuplot">CP gnuplot</MenuItem>
            <MenuItem value="cp_gnuplot2">CP gnuplot2</MenuItem>
            <MenuItem value="cp_icefire">CP icefire</MenuItem>
            <MenuItem value="cp_ocean">CP ocean</MenuItem>
            <MenuItem value="cp_PiYG">CP PiYG</MenuItem>
            <MenuItem value="cp_PRGn">CP PRGn</MenuItem>
            <MenuItem value="cp_prism">CP prism</MenuItem>
            <MenuItem value="cp_RdBu">CP RdBu</MenuItem>
            <MenuItem value="cp_RdGy">CP RdGy</MenuItem>
            <MenuItem value="cp_RdYlBu">CP RdYlBu</MenuItem>
            <MenuItem value="cp_RdYlGn">CP RdYlGn</MenuItem>
            <MenuItem value="cp_seismic">CP seismic</MenuItem>
            <MenuItem value="cp_Spectral">CP Spectral</MenuItem>
            <MenuItem value="cp_terrain">CP terrain</MenuItem>
            <MenuItem value="cp_vlag">CP vlag</MenuItem>
          </Select>
          <br />
          <br />
          <FormControlLabel
            value="Astar"
            control={<Checkbox color="primary" />}
            label="A* Approximation"
            labelPlacement="start"
            onClick={this.handleAstarClick.bind(this)}
          />
          <br />
          <div style={{ position: "relative", alignContent: "center" }}>
            <Grid
              style={{ marginLeft: "200px" }}
              container
              spacing={2}
              alignItems="center"
            >
              <Typography id="id_sourceSlider" gutterBottom>
                Source Bias
              </Typography>
              <br />
              <Grid item xs>
                <InputSlider
                  id="id_sourceSlider"
                  saveBiasUp={(sourceBias) => {
                    this.setState({
                      scoring: {
                        sourceBias: sourceBias,
                        targetBias: this.state.scoring.targetBias,
                      },
                    });
                  }}
                />
              </Grid>
              {/*  */}
              <br />
              {/*  */}
              <Typography id="id_targetSlider" gutterBottom>
                Target Bias
              </Typography>
              <br />
              <Grid item xs>
                <InputSlider
                  id="id_targetSlider"
                  saveBiasUp={(targetBias) => {
                    this.setState({
                      scoring: {
                        sourceBias: this.state.scoring.sourceBias,
                        targetBias: targetBias,
                      },
                    });
                  }}
                />
              </Grid>
            </Grid>
          </div>
          <br />
          <Button variant="contained" type="submit" startIcon={<Replay />}>
            Re-Animate
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              this.maxGenRef.valueAsNumber = 1;
              this.setState({ maxGen: 1 });
            }}
            startIcon={<Stop />}
          >
            Stop
          </Button>
          <br />
          <br />
        </form>

        <div className="canvasDiv">
          <canvas
            className="canvasDij"
            ref={(canvasPT) => (this.canvasPT = canvasPT)}
            onMouseMove={this.onMouseMove}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
          />
          <canvas
            className="canvasDij"
            ref={(canvasSingleDij) => (this.canvasSingleDij = canvasSingleDij)}
            onMouseMove={this.onMouseMove}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
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

export default K2;
