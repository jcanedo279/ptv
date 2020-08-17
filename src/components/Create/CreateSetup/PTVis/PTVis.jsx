import React from "react";

import "./PTVis.css";

export default class PTvis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileOutlineColor: `rgb(${0}, ${0}, ${0})`,
      invalidColor: `rgb(${0}, ${0}, ${0})`,
      sourceColor: `rgb(${255}, ${255}, ${255})`,
      targetColor: `rgb(${255}, ${255}, ${255})`,
      source: "",
      target: "",
      vertices: [],
      canvasSize: {
        canvasWidth: window.innerWidth * 0.94,
        canvasHeight: window.innerWidth * 0.6,
      },
      center: {
        x: (window.innerWidth * 0.94) / 2,
        y: (window.innerWidth * 0.6) / 2,
      },
      idToVal: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    let dim = Number(nextProps.dim);
    let size = Number(nextProps.size);
    let verts = nextProps.vertices;
    let tiles = nextProps.tiles;
    let tileSize = nextProps.tileSize;

    let colors = nextProps.colors;

    if (
      dim === undefined ||
      size === undefined ||
      verts === undefined ||
      tiles === undefined ||
      colors === undefined
    ) {
      return;
    }

    console.log("nextProps PTVis ,", nextProps);

    let ttm = nextProps.ttm;
    let cW = nextProps.cW;
    let cl = nextProps.cl;
    let aS = nextProps.aS;
    let aT = nextProps.aT;
    let lITV = nextProps.idToVal;

    let source = nextProps.source;
    let target = nextProps.target;

    if (cl) {
      lITV = {};
      this.setState({ idToVal: {}, curPath: new Set() });
      this.props.resetCL();
    }

    let idToCol = {};

    if (verts.length > 0) {
      // This clears both canvases in case of a moving canvas (by dragging)
      this.clearCanvas(this.canvasPT);
      this.clearCanvas(this.canvasUser);

      this.genData(verts);

      let cnt = 0;

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

              if (cnt === 0) {
                this.setState({ source: `${dist} ${phase}` });
              } else if (cnt === 1) {
                this.setState({ target: `${dist} ${phase}` });
              }

              cnt += 1;

              // 0 -> normal // -1 -> invalid // val =>manualVal
              this.drawTile(this.canvasPT, vert, filCol, strokeStyle);
            }
          }
        }
      }
    }

    if (nextProps.idToCol === {}) {
      nextProps.setidToCol(idToCol);
    }

    if (lITV !== {}) {
      let lastKeys = Object.keys(lITV);
      // Draw paths
      for (let i = 0; i < lastKeys.length; i++) {
        let lID = lastKeys[i];
        if (lITV[lID] !== 0) {
          let dist = parseFloat(lID.substring(0, lID.indexOf(" ")));
          let phase = parseFloat(lID.substring(lID.indexOf(" ")));
          let phaseRad = (phase * Math.PI) / 180;
          let x = dist * Math.cos(phaseRad);
          let y = dist * Math.sin(phaseRad);
          let cord = { x: x, y: y };
          let vert = this.binSearchVerts(cord);
          if (vert === undefined) continue;
          let filCol = "rgb(0, 0, 0)";
          let strokeStyle = idToCol[lID];

          this.drawTile(this.canvasUser, vert, filCol, strokeStyle);
        }
      }
    }
    if (source !== "") {
      this.drawTile(
        this.canvasUser,
        source,
        this.state.sourceColor,
        this.state.tileOutlineColor
      );
      this.drawText(this.canvasUser, "S", this.getCenter(source));
    }
    if (target !== "") {
      this.drawTile(
        this.canvasUser,
        target,
        this.state.targetColor,
        this.state.tileOutlineColor
      );
      this.drawText(this.canvasUser, "T", this.getCenter(target));
    }
    this.setState({
      vertices: verts,
      tiles: tiles,
      tileSize: tileSize,
      idToCol: idToCol,
      cW: cW,
      aS: aS,
      aT: aT,
      source: source,
      target: target,
    });
  }

  rgbNorm(rgb) {
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

  genData(verts) {
    let eDistD = {};
    let phaseD = {};
    for (let i = 0; i < verts.length; i++) {
      const vert = verts[i];
      const dist = this.genVDist(vert);
      const phase = this.genPhase(vert);
      // dist and phase become strings here
      eDistD[dist] = vert;
      phaseD[phase] = vert;
    }
    var eDistDKeys = Object.keys(eDistD).map(parseFloat);
    eDistDKeys.sort(function (a, b) {
      return a - b;
    });
    var phaseDKeys = Object.keys(phaseD).map(parseFloat);
    phaseDKeys.sort(function (a, b) {
      return a - b;
    });

    const tileData = {
      eDistD: eDistD,
      phaseD: phaseD,
      eDistDKeys: eDistDKeys,
      phaseDKeys: phaseDKeys,
    };
    this.setState({ tileData: tileData });
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

  genPhase(vert) {
    const cord = this.getCenter(vert);
    const phase = this.getPhase(cord.x, cord.y);
    return phase;
  }

  binSearchVerts(cord) {
    let dist = this.getDist(cord.x, cord.y);
    let phase = this.getPhase(cord.x, cord.y);

    let k = 1000;

    const closestDists = this.binKClosest(
      this.state.tileData.eDistDKeys,
      dist,
      k
    );

    let sortedByDist = [];

    const distsLen = closestDists.length;
    for (let i = 0; i < distsLen; i++) {
      // Here, the goal is to create sortedByDist in sorted order for the next method
      const dist = closestDists[i];
      sortedByDist.push(dist);
    }

    let sortedPhases = [];
    const sortedDistLen = sortedByDist.length;
    for (let i = 0; i < sortedDistLen; i++) {
      const dist = sortedByDist[i];
      const vert = this.state.tileData.eDistD[dist];
      const phase = this.genPhase(vert);
      sortedPhases.push(phase);
    }

    sortedPhases.sort(function (a, b) {
      return a - b;
    });

    // PRINT DIST CANDIDATES
    // console.log("sortedByDist Length :", sortedByDist.length);
    // for (let i = 0; i < sortedByDist.length; i++) {
    //   const vert = this.state.tileData.eDistD[sortedByDist[i]];
    //   this.drawTile(this.canvasUser, vert, `rgb(255, 0, 255)`);
    // }

    // PRINT PHASE CANDIDATES
    // for (let i = 0; i < sortedByPhase.length; i++) {
    //   const vert = this.state.tileData.phaseD[sortedByPhase[i]];
    //   this.drawTile(this.canvasUser, vert, `rgb(255, 0, 255)`);
    // }

    // console.log("sortedByDist :", sortedByDist);
    // console.log("sortedByPhase:", sortedByPhase);

    k = 100;

    let candidates = [];
    let candidatePhases = this.findKClosest(sortedPhases, phase, k);
    for (let i = 0; i < candidatePhases.length; i++) {
      let phase = candidatePhases[i];
      let vert = this.state.tileData.phaseD[phase];
      candidates.push(vert);
    }

    // for (let i = 0; i < candidates.length; i++) {
    //   const vert = candidates[i];
    //   this.drawTile(this.canvasUser, vert, `rgb(255, 0, 255)`);
    // }

    // PRINT ANSWER
    for (let i = 0; i < candidates.length; i++) {
      const vert = candidates[i];
      if (this.cordInVerts(cord, vert)) {
        return vert;
      }
    }

    // If we are here, we have not found the solution in the candidates because of the phase error
    // that ideally would be fixed, but lets just search the dists instead
    for (let i = 0; i < sortedByDist.length; i++) {
      const vert = this.state.tileData.eDistD[sortedByDist[i]];
      if (this.cordInVerts(cord, vert)) {
        return vert;
      }
    }
  }

  // Finds the closest k elements to target in dataSet
  binKClosest(dataSet, target, k) {
    const kClosest = this.findKClosest(dataSet, target, k);
    return kClosest;
  }

  findKClosest(arr, x, k) {
    let c = this.closest(arr, x);

    let closest = this.kClosest(arr, c, x, k);

    return closest;
  }

  closest(arr, x) {
    var mid;
    var lo = 0;
    var hi = arr.length - 1;
    while (hi - lo > 1) {
      mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < x) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (x - arr[lo] <= arr[hi] - x) {
      return lo;
    }
    return hi;
  }

  // kClosest takes in an array, a center index, a target value x which we are finding closest values to,
  // and a counting amount k
  kClosest(arr, c, x, k) {
    if (k === 0) {
      return [];
    }

    let closest = [arr[c]];
    let cnt = 0;

    let l = c - 1;
    let r = c + 1;
    while (cnt < k - 1) {
      if (l < 0 || r >= arr.length) {
        break;
      } else if (x - arr[l] < arr[r] - x) {
        closest.push(arr[l]);
        l--;
      } else {
        closest.push(arr[r]);
        r++;
      }
      cnt++;
    }
    return closest;
  }

  cordInVerts(cord, vert) {
    const val1 = this.inLineSegments(
      cord,
      vert[0][0],
      vert[0][1],
      vert[1][0],
      vert[1][1]
    );
    const val2 = this.inLineSegments(
      cord,
      vert[1][0],
      vert[1][1],
      vert[2][0],
      vert[2][1]
    );
    const val3 = this.inLineSegments(
      cord,
      vert[2][0],
      vert[2][1],
      vert[3][0],
      vert[3][1]
    );
    const val4 = this.inLineSegments(
      cord,
      vert[3][0],
      vert[3][1],
      vert[0][0],
      vert[0][1]
    );

    if (val1 === val2 && val2 === val3 && val3 === val4) {
      return true;
    } else {
      return false;
    }
  }

  inLineSegments(cord, vix, viy, vfx, vfy) {
    const val = (cord.x - vix) * (vfy - viy) - (vfx - vix) * (cord.y - viy);
    if (val >= 0) {
      return 1;
    } else {
      return -1;
    }
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
    this.canvasUser.width = canvasWidth;
    this.canvasUser.height = canvasHeight;

    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  drawText(canvasID, text, center) {
    const ctx = canvasID.getContext("2d");
    const fontSize = Math.max(2, this.state.tileSize - 5);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "black";
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
    strokeStyle = this.state.invalidColor
  ) {
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

  singleClick = (e) => {
    const cord = this.getMouseCordInCanvas(e);
    const clickVert = this.binSearchVerts(cord);
    let idToVal = this.state.idToVal;

    if (clickVert !== undefined) {
      const dist = this.genVDist(clickVert);
      const phase = this.genPhase(clickVert);
      const id = `${dist} ${phase}`;

      let path = new Set();
      path.add(id);
      const color = this.state.idToCol[id];

      if (this.state.idToVal[id] === -1) {
        // Unclick by drawing ttm colored tile and removing from clicked set
        this.drawTile(this.canvasUser, clickVert, color);
        delete idToVal[id];
      } else {
        // Click by drawing black tile and adding to clicked set
        this.drawTile(
          this.canvasUser,
          clickVert,
          this.state.invalidColor,
          color
        );
        idToVal[id] = -1;
      }
      this.setState({ idToVal, curPath: path });
    }
  };

  aSClick = (e) => {
    const cord = this.getMouseCordInCanvas(e);
    const clickVert = this.binSearchVerts(cord);

    if (clickVert !== undefined) {
      this.props.setSource(clickVert);
      const dist = this.genVDist(clickVert);
      const phase = this.genPhase(clickVert);
      const id = `${dist} ${phase}`;

      const originalColor = this.state.idToCol[id];

      if (id === this.state.source) {
        // Unclick by drawing ttm colored tile and removing from clicked set
        this.drawTile(this.canvasUser, clickVert, originalColor);
        this.setState({ source: "" });
        this.props.setSource("");
      } else {
        // Click by drawing black tile and adding to clicked set
        this.drawTile(
          this.canvasUser,
          clickVert,
          this.state.sourceColor,
          this.state.tileOutlineColor
        );
        this.setState({ source: clickVert });
      }
    }
  };

  aTClick = (e) => {
    const cord = this.getMouseCordInCanvas(e);
    const clickVert = this.binSearchVerts(cord);

    if (clickVert !== undefined) {
      this.props.setTarget(clickVert);
      const dist = this.genVDist(clickVert);
      const phase = this.genPhase(clickVert);
      const id = `${dist} ${phase}`;

      const originalColor = this.state.idToCol[id];

      if (id === this.state.target) {
        // Unclick by drawing ttm colored tile and removing from clicked set
        this.drawTile(this.canvasUser, clickVert, originalColor);
        this.setState({ target: "" });
        this.props.setTarget("");
      } else {
        // Click by drawing black tile and adding to clicked set
        this.drawTile(
          this.canvasUser,
          clickVert,
          this.state.targetColor,
          this.state.tileOutlineColor
        );
        this.setState({ target: clickVert });
      }
    }
  };

  dragClick = (e) => {
    const cord = this.getMouseCordInCanvas(e);
    const clickVert = this.binSearchVerts(cord);

    if (clickVert === undefined) {
      // This vertex takes too long to find, lets just ignore it
      return;
    }

    const dist = this.genVDist(clickVert);
    const phase = this.genPhase(clickVert);
    const id = `${dist} ${phase}`;

    // Current state
    let idToVal = this.state.idToVal;
    // Current Path
    let path = this.state.curPath;

    if (this.state.cW && !path.has(id)) {
      path.add(id);
      this.setState({ curPath: path });
      this.performStateSwitch(id, clickVert, idToVal);
      console.log("perform switch");
    }
  };

  dragCanvas = (e) => {
    const mouseUpCord = this.getMouseCordInCanvas(e);
    const deltaX = mouseUpCord.x - this.state.mouseDownCord.x;
    const deltaY = mouseUpCord.y - this.state.mouseDownCord.y;
    const newCenter = {
      x: this.state.center.x + deltaX,
      y: this.state.center.y + deltaY,
    };
    this.setCenter(newCenter);
  };

  performStateSwitch(id, clickVert, idToVal) {
    if (idToVal[id] === undefined || idToVal[id] === 0) {
      idToVal[id] = -1;
      this.drawTile(
        this.canvasUser,
        clickVert,
        this.state.invalidColor,
        this.state.idToCol[id]
      );
    } else {
      idToVal[id] = 0;
      this.drawTile(this.canvasUser, clickVert, this.state.idToCol[id]);
    }
    this.setState({ idToVal: idToVal });
  }

  onMouseMove = (e) => {
    if (this.state.tileData !== undefined) {
      if (this.state.mouseDown) {
        if (this.state.cW) {
          this.dragClick(e);
        } else {
          this.dragCanvas(e);
        }
      } else {
        // console.log("The moving mouse is up");
      }
    } else {
      console.log("Please Render A Tiling First mouseMove");
    }
  };

  onMouseDown = (e) => {
    if (this.state.tileData !== undefined) {
      if (!this.state.mouseDown) {
        this.setState({ curPath: new Set() });
        console.log("new path");
        this.setState({
          mouseDown: true,
          mouseDownCord: this.getMouseCordInCanvas(e),
        });
        if (this.state.aS) {
          this.aSClick(e);
        } else if (this.state.aT) {
          this.aTClick(e);
        } else if (this.state.cW) {
          this.singleClick(e);
        }
      }
    } else {
      console.log("Please Render A Tiling First mouseDown");
    }
  };

  onMouseUp = () => {
    if (this.state.tileData !== undefined) {
      this.setState({
        mouseDown: false,
      });
      this.props.setidToVal(this.state.idToVal);
    } else {
      console.log("Please Render A Tiling First mouseUp");
    }
  };

  setCenter = (center) => {
    this.setState({ center });
  };

  getMouseCordInCanvas = (e) => {
    const rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left - this.state.center.x; //x position within the element.
    var y = e.clientY - rect.top - this.state.center.y; //y position within the element.
    x = Number(x);
    y = Number(y);
    return { x: x, y: y };
  };

  updateWindowDimensions() {
    if (
      this.canvasUser === undefined ||
      this.canvasUser === null ||
      this.canvasPT === undefined ||
      this.canvasPT === null
    ) {
      return;
    }
    this.clearCanvas(this.canvasPT);
    this.clearCanvas(this.canvasUser);
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

  render() {
    return (
      <div className="PTVis" ref={(ptVisDiv) => (this.ptVisDiv = ptVisDiv)}>
        <canvas
          className="canvas"
          ref={(canvasPT) => (this.canvasPT = canvasPT)}
        />
        <canvas
          className="canvas"
          ref={(canvasUser) => (this.canvasUser = canvasUser)}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        />
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
