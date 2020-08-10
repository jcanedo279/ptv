import React from "react";

import SingleDij from "./SingleDij/SingleDij";

class CreateOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curOutMode: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ saveDown: nextProps.saveDown });
  }

  noOut() {
    return (
      <div>
        <p>Cur Out Mode {this.state.saveDown.curOutMode}</p>
      </div>
    );
  }

  singleDij() {
    return <SingleDij />;
  }

  render() {
    return (
      <div>
        <p>Cur Out Mode {this.state.saveDown.curOutMode}</p>
      </div>
    );
  }
}

export default CreateOut;
