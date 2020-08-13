import React from "react";

import "./DimmensionsForm.css";

class DimmensionsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dim: this.props.curState.dim,
      size: this.props.curState.size,
      sC: this.props.curState.sC,
      tileSize: this.props.curState.tileSize,
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
          <label htmlFor="dim">Dimmension</label>
          <br />
          <input
            type="number"
            placeholder={this.state.dim}
            name="dim"
            onChange={this.handleInputChange}
          />
          <hr />
          <label htmlFor="size">Size</label>
          <br />
          <input
            type="number"
            placeholder={this.state.size}
            name="size"
            onChange={this.handleInputChange}
          />
          <hr />
          <label htmlFor="sC">Shift Constant</label>
          <br />
          <input
            type="number"
            placeholder={this.state.sC}
            name="sC"
            step="0.00001"
            onChange={this.handleInputChange}
          />
          <hr />
          <label htmlFor="tileSize">Tile Size</label>
          <br />
          <input
            type="number"
            placeholder={this.state.tileSize}
            name="tileSize"
            step="0.00001"
            onChange={this.handleInputChange}
          />
          <hr />
          {/* sM selector */}
          <label htmlFor="sM">Shift Method</label>
          <br />
          <select name="sM" onChange={this.handleInputChange} defaultValue="sZ">
            <option value="sH">Shift By Halves</option>
            <option value="sZ">Shift By Zeroes</option>
            <option value="sR">Shift Randomly</option>
          </select>
          <br />
        </form>
      </div>
    );
  }
}

export default DimmensionsForm;
