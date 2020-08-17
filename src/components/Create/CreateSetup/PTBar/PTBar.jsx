import React from "react";

import { Button } from "@material-ui/core";
import { Layers, Flag, LayersClear, TripOrigin } from "@material-ui/icons";

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
        <br />
        <div className="w3-bar-item itemDiv">
          <Button
            ref={this.cwRef}
            name="cW"
            variant="contained"
            onClick={this.onCW.bind(this)}
            size="large"
            startIcon={<Layers />}
          >
            Click Walls
          </Button>
        </div>

        <div className="w3-bar-item itemDiv">
          <Button
            ref={this.clRef}
            name="cl"
            variant="contained"
            onClick={this.onCL.bind(this)}
            size="large"
            startIcon={<LayersClear />}
          >
            Clear Walls
          </Button>
        </div>

        <div className="w3-bar-item itemDiv">
          <Button
            ref={this.addSourceRef}
            name="addSource"
            variant="contained"
            onClick={this.onAddSource.bind(this)}
            size="large"
            startIcon={<TripOrigin />}
          >
            Add Source
          </Button>
        </div>

        <div className="w3-bar-item itemDiv">
          <Button
            ref={this.addTargetRef}
            name="addTarget"
            variant="contained"
            onClick={this.onAddTarget.bind(this)}
            size="large"
            startIcon={<Flag />}
          >
            Add Target
          </Button>
        </div>
      </div>
    );
  }
}

export default PTBar;
