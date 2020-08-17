import React from "react";

import { Button } from "@material-ui/core";

import { PlayArrow } from "@material-ui/icons";

class PTSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curOutMode: "",
    };
  }

  onSingleDij() {
    this.props.setSingleDij();
  }

  render() {
    return (
      <div className="w3-bar">
        <div className="w3-bar-item itemDiv">
          {/* <input type="button" name="cl" onClick={this.onCL.bind(this)} /> */}
          {/* <button
            ref={this.singleDijSubmit}
            name="singleDijSubmit"
            className="halfItem buttonFont w3-white w3-button w3-hover-grey"
            onClick={this.onSingleDij.bind(this)}
          >
            Single Dijsktra
          </button> */}

          <Button
            ref={this.singleDijSubmit}
            name="singleDijSubmit"
            variant="contained"
            onClick={this.onSingleDij.bind(this)}
            size="large"
            startIcon={<PlayArrow />}
          >
            Single Dijkstra
          </Button>
        </div>
      </div>
    );
  }
}

export default PTSubmit;
