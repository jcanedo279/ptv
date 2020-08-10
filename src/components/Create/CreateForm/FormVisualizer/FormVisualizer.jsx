import React from "react";

import "./FormVisualizer.css";
import DimmensionsForm from "./DimmensionsForm/DimmensionsForm";
import ColorsForm from "./ColorsForm/ColorsForm";
import ColorPalettes from "./ColorPalettes/ColorPalettes";
import TilingInfo from "./TilingInfo/TilingInfo";

class FormVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curNav: "f1",
      // Form Values
      dim: 5,
      size: 5,
      tileSize: 15,
      sC: 0.0001,
      sV: "",
      sM: "sZ",
      curCol: this.props.curState.curCol,
    };

    this.saveStateUp = this.saveStateUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const curNav = nextProps.curNav;
    this.setState({ curNav });
  }

  saveStateUp(state) {
    this.setState(state, () => {
      this.props.saveStateUp(this.state);
    });
  }

  render() {
    if (this.state.curNav === "f1") {
      return (
        <DimmensionsForm curState={this.state} saveStateUp={this.saveStateUp} />
      );
    }
    if (this.state.curNav === "f2") {
      return (
        <ColorsForm curState={this.state} saveStateUp={this.saveStateUp} />
      );
    }
    if (this.state.curNav === "f3") {
      return <ColorPalettes saveStateUp={this.saveStateUp} />;
    }
    if (this.state.curNav === "f4") {
      return <TilingInfo curState={this.state} />;
    }
  }
}

export default FormVisualizer;
