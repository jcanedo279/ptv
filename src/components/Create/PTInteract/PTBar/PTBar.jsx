import React from "react";

import "./PTBar.css";

class PTBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cW: false,
      cl: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const resetCL = nextProps.cl;
    this.setState({ cl: resetCL });
  }

  onCW() {
    this.setState({ cW: !this.state.cW });
    this.props.setCW(!this.state.cW);
  }
  onCL() {
    // When we pass the data into PTVis, we will have to call back up into PTBar to set cl to be false
    this.setState({ cl: true });
    this.props.setCL();
  }

  render() {
    return (
      <div className="PTBar">
        <ul className="ul">
          <li className="selectWall">
            <p>Click Walls</p>
            <input type="checkbox" name="cW" onChange={this.onCW.bind(this)} />
          </li>
          <li className="clear">
            <p>Clear</p>
            <input type="button" name="cl" onClick={this.onCL.bind(this)} />
          </li>
        </ul>
      </div>
    );
  }
}

export default PTBar;
