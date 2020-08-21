import React from "react";

import { Box } from "@material-ui/core";

import { HashRouter, Switch, Route, Redirect } from "react-router-dom";

import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Create from "./components/Create/Create";
import NotFound from "./components/NotFound/NotFound";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dim: 5,
      size: 5,
      sV: "[0,0,0,0,0]",
    };
    this.saveUp = this.saveUp.bind(this);
  }

  saveUp(state) {
    // this.setState(state);
    console.log("saveUp ", this.state);
  }

  render() {
    return (
      <Box component="span">
        <HashRouter>
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/create" component={Create} />
            <Route exact path="/about" component={About} />
            <Route path="/404" component={NotFound} />
            <Redirect to="/404" />
          </Switch>
        </HashRouter>
      </Box>
    );
  }
}

export default App;
