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

  onBFS() {
    this.props.setBFS();
  }

  onDFS() {
    this.props.setDFS();
  }

  onK2() {
    this.props.setK2();
  }

  render() {
    return (
      <div className="w3-bar">
        <div className="w3-bar-item itemDiv">
          <Button
            name="singleDijSubmit"
            variant="contained"
            onClick={this.onSingleDij.bind(this)}
            size="large"
            startIcon={<PlayArrow />}
          >
            Modified Dijkstra
          </Button>{" "}
          <Button
            name="BFSSubmit"
            variant="contained"
            onClick={this.onBFS.bind(this)}
            size="large"
            startIcon={<PlayArrow />}
          >
            BFS
          </Button>{" "}
          <Button
            name="DFSSubmit"
            variant="contained"
            onClick={this.onDFS.bind(this)}
            size="large"
            startIcon={<PlayArrow />}
          >
            DFS
          </Button>{" "}
          <Button
            name="K2Submit"
            variant="contained"
            onClick={this.onK2.bind(this)}
            size="large"
            startIcon={<PlayArrow />}
          >
            K2 Search
          </Button>
        </div>
      </div>
    );
  }
}

export default PTSubmit;
