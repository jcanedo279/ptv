import React from "react";

class CreateNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curNav: "f1",
    };
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  // f1: physical dimmensions form
  // f2: color scheme form

  handleFormChange(event) {
    const eventName = event.target.name;
    this.props.saveUp({ curNav: eventName });
    this.setState({ curNav: eventName });
  }

  render() {
    return (
      <div>
        <div className="w3-bar w3-black">
          <button
            name="f1"
            className="w3-bar-item w3-button"
            onClick={this.handleFormChange}
          >
            Physical Dimmensions
          </button>
          <button
            name="f2"
            className="w3-bar-item w3-button"
            onClick={this.handleFormChange}
          >
            Color Parameters
          </button>
          <button
            name="f3"
            className="w3-bar-item w3-button"
            onClick={this.handleFormChange}
          >
            Color Palettes
          </button>
          <button
            name="f4"
            className="w3-bar-item w3-button"
            onClick={this.handleFormChange}
          >
            Tiling Info
          </button>
        </div>
      </div>
    );
  }
}

export default CreateNav;
