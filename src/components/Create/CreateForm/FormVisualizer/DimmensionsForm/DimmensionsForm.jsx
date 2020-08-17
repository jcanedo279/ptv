import React from "react";

import {
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
} from "@material-ui/core";
import {
  Height,
  FormatLineSpacing,
  ZoomOutMap,
  BlurCircular,
  Functions,
  Publish,
} from "@material-ui/icons";

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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />

        <br />
        <form onSubmit={this.handleSubmit}>
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
          <hr />
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
          <hr />
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
          <hr />
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
          <hr />
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
        </form>
      </div>
    );
  }
}

export default DimmensionsForm;
