import React from "react";

import axios from "axios";

import "./ColorsForm.css";

class ColorsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstMount: true,
      curCol: this.props.curState.curCol,
      tileOutlineColor: `rgb(${0}, ${0}, ${0})`,
      invalidColor: `rgb(${0}, ${0}, ${0})`,
      canvasSize: {
        canvasWidth: window.innerWidth * 0.75,
        canvasHeight: window.innerWidth * 0.3 * 0.75,
      },
      // center: {
      //   x: (window.innerWidth * 0.75) / 2,
      //   y: (window.innerWidth * 0.3 * 0.75) / 2,
      // },
      center: {
        x: 100,
        y: 15,
      },
      curState: this.props.curState,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleColChange = this.handleColChange.bind(this);
    this.handleTileCols = this.handleTileCols.bind(this);
  }

  handleInputChange(event) {
    console.log(`${event.target.name} value changed to`, event.target.value);
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.saveStateUp(this.state);
    });
  }

  handleColChange(event) {
    this.clearCanvas(this.canvasCol);
    this.drawCanvas(this.canvasCol);
    const newCol = event.target.value;
    this.setState(
      () => ({ curCol: newCol }),
      () => {
        this.props.saveStateUp(this.state);
        this.handleTileCols();
      }
    );
  }

  updateWindowDimensions() {
    if (this.canvasCol !== null) {
      this.clearCanvas(this.canvasCol);
    }
    const canvasSize = {
      canvasWidth: window.innerWidth * 0.75,
      canvasHeight: window.innerWidth * 0.3 * 0.75,
    };
    const center = {
      x: (window.innerWidth * 0.75) / 2,
      y: (window.innerWidth * 0.3 * 0.75) / 2,
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
    this.canvasCol.width = canvasWidth;
    this.canvasCol.height = canvasHeight;

    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    this.drawCanvas(this.canvasCol);

    this.ttmReq(this.state.curState.dim);
    this.colorsReq(this.state.curState.dim);
  }

  componentDidUpdate() {
    if (
      this.state.ttm !== undefined &&
      this.state.colors !== undefined &&
      this.state.firstMount
    ) {
      this.handleTileCols();
      this.setState({ firstMount: false });
    }
  }

  drawCanvas(
    canvasID,
    filCol = `rgb(255, 255, 255)`,
    strokeStyle = this.state.invalidColor
  ) {
    const ctx = canvasID.getContext("2d");
    ctx.strokeStyle = strokeStyle;
    console.log(this.state);
    ctx.beginPath();
    ctx.moveTo(0, 0);

    ctx.lineTo(this.state.canvasSize.canvasWidth, 0);
    ctx.lineTo(
      this.state.canvasSize.canvasWidth,
      this.state.canvasSize.canvasHeight
    );
    ctx.lineTo(0, this.state.canvasSize.canvasHeight);

    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fillStyle = filCol;
    ctx.fill();
    ctx.closePath();
  }

  async handleTileCols() {
    console.log("handleTileCols handled state =", this.state);

    // API request
    // this.formGetReq(this.state)
    const ttm = this.state.ttm;
    let colors = await this.asyncColorsReq(
      this.state.curState.dim,
      this.state.manualCols
    );
    console.log("handleTileCols colors ,", colors);
    console.log("handleTileCols manualCols ,", this.state.manualCols);

    let midInd = 0;
    if (this.state.curState.dim % 2 === 0) {
      midInd = this.state.curState.dim / 2 - 1;
    } else {
      midInd = (this.state.curState.dim - 1) / 2;
    }

    let rowInd = 0;
    let colInd = 0;
    let tilePtr = 0;

    const r = 0;
    for (let s = 1; s < midInd + 1; s++) {
      if (tilePtr % 30 === 0) {
        rowInd += 1;
        colInd = 0;
      }
      tilePtr += 1;
      colInd += 1;
      const offset = { x: 2 * colInd * 15, y: 2 * rowInd * 15 };
      // let col = colors[ttm[r][s]];
      // let filCol = this.hsv2rgb(col);
      let sCorrect = r + s;
      let col = colors[ttm[r][sCorrect]];
      let filCol = this.rgbNorm(col);

      const verts = await this.getTV(this.state.curState, r, s, 0, 0);

      if (typeof verts !== Array) {
        let x = (verts[0][0] + verts[2][0]) / 2;
        let y = (verts[0][1] + verts[2][1]) / 2;
        let center = { x, y };

        let dists = [
          parseFloat(this.euclid(verts[0], center)),
          parseFloat(this.euclid(verts[1], center)),
          parseFloat(this.euclid(verts[2], center)),
          parseFloat(this.euclid(verts[3], center)),
        ];

        let min = dists[0];
        let max = -1;

        for (let i = 1; i < 4; i++) {
          if (dists[i] < min) {
            min = dists[i];
          }
          if (dists[i] > max) {
            max = dists[i];
          }
        }
        let vert = [
          [offset.x, max + offset.y],
          [min + offset.x, offset.y],
          [offset.x, -max + offset.y],
          [-min + offset.x, offset.y],
        ];
        if (this.canvasCol === null) {
          return;
        }
        if (this.state.curCol === "None") {
          this.clearCanvas(this.canvasCol);
          this.drawCanvas(this.canvasCol);
          return;
        }
        console.log("canvasCol sdksljf ,", this.canvasCol);
        this.drawTile(this.canvasCol, vert, filCol, filCol);
      }
    }
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

  euclid(vert, center) {
    return Math.sqrt((vert[0] - center.x) ** 2 + (vert[1] - center.y) ** 2);
  }

  async getTV(cS, r, s, a, b) {
    let results = await axios
      .post("http://localhost:3000/backend/getTV", {
        params: {
          dim: cS.dim,
          size: cS.size,
          tileSize: cS.tileSize,
          r: r,
          s: s,
          a: a,
          b: b,
        },
      })
      .then(function (response) {
        // API output data
        // console.log("post vert ,", vert);
        // console.log("vert[0] ,", vert[0]);
        return response.data.vert;
      })
      .catch(function (error) {
        console.log(error);
      });
    return results;
  }

  colorsReq(dim) {
    dim = parseInt(dim);
    console.log("typeof dim ,", typeof dim);
    let numCols = 0;
    if (dim % 2 === 0) {
      numCols = dim / 2 - 1;
    } else {
      numCols = (dim - 1) / 2;
    }
    axios
      .post("http://localhost:3000/backend/getColors", {
        params: {
          manualCols: this.state.curState.manualCols,
          numCols: numCols,
        },
      })
      .then((response) => {
        // API output data
        console.log("Post-Req response.data.colors =", response.data.colors);
        this.setState({ colors: response.data.colors });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async asyncColorsReq(dim, manualCols = undefined) {
    dim = parseInt(dim);
    console.log("typeof dim ,", typeof dim);
    let numCols = 0;
    if (dim % 2 === 0) {
      numCols = dim / 2 - 1;
    } else {
      numCols = (dim - 1) / 2;
    }

    let colors = await axios
      .post("http://localhost:3000/backend/getColors", {
        params: {
          curCols: this.state.curCol,
          numCols: numCols,
        },
      })
      .then((response) => {
        // API output data
        console.log("Post-Req response.data.colors =", response.data.colors);
        this.setState({ colors: response.data.colors });
        return response.data.colors;
      })
      .catch((error) => {
        console.log(error);
      });
    return colors;
  }

  ttmReq(dim) {
    axios
      .post("http://localhost:3000/backend/getttm", {
        params: {
          dim: dim,
        },
      })
      .then((response) => {
        // API output data
        console.log("Post-Req response.data.ttm =", response.data.ttm);
        this.setState({ ttm: response.data.ttm });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="ColorsForms">
        <br />
        <select
          name="curCol"
          defaultValue={this.state.curState.curCol}
          onChange={this.handleColChange}
        >
          <option value="None">## NONE ##</option>
          <option value="mc">Manual Colors</option>
          <option value="None">## CH PALETTES ##</option>
          <option value="chp">CHP</option>
          <option value="chp_rnd4">CHP Palette r-.4</option>
          <option value="chp_s2d8_rd1">CHP s2.8 r.1</option>
          <option value="None">## MPL PALETTES ##</option>
          <option value="mplp_GnBu_d">MPLP GnBu</option>
          <option value="mplp_seismic">MPLP seismic</option>
          <option value="None">## CP MISCLELLANEOUS ##</option>
          <option value="cp">Color Palette (CP)</option>
          <option value="cp_Accent">CP Accent</option>
          <option value="cp_cubehelix">CP cubehelix</option>
          <option value="cp_flag">CP flag</option>
          <option value="cp_Paired">CP Paired</option>
          <option value="cp_Pastel1">CP Pastel1</option>
          <option value="cp_Pastel2">CP Pastel2</option>
          <option value="cp_tab10">CP tab10</option>
          <option value="cp_tab20">CP tab20</option>
          <option value="cp_tab20c">CP tab20c</option>
          <option value="None">## CP RAINBOW ##</option>
          <option value="cp_gistncar">CP gist_ncar</option>
          <option value="cp_gistrainbow">CP gist_rainbow</option>
          <option value="cp_hsv">CP hsv</option>
          <option value="cp_nipyspectral">CP nipy_spectral</option>
          <option value="cp_rainbow">CP rainbow</option>
          <option value="None">## CP 2 COLOR GRADIENTS ##</option>
          <option value="cp_afmhot">CP afmhot</option>
          <option value="cp_autumn">CP autumn</option>
          <option value="cp_binary">CP binary</option>
          <option value="cp_bone">CP bone</option>
          <option value="cp_cividis">CP cividis</option>
          <option value="cp_cool">CP cool</option>
          <option value="cp_copper">CP copper</option>
          <option value="cp_hot">CP hot</option>
          <option value="cp_inferno">CP inferno</option>
          <option value="cp_magma">CP magma</option>
          <option value="cp_mako">CP mako</option>
          <option value="cp_plasma">CP plasma</option>
          <option value="cp_PuBuGn">CP PuBuGn</option>
          <option value="cp_Purples">CP Purples</option>
          <option value="cp_RdPu">CP RdPu</option>
          <option value="cp_rocket">CP rocket</option>
          <option value="cp_spring">CP spring</option>
          <option value="cp_summer">CP summer</option>
          <option value="cp_viridis">CP viridis</option>
          <option value="cp_winter">CP winter</option>
          <option value="cp_Wistia">CP Wistia</option>
          <option value="cp_YlOrRd">CP YlOrRd</option>
          <option value="None">## CP 3 COLOR GRADIENTS ##</option>
          <option value="cp_BrBG">CP BrBG</option>
          <option value="cp_brg">CP brg</option>
          <option value="cp_bwr">CP bwr</option>
          <option value="cp_CMRmap">CP CMRmap</option>
          <option value="cp_gistearth">CP gistearth</option>
          <option value="cp_giststern">CP giststern</option>
          <option value="cp_gnuplot">CP gnuplot</option>
          <option value="cp_gnuplot2">CP gnuplot2</option>
          <option value="cp_icefire">CP icefire</option>
          <option value="cp_ocean">CP ocean</option>
          <option value="cp_PiYG">CP PiYG</option>
          <option value="cp_PRGn">CP PRGn</option>
          <option value="cp_prism">CP prism</option>
          <option value="cp_RdBu">CP RdBu</option>
          <option value="cp_RdGy">CP RdGy</option>
          <option value="cp_RdYlBu">CP RdYlBu</option>
          <option value="cp_RdYlGn">CP RdYlGn</option>
          <option value="cp_seismic">CP seismic</option>
          <option value="cp_Spectral">CP Spectral</option>
          <option value="cp_terrain">CP terrain</option>
          <option value="cp_vlag">CP vlag</option>
        </select>

        <br />

        <p>
          The following is a representation of each type of tile in the tyling
          and their colors. Although some tiles look repeated, lets note that
          two different types are isomorphic as their widths and heights are
          reversed
        </p>

        <canvas
          className="canvasCol"
          style={{ alignSelf: "center" }}
          ref={(canvasCol) => (this.canvasCol = canvasCol)}
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

export default ColorsForm;
