import React from "react";

class PTSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleDijSubmit: "",
    };
  }

  onSingleDijSubmit() {
    console.log("hellos");
  }

  render() {
    return (
      <div className="w3-bar">
        <div className="w3-bar-item itemDiv">
          {/* <input type="button" name="cl" onClick={this.onCL.bind(this)} /> */}
          <button
            ref={this.singleDijSubmit}
            name="singleDijSubmit"
            className="halfItem buttonFont w3-white w3-button w3-hover-grey"
            onClick={this.onSingleDijSubmit.bind(this)}
          >
            Single Dijsktra
          </button>
        </div>
      </div>
    );
  }
}

export default PTSubmit;
