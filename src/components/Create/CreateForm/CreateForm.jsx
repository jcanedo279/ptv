import React from "react";

import "./CreateForm.css";

import axios from "axios";

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dim: 0,
      size: 0,
      tileSize: 15,
      sC: 0,
      sV: "",
      sM: "sZ",
      manualCols: "true",
      verts: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.timeGetReq = this.timeGetReq.bind(this);
    this.formGetReq = this.formGetReq.bind(this);
    this.formPostReq = this.formPostReq.bind(this);
  }

  handleInputChange(event) {
    console.log(`${event.target.name} value changed to`, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCheckboxChange() {
    const oMC = this.state.manualCols;
    if (oMC === "true") {
      this.setState(() => ({ manualCols: "false" }));
    } else {
      this.setState(() => ({ manualCols: "true" }));
    }
    console.log("manual colors changed to ", this.state.manualCols);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("submitted form =", this.state);

    // API request
    // this.formGetReq(this.state)
    this.formPostReq(this.state);
    this.ttmReq(this.state.dim);
    this.colorsReq(this.state.dim);

    // PROPS call here
    this.props.saveUp(this.state);
  }

  timeGetReq() {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:3000/backend/time",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  formGetReq(cS) {
    axios
      .get("http://localhost:3000/backend/getV", {
        params: {
          dim: cS.dim,
          size: cS.size,
          tileSize: cS.tileSize,
          sC: cS.sC,
          sV: cS.sV,
          sM: cS.sM,
        },
      })
      .then((response) => {
        // API output data
        console.log("Get-Req response.data =", response.data);
        // What you want to do with the API output data
      })
      .catch((error) => {
        console.log(error);
      });
  }

  formPostReq(cS) {
    console.log("cS ,", cS);
    axios
      .post("http://localhost:3000/backend/getV", {
        params: {
          dim: cS.dim,
          size: cS.size,
          tileSize: this.state.tileSize,
          sC: cS.sC,
          sV: cS.sV,
          sM: cS.sM,
        },
      })
      .then((response) => {
        // API output data
        console.log(
          "Post-Req response.data.vertices =",
          response.data.vertices
        );
        this.props.saveVerts(response.data.vertices);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  colorsReq(dim) {
    dim = parseInt(dim);
    console.log("typeof dim ,", typeof dim);
    let numCols = 0;
    if (dim % 2 === 0) {
      numCols = dim / 2 - 1;
    } else {
      numCols = (dim - 1) / 2;
    }
    axios
      .post("http://localhost:3000/backend/getColors", {
        params: {
          manualCols: this.state.manualCols,
          numCols: numCols,
        },
      })
      .then((response) => {
        // API output data
        console.log("Post-Req response.data.colors =", response.data.colors);
        this.props.saveColors(response.data.colors);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ttmReq(dim) {
    axios
      .post("http://localhost:3000/backend/getttm", {
        params: {
          dim: dim,
        },
      })
      .then((response) => {
        // API output data
        console.log("Post-Req response.data.ttm =", response.data.ttm);
        this.props.savettm(response.data.ttm);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.setState({ dim: 5, size: 5, sC: 0, sV: "[0, 0, 0, 0, 0]", sM: "sZ" });
  }

  render() {
    return (
      <div className="CreateForm">
        <form onSubmit={this.handleSubmit}>
          <input
            type="number"
            placeholder="dim"
            name="dim"
            onChange={this.handleInputChange}
          />
          <br />
          <input
            type="number"
            placeholder="size"
            name="size"
            onChange={this.handleInputChange}
          />
          <br />
          <input
            type="number"
            placeholder="shift constant"
            name="sC"
            step="0.00001"
            onChange={this.handleInputChange}
          />
          <br />
          <input
            type="number"
            placeholder="tile size"
            name="tileSize"
            step="0.00001"
            onChange={this.handleInputChange}
          />
          <br />
          <ul className="sMul">
            <li>
              <p>Shift by halves</p>
              <input
                type="radio"
                id="sH"
                value="sH"
                name="sM"
                onChange={this.handleInputChange}
              />
            </li>

            <li>
              <p>Shift by zeroes</p>
              <input
                type="radio"
                id="sZ"
                value="sZ"
                name="sM"
                onChange={this.handleInputChange}
              />
            </li>

            <li>
              <p>Shift randomly</p>
              <input
                type="radio"
                id="sR"
                value="sR"
                name="sM"
                onChange={this.handleInputChange}
              />
            </li>
          </ul>
          <label htmlFor="manualCols">Custom Colors</label>{" "}
          <input
            type="checkbox"
            name="manualCols"
            onChange={this.handleCheckboxChange}
          />
          <br />
          <button type="submit">Create</button>
          <br />
        </form>
      </div>
    );
  }
}

export default CreateForm;
