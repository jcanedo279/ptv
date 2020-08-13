import React from "react";

import "./PTBar.css";

class PTBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cW: false,
      cl: false,
      aS: false,
      aT: false,
    };

    this.cwRef = React.createRef();
    this.clRef = React.createRef();
    this.addSourceRef = React.createRef();
    this.addTargetRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    const resetCL = nextProps.cl;
    this.setState({ cl: resetCL });
  }

  onCW() {
    if (this.state.aS) {
      this.onAddSource();
    }
    if (this.state.aT) {
      this.onAddTarget();
    }
    if (this.state.cW === false) {
      this.cwRef.current.classList.remove("w3-white");
      this.cwRef.current.classList.add("w3-grey");
    }
    if (this.state.cW === true) {
      this.cwRef.current.classList.remove("w3-grey");
      this.cwRef.current.classList.add("w3-white");
    }
    this.setState({ cW: !this.state.cW });
    this.props.setCW(!this.state.cW);
  }
  onCL() {
    // When we pass the data into PTVis, we will have to call back up into PTBar to set cl to be false
    this.setState({ cl: true });
    this.props.setCL();
  }

  onAddSource() {
    if (this.state.cW) {
      this.onCW();
    }
    if (this.state.aT) {
      this.onAddTarget();
    }
    if (this.state.aS === false) {
      this.addSourceRef.current.classList.remove("w3-white");
      this.addSourceRef.current.classList.add("w3-grey");
    }
    if (this.state.aS === true) {
      this.addSourceRef.current.classList.remove("w3-grey");
      this.addSourceRef.current.classList.add("w3-white");
    }
    this.setState({ aS: !this.state.aS });
    this.props.setAS(!this.state.aS);
  }

  onAddTarget() {
    if (this.state.cW) {
      this.onCW();
    }
    if (this.state.aS) {
      this.onAddSource();
    }
    if (this.state.aT === false) {
      this.addTargetRef.current.classList.remove("w3-white");
      this.addTargetRef.current.classList.add("w3-grey");
    }
    if (this.state.aT === true) {
      this.addTargetRef.current.classList.remove("w3-grey");
      this.addTargetRef.current.classList.add("w3-white");
    }
    this.setState({ aT: !this.state.aT });
    this.props.setAT(!this.state.aT);
  }

  render() {
    return (
      <div className="w3-bar w3-container w3-teal">
        <div className="w3-bar-item itemDiv">
          {/* <p>Click Walls</p> */}
          {/* <input type="checkbox" name="cW" onChange={this.onCW.bind(this)} /> */}
          <button
            ref={this.cwRef}
            name="cW"
            className="item buttonFont w3-white w3-button w3-hover-grey"
            onClick={this.onCW.bind(this)}
          >
            Click Walls
          </button>
        </div>

        <div className="w3-bar-item itemDiv">
          {/* <input type="button" name="cl" onClick={this.onCL.bind(this)} /> */}
          <button
            ref={this.clRef}
            name="cl"
            className="item buttonFont w3-white w3-button w3-hover-grey"
            onClick={this.onCL.bind(this)}
          >
            Clear
          </button>
        </div>

        <div className="w3-bar-item itemDiv">
          {/* <input type="button" name="cl" onClick={this.onCL.bind(this)} /> */}
          <button
            ref={this.addSourceRef}
            name="addSource"
            className="halfItem buttonFont w3-white w3-button w3-hover-grey"
            onClick={this.onAddSource.bind(this)}
          >
            Add Source
          </button>
        </div>

        <div className="w3-bar-item itemDiv">
          {/* <input type="button" name="cl" onClick={this.onCL.bind(this)} /> */}
          <button
            ref={this.addTargetRef}
            name="addSource"
            className="halfItem buttonFont w3-white w3-button w3-hover-grey"
            onClick={this.onAddTarget.bind(this)}
          >
            Add Target
          </button>
        </div>
      </div>
    );
  }
}

export default PTBar;