import React from "react";

import SingleDij from "./SingleDij/SingleDij";
import BFS from "./BFS/BFS";
import DFS from "./DFS/DFS";
import K2 from "./K2/K2";

class CreateOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curOutMode: "",
      saveDown: {},
    };
    this.noOut = this.noOut.bind(this);
    this.singleDij = this.singleDij.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps CreateOut ,", nextProps);
    this.setState({
      curOutMode: nextProps.saveDown.curOutMode,
      saveDown: nextProps.saveDown,
    });
  }

  noOut() {
    return (
      <div>
        <p>Create an animation above</p>
      </div>
    );
  }

  setSingleDijData(source, target) {
    this.setState({ source, target });
  }

  singleDij() {
    return (
      <SingleDij
        saveDown={this.state.saveDown}
        reAnimate={() => {
          this.setState({ curOutMode: "singleDij" });
        }}
      />
    );
  }

  BFS() {
    return (
      <BFS
        saveDown={this.state.saveDown}
        reAnimate={() => {
          this.setState({ curOutMode: "BFS" });
        }}
      />
    );
  }

  DFS() {
    return (
      <DFS
        saveDown={this.state.saveDown}
        reAnimate={() => {
          this.setState({ curOutMode: "DFS" });
        }}
      />
    );
  }

  K2() {
    return (
      <K2
        saveDown={this.state.saveDown}
        reAnimate={() => {
          this.setState({ curOutMode: "K2" });
        }}
      />
    );
  }

  render() {
    const acceptanceModes = new Set(["", " "]);
    if (acceptanceModes.has(this.state.curOutMode)) {
      return this.noOut();
    } else if (this.state.curOutMode === "singleDij") {
      return this.singleDij();
    } else if (this.state.curOutMode === "BFS") {
      return this.BFS();
    } else if (this.state.curOutMode === "DFS") {
      return this.DFS();
    } else if (this.state.curOutMode === "K2") {
      return this.K2();
    }
  }
}

export default CreateOut;
