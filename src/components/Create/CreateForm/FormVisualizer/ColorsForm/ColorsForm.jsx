import React from "react";

import {
  Grid,
  MenuItem,
  Select,
  ListSubheader,
  InputLabel,
} from "@material-ui/core";

import Info from "../../../../Reusables/Info/Info";

import { Palette } from "@material-ui/icons";

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
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item>
            <InputLabel htmlFor="id_curCol">Tile Type Color Palette</InputLabel>
            <Palette />{" "}
            <Select
              helpertext="Color Palettes"
              id="id_curCol"
              name="curCol"
              defaultValue={this.state.curCol}
              onChange={this.handleColChange}
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
          </Grid>
          <Grid item>
            <Info
              popupText={`The following is a representation of each type of tile in the tiling
                  and their colors. Although some tiles look repeated, let us note that
                  two different tile types may be isomorphic as their widths and heights
                  are reversed!`}
            />
          </Grid>
        </Grid>

        <br />

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
