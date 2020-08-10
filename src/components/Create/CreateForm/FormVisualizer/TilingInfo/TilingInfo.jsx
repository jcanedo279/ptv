import React from "react";

class TilingInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curState: this.props.curState,
    };
    this.sFact = this.sFact.bind(this);
  }

  componentDidMount() {
    const cS = this.state.curState;
    const dim = cS.dim;
    const size = cS.size;

    const numTiles =
      (this.sFact(dim) / (2 * this.sFact(dim - 2))) * (2 * size + 1) ** 2;
    console.log("fNum ,", this.sFact(dim) / (2 * this.sFact(dim - 2)));
    console.log("saveDown cS =", cS);
    this.setState(cS);
    this.setState({ numTiles });
  }

  sFact(num) {
    var rval = 1;
    for (var i = 2; i <= num; i++) rval = rval * i;
    return rval;
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps ,", nextProps);
  }

  render() {
    return (
      <div className="CreateData w3-container">
        <br />
        <div>
          <p>Tiling Dimmension Statistics</p>
          Dim: {this.state.dim}
          <br />
          Size: {this.state.size}
          <br />
          Shift Consontant: {this.state.sC}
          <br />
          Shift Method: {this.state.sM}
          <br />
          Tile Size: {this.state.tileSize}
          <hr />
          <p>Tiling Color Statistics</p>
          Current Color: {this.state.curCol}
          <hr />
          <p>Tiling Statistics</p>
          Number of Tiles: {this.state.numTiles}
        </div>
      </div>
    );
  }
}

export default TilingInfo;
