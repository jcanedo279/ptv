import React from "react";

import {
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  Grid,
} from "@material-ui/core";
import {
  Height,
  FormatLineSpacing,
  ZoomOutMap,
  BlurCircular,
  Functions,
  Publish,
} from "@material-ui/icons";

import Info from "../../../../Reusables/Info/Info";

import "./DimmensionsForm.css";

class DimmensionsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dim: this.props.curState.dim,
      size: this.props.curState.size,
      sC: this.props.curState.sC,
      tileSize: this.props.curState.tileSize,
      sM: this.props.curState.sM,
      shiftMethods: [
        {
          value: "sH",
          label: "Shift By Halves",
        },
        {
          value: "sZ",
          label: "Shift By Zeroes",
        },
        {
          value: "sR",
          label: "Shift Randomly",
        },
      ],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    console.log(`${event.target.name} value changed to`, event.target.value);
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.saveStateUp(this.state);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("submitted form =", this.state);

    // // API request
    // // this.formGetReq(this.state)
    // this.formPostReq(this.state);
    // this.ttmReq(this.state.dim);
    // this.colorsReq(this.state.dim);

    // // PROPS call here
    // this.props.saveUp(this.state);
  }

  render() {
    return (
      <div className="DimmensionsForm">
        <br />
        <form onSubmit={this.handleSubmit}>
          {/* Dimmension */}
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item>
              <TextField
                id="id_dim"
                type="number"
                defaultValue={this.state.dim}
                name="dim"
                onChange={this.handleInputChange}
                label="Dimmension"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BlurCircular />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 3, step: 1 }}
              />
            </Grid>
            <Grid item>
              <Info
                popupText={
                  "The dimmension parameter determines the number of types of tiles. Odd tilings have (dim-1)/2 tile types while even tilings have (dim/2)-1 tile types."
                }
              />
            </Grid>
          </Grid>
          <br />
          <br />
          {/* Size */}
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item>
              <TextField
                id="id_size"
                type="number"
                defaultValue={this.state.size}
                name="size"
                onChange={this.handleInputChange}
                label="Size"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Height />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item>
              <Info
                popupText={
                  "The size parameter determines the number of times each tile type occurs. There are (dimmension choose 2)*(2*size+1)**2 tiles in the tiling."
                }
              />
            </Grid>
          </Grid>
          <br />
          <br />
          {/* Shift Constant */}
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item>
              <TextField
                id="id_sC"
                type="number"
                defaultValue={this.state.sC}
                name="sC"
                onChange={this.handleInputChange}
                label="Shift Constant"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FormatLineSpacing />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ step: 0.00000001 }}
              />
            </Grid>
            <Grid item>
              <Info
                popupText={
                  "The shift constant parameter is the value to which the summation of each dimmension's offset adds to. Each dimmension has 2*size+1 lines, where the center-most line is offset by some amount. The sum of that offset ammount is the shift constant. When the shift constant is zero, the tiling is the true Penrose tiling; when 0.5, the tiling function produces a generalized Penrose tiling."
                }
              />
            </Grid>
          </Grid>
          <br />
          <br />
          {/* Tile Size */}
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item>
              <TextField
                id="id_tileSize"
                type="number"
                defaultValue={this.state.tileSize}
                name="tileSize"
                onChange={this.handleInputChange}
                label="Tile Size"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ZoomOutMap />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item>
              <Info
                popupText={
                  "The tile size parameter determines the size of the unit length on the canvas. Since the tiling comprises entirely unit length - sided tiles, scaling the tile size up will uniformly scale up the entire tiling."
                }
              />
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item>
              <InputLabel htmlFor="id_sM">Shift Method</InputLabel>
              <Functions />{" "}
              <Select
                helpertext="Shift Method"
                id="id_sM"
                name="sM"
                defaultValue={this.state.sM}
                onChange={this.handleInputChange}
              >
                <MenuItem value="sH">Shift By Halves</MenuItem>
                <MenuItem value="sZ">Shift By Zeroes</MenuItem>
                <MenuItem value="sR">Shift Randomly</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              <Info
                popupText={
                  "The shift method parameter determines the function that distributes the shift constant over each dimmension's offset."
                }
              />
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default DimmensionsForm;
