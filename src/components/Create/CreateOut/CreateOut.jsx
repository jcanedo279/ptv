import React from "react";

import SingleDij from "./SingleDij/SingleDij";

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

  render() {
    if (this.state.curOutMode === "") {
      return this.noOut();
    } else if (this.state.curOutMode === "singleDij") {
      return this.singleDij();
    }
  }
}

export default CreateOut;
