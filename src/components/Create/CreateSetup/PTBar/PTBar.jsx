import React from "react";

import { Button, ButtonGroup } from "@material-ui/core";
import {
  Layers,
  Flag,
  LayersClear,
  TripOrigin,
  ScatterPlot,
} from "@material-ui/icons";

import "./PTBar.css";

class PTBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cW: false,
      cl: false,
      aS: false,
      aT: false,
      kT: false,
    };

    this.cwRef = React.createRef();
    this.clRef = React.createRef();
    this.addSourceRef = React.createRef();
    this.addTargetRef = React.createRef();
    this.addKTRef = React.createRef();
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
    if (this.state.kT) {
      this.onAddKT();
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
    if (this.state.kT) {
      this.onAddKT();
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
    if (this.state.kT) {
      this.onAddKT();
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

  onAddKT() {
    if (this.state.cW) {
      this.onCW();
    }
    if (this.state.aS) {
      this.onAddSource();
    }
    if (this.state.aT) {
      this.onAddTarget();
    }
    if (this.state.kT === false) {
      this.addKTRef.current.classList.remove("w3-white");
      this.addKTRef.current.classList.add("w3-grey");
    }
    if (this.state.kT === true) {
      this.addKTRef.current.classList.remove("w3-grey");
      this.addKTRef.current.classList.add("w3-white");
    }
    this.setState({ kT: !this.state.kT });
    this.props.setKT(!this.state.kT);
  }

  render() {
    return (
      <div className="w3-bar w3-container w3-teal">
        <br />
        <ButtonGroup>
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

          <Button
            ref={this.addKTRef}
            name="addKT"
            variant="contained"
            onClick={this.onAddKT.bind(this)}
            size="large"
            startIcon={<ScatterPlot />}
          >
            Add K Targets
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default PTBar;
