import React from "react";

import { Button } from "@material-ui/core";
import { Publish } from "@material-ui/icons";

import CreateNav from "./CreateNav/CreateNav";
import FormVisualizer from "./FormVisualizer/FormVisualizer";

import "./CreateForm.css";

import axios from "axios";

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curNav: "f1",
      // Form Values
      dim: 5,
      size: 5,
      tileSize: 15,
      sC: 0.00001,
      sV: "",
      sM: "sZ",
      curCol: "mc",
      // Output vertices
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

  async handleSubmit(event) {
    this.props.clearCurOutMode();
    this.props.setSingleDij();

    event.preventDefault();
    this.props.resetDijOut();
    console.log("submitted form =", this.state);

    // API request
    // this.formGetReq(this.state)
    this.formPostReq(this.state);
    this.ttmReq(this.state.dim);
    // console.log("colors before ,", this.state.colors);
    // const colors = await this.colorsReq(this.state.dim);

    // // PROPS call here
    // // console.log("colors after ,", colors);
    // // this.setState({ colors }, () => {
    // //   this.props.saveUp(this.state);
    // // });
    this.props.saveUp(this.state);
    // this.props.saveColors(colors);
    this.colorsReq(this.state.dim, this.state.curCol);
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

  async colorsReq(dim, curCol) {
    dim = parseInt(dim);
    console.log("typeof dim ,", typeof dim);
    let numCols = 0;
    if (dim % 2 === 0) {
      numCols = dim / 2 - 1;
    } else {
      numCols = (dim - 1) / 2;
    }
    let colors = await axios
      .post("http://localhost:3000/backend/getColors", {
        params: {
          curCols: curCol,
          numCols: numCols,
        },
      })
      .then((response) => {
        // API output data
        console.log("Post-Req response.data.colors =", response.data.colors);
        this.props.saveColors(response.data.colors);
        return response.data.colors;
      })
      .catch((error) => {
        console.log(error);
      });
    return colors;
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

  render() {
    return (
      <div className="CreateForm w3-container w3-teal">
        <br />

        <CreateNav
          saveUp={(s) => {
            this.setState(s);
          }}
        />

        <div className="w3-container w3-white" style={{ height: "400pt" }}>
          <FormVisualizer
            curNav={this.state.curNav}
            curState={this.state}
            saveStateUp={(state) => {
              this.setState(state);
            }}
          />
        </div>
        <br />

        <Button
          variant="contained"
          onClick={this.handleSubmit}
          size="large"
          startIcon={<Publish />}
        >
          Create
        </Button>
        <br />
        <br />
      </div>
    );
  }
}

export default CreateForm;
